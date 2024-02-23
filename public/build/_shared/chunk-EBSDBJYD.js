import {
  configureStore,
  userSlice_default
} from "/build/_shared/chunk-2OV7O5PJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-4FV6DEOC.js";

// app/state/store.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/state/store.ts"
  );
  import.meta.hot.lastModified = "1708653337767.8157";
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
//# sourceMappingURL=/build/_shared/chunk-EBSDBJYD.js.map
