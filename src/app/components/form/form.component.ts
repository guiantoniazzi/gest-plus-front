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
import { IMask } from 'angular-imask';
import { Campo } from '../../models/campo';
import { TipoCampo } from '../../enum/tipoCampo';
import { Observable } from 'rxjs';
import { FuncoesSistema } from '../../models/funcoesSistema';

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
        MatSelectModule
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
                if (campo.tipo == TipoCampo.email) {
                    validators.push(Validators.email);
                }
                this.form.addControl(
                    campo.nome,
                    this.fb.control('', validators)
                );
            });
            this.agruparCamposPorLinha();
        }
    }

    ngAfterViewInit(): void {
        this.controles.forEach((controle, index) => {
            if (this.campos[index].mascara) {
                IMask(controle.nativeElement, {
                    mask: this.campos[index].mascara,
                });
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
}