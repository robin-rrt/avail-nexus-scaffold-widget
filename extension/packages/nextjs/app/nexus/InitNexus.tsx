"use client";

import React, { useState } from "react";
import { NexusSDK } from "avail-nexus-sdk";
import { useNexusSdk } from "./NexusContext";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function InitNexus() {
  const { sdk, setSdk } = useNexusSdk();
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  // Connect wallet handler
  const handleConnectWallet = async () => {
    setError(null);
    try {
      if (!window.ethereum) throw new Error("No EVM wallet found. Please install MetaMask or another wallet.");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
    } catch (err) {
      setError("Error connecting wallet");
      console.error(err);
    }
  };

  // Initialize Nexus SDK handler
  const handleInitNexus = async () => {
    setIsInitializing(true);
    setError(null);
    try {
      if (!window.ethereum) throw new Error("No EVM wallet found");
      const provider = window.ethereum;
      const sdkInstance = new NexusSDK();
      console.log("Initializing Nexus SDK...");
      await sdkInstance.initialize(provider); //mainnet
      console.log("Nexus SDK initialized successfully");
      setSdk(sdkInstance);
    } catch (err) {
      console.error("Failed to initialize Nexus SDK:", err);
      setError("Failed to initialize Nexus SDK: " + (err as Error).message);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleDeInitNexus = async () => {
    if (!sdk) return;
    sdk.removeAllListeners();
    await sdk.deinit();
    setSdk(null);
  };

  return (
    <div className="mb-8 p-6 rounded-lg border bg-base-100">
      <h2 className="text-xl font-bold mb-2">Nexus SDK Initialization</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {!address ? (
        <button className="btn btn-primary" onClick={handleConnectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="text-success">
          Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Unknown"}
          <div className="my-2">
            <button className="btn btn-accent mb-2" onClick={handleInitNexus} disabled={isInitializing || !!sdk}>
              {isInitializing ? "Initializing..." : sdk ? "Nexus Initialized" : "Initialize Nexus"}
            </button>
          </div>
        </div>
      )}
      <button className="btn btn-accent mb-2" onClick={handleDeInitNexus} disabled={!sdk}>
        {sdk ? "Kill Nexus" : "Nexus Not Initialized"}
      </button>
    </div>
  );
}
