import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgxGanttModule, GANTT_GLOBAL_CONFIG } from '@worktile/gantt';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),

    // IMPORTS DE MÓDULOS QUE PRECISAM SER FORNECIDOS NO ROOT
    importProvidersFrom(
      NgxGanttModule,
      MatSnackBarModule
    ),

    // CONFIGURAÇÃO GLOBAL DO GANTT
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        viewType: 'day',      // 'day' | 'week' | 'month'
        showToolbar: true,
      }
    }
  ]
};
