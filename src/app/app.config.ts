import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideAnimationsAsync(), provideAnimationsAsync(),
    provideAnimations(),
    importProvidersFrom(MatNativeDateModule)
  ]
};
