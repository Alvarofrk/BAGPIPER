import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import type { Page } from "./data/content";
import "./styles/global.css";

const container = document.getElementById("app")!;
const page = (container.dataset.page as Page | undefined) ?? "home";
const cocktailId = container.dataset.cocktail;
const app = (
  <React.StrictMode>
    <App page={page} cocktailId={cocktailId} />
  </React.StrictMode>
);

// En producción el HTML viene prerenderizado y se hidrata; en desarrollo el contenedor llega vacío.
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
