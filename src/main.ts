import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Punto de entrada principal, se ejecuta cuando Angular inicia desde el lado del cliente/navegador
// Esto inicializa la app usando la configuración definida en app.config.ts, que es la configuración cliente.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
