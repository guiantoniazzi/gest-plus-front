import { Component, inject } from "@angular/core";
import { TipoCampo } from "../../../enum/tipoCampo";
import { FormComponent } from "../../../components/form/form.component";
import { Cargo } from "../../../models/cargo";
import { CargosService } from "../cargos.service";
import { MatSnackBar } from '@angular/material/snack-bar'
import { map } from "rxjs";


@Component({
  selector: 'app-cargosCadastro',
  imports: [
    FormComponent
  ],
  templateUrl: './cargosCadastro.component.html',
  styleUrl: './cargosCadastro.component.scss',
})
export class CargosCadastroComponent {
  private cargosService = inject(CargosService);
  private snackBar = inject(MatSnackBar);

  private cargo?: Cargo;
  campos: any[] = [];

  constructor(
  ) { }

  ngOnInit(): void {
    this.cargo = this.cargosService.cargoAlteracao;

    this.campos = [
      {
        nome: 'cdCargo',
        tipo: TipoCampo.texto,
        valor: this.cargo ? this.cargo.cdCargo : undefined,
        invisivel: true,
      },
      {
        nome: 'descCargo',
        titulo: 'Descrição do Cargo',
        tipo: TipoCampo.texto,
        obrigatorio: true,
        maximo: 30,
        valor: this.cargo ? this.cargo.descCargo : undefined,
        linha: 1,
      },
      {
        nome: 'ativo',
        titulo: 'Ativo',
        tipo: TipoCampo.toggle,
        valor: this.cargo ? this.cargo.ativo : true,
        linha: 1,
      }
    ];
  }

  envio(value: any): void {
    if (this.cargo) {
      this.cargosService.alterarCargo(value).subscribe({
        next: (response) => {
          this.snackBar.open('Cargo alterado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success']
          });
        },
        error: (err) => {
          this.snackBar.open('Erro ao alterar o cargo!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      });
    }
    else {
      this.cargosService.cadastrarCargo(value).subscribe({
        next: (response) => {
          this.snackBar.open('Cargo cadastrado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-success']
          });
        },
        error: (err) => {
          this.snackBar.open('Erro ao cadastrar o cargo!', 'Fechar', {
            duration: 3000,
            panelClass: ['snack-bar-failed']
          });
        }
      });
    }
  }
}