"use client";
import React, { createContext, useContext, useState } from "react";
import { NexusSDK } from "avail-nexus-sdk";

type NexusContextType = {
  sdk: NexusSDK | null;
  setSdk: (sdk: NexusSDK | null) => void;
};

const NexusContext = createContext<NexusContextType>({
  sdk: null,
  setSdk: () => {},
});

export const useNexusSdk = () => useContext(NexusContext);

export function NexusProvider({ children }: { children: React.ReactNode }) {
  const [sdk, setSdk] = useState<NexusSDK | null>(null);
  return (
    <NexusContext.Provider value={{ sdk, setSdk }}>
      {children}
    </NexusContext.Provider>
  );
} 