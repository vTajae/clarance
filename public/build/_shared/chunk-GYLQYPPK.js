import {
  configureStore,
  userSlice_default
} from "/build/_shared/chunk-EB64VCHI.js";
import {
  createHotContext
} from "/build/_shared/chunk-4FV6DEOC.js";

// app/state/store.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/state/store.ts"
  );
  import.meta.hot.lastModified = "1708672520859.668";
}
var initializeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice_default
    },
    preloadedState
  });
};

export {
  initializeStore
};
//# sourceMappingURL=/build/_shared/chunk-GYLQYPPK.js.map
