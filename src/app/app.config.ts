import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgxGanttModule, GANTT_GLOBAL_CONFIG, GanttI18nLocale } from '@worktile/gantt';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),

    importProvidersFrom(
      NgxGanttModule,
      MatSnackBarModule
    ),

    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        locale: GanttI18nLocale.enUs,
        dateFormat: {
          yearQuarter: "Q'/4  de ' yyyy",
          month: "MM'/'yyyy",
          yearMonth: "'mês ' MM ' de ' yyyy"
        },
        dateOptions: {
          weekStartsOn: 0
        }
      }
    }
  ]
};
