import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IMask } from 'angular-imask';
import { Campo } from '../../models/campo';
import { TipoCampo } from '../../enum/tipoCampo';
import { isObservable, map, of, startWith, switchMap } from 'rxjs';
import { ValidacaoCampo } from '../../enum/validacaoCampo';
import { AuthService } from '../../guard/auth.service';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { PessoasService } from '../../pages/pessoas/pessoas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatSelectModule,
        MatSlideToggleModule,
        NgxMatSelectSearchModule
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    ],
})
export class FormComponent implements OnInit, AfterViewInit {
    @Input() titulo!: string;
    @Input() subtitulo!: string;
    @Input({ required: true }) campos!: Campo[];
    @Output() submit = new EventEmitter<object>();
    @ViewChildren('controle') controles!: QueryList<ElementRef>;
    form!: FormGroup;
    fb = inject(FormBuilder);
    authService = inject(AuthService);
    pessoasService = inject(PessoasService);
    private snackBar = inject(MatSnackBar);

    linhas: Campo[][] = [];

    constructor() {
        // Garante que o DateAdapter use pt-BR
        inject(DateAdapter).setLocale('pt-BR');
    }

    ngOnInit(): void {
        if (this.campos) {
            this.form = this.fb.group({});
            this.campos.forEach((campo) => {
                let validators = [];
                const isVisible = !campo.invisivel && this.verificarCondicao(campo.condicao);

                // Se obrigatorioDisplayed está definido, usa ele para obrigatoriedade apenas quando visível
                if (campo.obrigatorioDisplayed && isVisible) {
                    validators.push(Validators.required);
                } 
                if (campo.obrigatorio) {
                    validators.push(Validators.required);
                }
                if (campo.validacao == ValidacaoCampo.email) {
                    validators.push(Validators.email);
                }
                if (campo.validacao == ValidacaoCampo.cpfCnpj) {
                    validators.push((control: { value: string; }) => {
                        if (!control.value) return null;
                        const rawValue = control.value.replace(/\D/g, ''); // Remove tudo que não é número

                        if (rawValue.length === 11) {
                            // Validação de CPF
                            let aux = 0;
                            for (let i = 0; i < 9; i++) {
                                aux += parseInt(rawValue[i]) * (10 - i);
                            }
                            aux = (aux * 10) % 11;
                            if (aux !== parseInt(rawValue[9])) {
                                return { cpfCnpjInvalido: true };
                            }
                            aux = 0;
                            for (let i = 0; i < 10; i++) {
                                aux += parseInt(rawValue[i]) * (11 - i);
                            }
                            aux = (aux * 10) % 11;
                            if (aux !== parseInt(rawValue[10])) {
                                return { cpfCnpjInvalido: true };
                            }
                        } else if (rawValue.length === 14) {
                            // Validação de CNPJ (pode adicionar aqui se quiser)
                            // Se não quiser validar, apenas aceite
                        } else {
                            return { cpfCnpjInvalido: true };
                        }
                        return null;
                    });
                }
                if (campo.lista && !isObservable(campo.lista)) {
                    campo.listaObservable = of(campo.lista); // Converte arrays simples em Observable
                }
                this.form.addControl(
                    campo.nome,
                    this.fb.control(campo.valor || '', validators)
                );
                if(campo.tipo === TipoCampo.select && campo.listaObservable) {
                    // Adiciona um FormControl para o filtro do select
                    this.form.addControl('filtro'+campo.nome, this.fb.control(''));

                    // Aplica o filtro à listaObservable
                    const originalLista$ = campo.listaObservable;
                    campo.listaObservable = this.form.get('filtro'+campo.nome)!.valueChanges.pipe(
                        // Inicia com o valor atual do filtro
                        startWith(''),
                        // Aplica o filtro
                        switchMap(filtro => {
                            return originalLista$.pipe(
                                map(lista => lista.filter(item => item.label.toLowerCase().includes(filtro.toLowerCase())))
                            );
                        })
                    );
                }
            });
            this.agruparCamposPorLinha();
        }
    }

