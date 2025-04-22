import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-pessoas',
  imports: [],
  templateUrl: './pessoas.component.html',
  styleUrl: './pessoas.component.scss',
})
export class PessoasComponent {
  private http = inject(HttpClient);

  getPessoas() {
    this.http
      .get(`${environment.apiBaseUrl}${environment.endpoints.pessoas}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (value: any) => {
          console.log(value);
          // this.router.navigate(['/pessoas']);
        },
        error(err) {
          console.error(err);
        },
      });
  }
}
