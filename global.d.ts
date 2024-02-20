// global.d.ts

// Extend the Window interface
declare global {
    interface Window {
      __PRELOADED_STATE__?: any; // Define the type of __PRELOADED_STATE__ here
    }
  }
  
  export {};
  