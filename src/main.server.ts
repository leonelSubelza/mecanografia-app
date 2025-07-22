import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Este archivo es el punto de entrada de la app cuando se renderiza en el servidor, 
// usado exclusivamente cuando se usa SSR (Angular Universal).
// Se utiliza config que se una configuración combinada de app.config.ts y app.config.server.ts.
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
