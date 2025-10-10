import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { Overlay, RepositionScrollStrategy } from '@angular/cdk/overlay';
import { MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';

// export function scrollFactory(overlay: Overlay): () => RepositionScrollStrategy {
//   return () => overlay.scrollStrategies.reposition();
// }

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    // {
    //   provide: MAT_DATEPICKER_SCROLL_STRATEGY,
    //   useFactory: scrollFactory,
    //   deps: [Overlay]
    // }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
