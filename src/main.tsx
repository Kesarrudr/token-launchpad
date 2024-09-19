import React, { lazy } from "react";
import { createRoot } from "react-dom/client";
import { AppLoaderComponent } from "./components/app-loader.tsx";
import AppWalletProvider from "./context/AppWalletContext.tsx";
import ToastProvider from "./context/ToastityProvider.tsx";
import "./index.css";
import("@solana/wallet-adapter-react-ui/styles.css");

const App = lazy(() => import("./App.tsx"));

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback={<AppLoaderComponent />}>
      <AppWalletProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AppWalletProvider>
    </React.Suspense>
  </React.StrictMode>,
);