    ngAfterViewInit(): void {
        this.controles.forEach((controle, index) => {
            const campo = this.campos[index];
            if (campo.mascara) {
                if (campo.mascara === 'CPFCNPJ') {
                    // TODO: QUANDO DA CTRL V ELE FODDE TUDO
                    // Máscara condicional para CPF ou CNPJ
                    const mask = IMask(controle.nativeElement, {
                        mask: [
                            { mask: '***.***.***-**', maxLength: 11 }, // CPF alfanumérico
                            { mask: '**.***.***/****-**', maxLength: 14 } // CNPJ alfanumérico
                        ],
                        dispatch: function (appended, dynamicMasked) {
                            // Remove caracteres não alfanuméricos para avaliar o comprimento real
                            const value = (dynamicMasked.value + appended).replace(/\W/g, '');
                            return value.length > 11
                                ? dynamicMasked.compiledMasks[1] // CNPJ
                                : dynamicMasked.compiledMasks[0]; // CPF
                        },
                        // Atualiza o valor do FormControl com o valor formatado
                        onAccept: () => {
                            const formControl = this.form.get(campo.nome);
                            if (formControl) {
                                formControl.setValue(mask.value); // Atualiza o valor do FormControl
                                formControl.updateValueAndValidity(); // Atualiza a validação do FormControl
                            }
                        }
                    });
                } else {
                    // Máscara padrão
                    const mask = IMask(controle.nativeElement, {
                        mask: campo.mascara,
                        onAccept: () => {
                            const formControl = this.form.get(campo.nome);
                            if (formControl) {
                                formControl.setValue(mask.value); // Atualiza o valor do FormControl
                                formControl.updateValueAndValidity(); // Atualiza a validação do FormControl
                            }
                        }
                    });
                }
            }
        });
    }

    agruparCamposPorLinha(): void {
        const grupos: { [linha: number]: Campo[] } = {};

        this.campos.forEach((campo) => {
            const linha = campo.linha ?? 0; // Use 0 como padrão se `linha` não estiver definido
            if (!grupos[linha]) {
                grupos[linha] = [];
            }
            grupos[linha].push(campo);
        });

        this.linhas = Object.values(grupos);
    }

    onSubmit(event: Event): void {
        event.stopPropagation();
        if (this.form.valid) {
            this.submit.emit(this.form.value);
        }
    }

    verificarCondicao(condicao: string | undefined): boolean {
        if (!condicao) {
            return true; // Se não houver condição, o campo é exibido por padrão
        }
        try {
            // Avalia a condição no contexto do componente
            return new Function(`return ${condicao}`).call(this);
        } catch (error) {
            console.error('Erro ao avaliar a condição:', condicao, error);
            return false; // Se houver erro na avaliação, o campo não será exibido
        }
    }

    changeEmpresaUsuario(event: any) {
        this.form.get('empresaUsuario')?.reset();
        this.form.get('empresa')?.reset();
        this.form.get('funcionario')?.reset();
    }

    changeToggleExclusive(event: any, campo: any) {
        console.log('changeToggleExclusive', event, campo);
        if (event.checked) {
            // Desmarca todos os outros toggles da mesma linha, exceto o atual e o 'ativo'
            this.campos.forEach(c => {
                if (
                    c.tipo === TipoCampo.toggle &&
                    c.nome !== 'ativo' &&
                    c.nome !== campo.nome &&
                    c.linha === campo.linha
                ) {
                    // Atualiza tanto o valor do campo quanto o valor do FormControl
                    c.valor = false;
                    const control = this.form.get(c.nome);
                    if (control) {
                        control.setValue(false);
                    }
                }
            });
        }
    }

    callDynamicChange(event: any, campo: any) {
        if (campo.change && typeof campo.change === 'string') {
            // Extrai o nome da função (ex: 'changeToggleExclusive($event, campo)' => 'changeToggleExclusive')
            const fnName = campo.change.split('(')[0].trim();
            const fn = (this as any)[fnName];
            if (typeof fn === 'function') {
                fn.call(this, event, campo);
            }
        }
    }

    changeCliente(event: any) {
        console.log('changeCliente', event);
        this.pessoasService.getFuncionarios(event.value).subscribe({
            next: (clientes) => {
                const lista = clientes.map((c: any) => ({ label: c.pessoaAux.nome, valor: c.cdPessoa }));
                const campoResp = this.campos.find(c => c.nome === 'cdRespProj');
                if (campoResp) {
                    campoResp.lista = lista;
                    campoResp.listaObservable = of(lista);
                }
            },
            error: () => {
                this.snackBar.open('Erro ao buscar responsáveis!', 'Fechar', {
                    duration: 3000,
                    panelClass: ['snack-bar-failed']
                });
                const campoResp = this.campos.find(c => c.nome === 'cdRespProj');
                if (campoResp) {
                    campoResp.lista = [];
                    campoResp.listaObservable = of([]);
                }
            }
        });
    }

    patchForm(valores: any) {
        console.log(valores)
        this.form.patchValue(valores);
    }
}