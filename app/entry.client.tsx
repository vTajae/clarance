// app/entry.client.tsx

import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { initializeStore } from "./state/store";
import { StrictMode } from "react";

const store = initializeStore(window.__PRELOADED_STATE__);

hydrateRoot(
  document,
  <StrictMode>
    <Provider store={store}>
      <RemixBrowser />
    </Provider>
  </StrictMode>
);
