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
import { isObservable, of } from 'rxjs';
import { ValidacaoCampo } from '../../enum/validacaoCampo';

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
        MatSlideToggleModule
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit, AfterViewInit {
    @Input() titulo!: string;
    @Input() subtitulo!: string;
    @Input({ required: true }) campos!: Campo[];
    @Output() submit = new EventEmitter<object>();
    @ViewChildren('controle') controles!: QueryList<ElementRef>;
    form!: FormGroup;
    fb = inject(FormBuilder);

    linhas: Campo[][] = [];

    ngOnInit(): void {
        if (this.campos) {
            this.form = this.fb.group({});
            this.campos.forEach((campo) => {
                let validators = [];
                if (campo.obrigatorio) {
                    validators.push(Validators.required);
                }
                if (campo.validacao == ValidacaoCampo.email) {
                    validators.push(Validators.email);
                }
                if (campo.validacao == ValidacaoCampo.cpfCnpj) {
                    validators.push((control: { value: string; }) => {
                        if (control.value.length === 14) {
                            var cpfLimpo = control.value.replaceAll(".", "").replaceAll("-", "");

                            var aux = 0;
                            for (let i = 0; i < 9; i++) {
                                aux += parseInt(cpfLimpo[i]) * (10 - i);
                            }

                            aux = (aux * 10) % 11;
                            if (aux !== parseInt(cpfLimpo[9])) {
                                return { cpfCnpjInvalido: true };
                            }
                            aux = 0
                            for (let i = 0; i < 10; i++) {
                                aux += parseInt(cpfLimpo[i]) * (11 - i);
                            }
                            
                            aux = (aux * 10) % 11;
                            if (aux !== parseInt(cpfLimpo[10])) {
                                return { cpfCnpjInvalido: true };
                            }

                        } else if (control.value.length === 18) {
                            // const pattern = /^[a-zA-Z0-9]{2}\.[a-zA-Z0-9]{3}\.[a-zA-Z0-9]{3}\/[a-zA-Z0-9]{4}-[a-zA-Z0-9]{2}$/;
                            // if (!pattern.test(control.value)) {
                            //     if (!pattern.test(control.value)) {
                            //         return { cpfCnpjInvalido: true }; // Define o erro com a chave 'cpfCnpjInvalido'
                            //     }
                            // }
                        } else {
                            return { cpfCnpjInvalido: true };
                        }
                        return null; // Return null if no error
                    });
                }
                if (campo.lista && !isObservable(campo.lista)) {
                    campo.listaObservable = of(campo.lista); // Converte arrays simples em Observable
                }
                this.form.addControl(
                    campo.nome,
                    this.fb.control(campo.valor || '', validators)
                );
            });
            this.agruparCamposPorLinha();
        }
    }

    ngAfterViewInit(): void {
        this.controles.forEach((controle, index) => {
            const campo = this.campos[index];
            if (campo.mascara) {
                if (campo.mascara === 'CPFCNPJ') {
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
}