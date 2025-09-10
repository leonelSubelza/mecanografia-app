import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';

// Es la configuración común o del lado del cliente
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideAnimationsAsync(), provideAnimationsAsync(),
    provideAnimations(),
    importProvidersFrom(MatNativeDateModule), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};

// Para abrir desde el mobile iniciar con ng serve --host 0.0.0.0