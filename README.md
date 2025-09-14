# 🧑‍💻 MecanografiaApp

Aplicación de **mecanografía** desarrollada en **Angular v18 → v20** con **Angular Material**.  
El objetivo es mejorar la velocidad y precisión al escribir a través de dos modos de juego: **Precision Mode** y **Sprint Mode**.  

---

## ✨ Características principales

### 🎯 Precision Mode (modo raíz `/`)
- Muestra un **texto aleatorio** que el usuario debe tipear.
- Se inicia un **contador de tiempo** al comenzar.
- El toolbar permite **reiniciar** o **iniciar una nueva partida**.
- Se guardan estadísticas del mejor intento:
  - 📝 Mejor texto (por título).
  - ⏱️ Tiempo empleado.
  - 🎯 Precisión (pulsaciones correctas vs errores).
  - ⚡ Velocidad (PPM: Pulsaciones por Minuto).

### ⚡ Sprint Mode (`/sprint-mode`)
- El jugador tiene **30 segundos** para escribir la mayor cantidad de **palabras de 5 letras**.
- Puntuación:
  - ✅ Palabra sin errores: **+10 puntos**.
  - ❌ Palabra con errores: **+5 puntos**.
- Al finalizar se registran:
  - 🏆 Puntuación máxima.
  - 🔠 Total de palabras escritas.
  - ⚡ PPM.

### 👤 Usuario (`/user`)
- Permite guardar tu **nombre** para personalizar las estadísticas.

### 📊 Estadísticas (`/stats`)
- Visualiza tus **mejores resultados** en cada modo de juego.

---

## 🎨 Extras
- 🔊 **Sonido por cada tecla pulsada** (con manejo para no superponer audios).
- 🎉 **Animación de confetti** al lograr hitos importantes (usando [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti)).
- 🌗 **Modo Light/Dark** con Angular Material Theming.
- 💾 **Persistencia local** con `localStorage`.
- 🖼️ Ícono dinámico en la pestaña del navegador (cambia según el tema).

---

## 🛠️ Tecnologías usadas
- [Angular v18 → v20](https://angular.dev)
- [Angular Material](https://material.angular.io/)
- [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **LocalStorage API**

---

## 🚀 Instalación y ejecución

1. Clona el repositorio:
   ```bash
   https://github.com/leonelSubelza/mecanografia-app.git
   cd mecanografia-app
2. Instala dependencias:
   ```bash
   npm install
3. Levanta el servidor local:
    ```bash
    ng serve
4. Abre en el navegador:
    ```bash
     http://localhost:4200
---

