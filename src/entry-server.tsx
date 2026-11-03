import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import type { Page } from "./data/content";

export { renderHead, renderSitemap, cocktailIds } from "./seo";

export function render(page: Page, cocktailId?: string) {
  return renderToString(
    <React.StrictMode>
      <App page={page} cocktailId={cocktailId} />
    </React.StrictMode>
  );
}
