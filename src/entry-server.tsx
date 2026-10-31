import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import type { Page } from "./data/content";

export { renderHead } from "./seo";

export function render(page: Page) {
  return renderToString(
    <React.StrictMode>
      <App page={page} />
    </React.StrictMode>
  );
}
