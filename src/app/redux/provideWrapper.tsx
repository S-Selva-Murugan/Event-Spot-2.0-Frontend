"use client";

import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { CircularProgress } from "@mui/material";

export function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<CircularProgress />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
