"use client";

import React, { useState, useEffect } from "react";
import { Address } from "~~/components/scaffold-eth/Address/Address";
import { Balance } from "~~/components/scaffold-eth/Balance";
import { AddressInput } from "~~/components/scaffold-eth/Input/AddressInput";
import { EtherInput } from "~~/components/scaffold-eth/Input/EtherInput";
import { InitNexus } from "./InitNexus";
import { useNexusSdk } from "./NexusContext";
import { SUPPORTED_CHAINS, SUPPORTED_TOKENS, SUPPORTED_CHAINS_IDS } from "avail-nexus-sdk";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import type { TransferParams, SimulationResult } from 'avail-nexus-sdk';
import { useAccount } from "wagmi";


// Chain options for select
const CHAIN_OPTIONS = [
  { id: SUPPORTED_CHAINS.ETHEREUM, name: "Ethereum" },
  { id: SUPPORTED_CHAINS.OPTIMISM, name: "Optimism" },
  { id: SUPPORTED_CHAINS.POLYGON, name: "Polygon" },
  { id: SUPPORTED_CHAINS.ARBITRUM, name: "Arbitrum" },
  { id: SUPPORTED_CHAINS.AVALANCHE, name: "Avalanche" },
  { id: SUPPORTED_CHAINS.BASE, name: "Base" },
  { id: SUPPORTED_CHAINS.SCROLL, name: "Scroll" },
];

// Token options for select
const TOKEN_OPTIONS = [
  { value: "ETH", label: "ETH" },
  { value: "USDC", label: "USDC" },
  { value: "USDT", label: "USDT" },
];

// Define types for balance data
interface ChainInfo {
  id: number;
  name: string;
  logo: string;
}

interface TokenBreakdown {
  balance: string;
  balanceInFiat: number;
  chain: ChainInfo;
  contractAddress: string;
  decimals: number;
  universe: number;
}

interface BalanceAsset {
  abstracted: boolean;
  balance: string;
  balanceInFiat: number;
  breakdown: TokenBreakdown[];
  decimals: number;
  icon: string;
  symbol: string;
}

function UnifiedBalanceDropdown({ sdk }: { sdk: any }) {
  const [balances, setBalances] = useState<BalanceAsset[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sdk) return;
    setLoading(true);
    sdk.getUnifiedBalances()
      .then((res: BalanceAsset[]) => {
        console.log(res);
        setBalances(res);
        setLoading(false);
      })
      .catch((err: any) => {
        setError("Failed to fetch balances");
        setLoading(false);
      });
  }, [sdk]);

  if (!sdk) return null;
  if (loading) return <div>Loading unified balance...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!balances.length) return <div>No balances found.</div>;

  // Calculate total fiat value
  const totalFiat = balances.reduce((sum, b) => sum + (Number(b.balanceInFiat) || 0), 0);

  return (
    <div className="relative inline-block">
      <button
        className="btn btn-primary text-white font-bold shadow-lg mb-2"
        onClick={() => setIsOpen((v) => !v)}
        type="button"
      >
        Unified Balance: ${totalFiat.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </button>
      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-[32rem] rounded-md shadow-lg bg-base-100 border p-4">
          <div className="font-bold mb-4">Portfolio Breakdown</div>
          
          {/* Total Portfolio Value */}
          <div className="mb-4 p-2 bg-primary/10 rounded">
            <div className="text-sm text-primary/80">Total Portfolio Value</div>
            <div className="text-lg font-bold">${totalFiat.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>

          {/* Token Breakdown */}
          <div className="space-y-4">
            {balances.map((token) => (
              <div key={token.symbol} className="border rounded p-3">
                {/* Token Header */}
                <div className="flex items-center gap-2 mb-3">
                  <img src={token.icon} alt={token.symbol} className="w-6 h-6 rounded-full" />
                  <div className="font-semibold">{token.symbol}</div>
                  <div className="text-sm text-gray-500">
                    Total: {Number(token.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })} (${token.balanceInFiat.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                  </div>
                </div>

                {/* Chain Breakdown */}
                <div className="pl-8 space-y-2">
                  {token.breakdown.map((chainBalance, index) => {
                    if (Number(chainBalance.balance) === 0) return null;
                    
                    return (
                      <div key={`${token.symbol}-${chainBalance.chain.id}-${index}`} className="flex items-center gap-2 text-sm">
                        <img src={chainBalance.chain.logo} alt={chainBalance.chain.name} className="w-4 h-4 rounded-full" />
                        <span className="font-medium">{chainBalance.chain.name}</span>
                        <span className="ml-auto">
                          {Number(chainBalance.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${chainBalance.balanceInFiat.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ShowBalance() {
  const { address } = useAccount();
  const { sdk } = useNexusSdk();
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);

  useEffect(() => {
    const client = createPublicClient({
      chain: base,
      transport: http(),
    });
    client.getChainId().then(setCurrentChainId);
  }, []);

  const currentChainName = CHAIN_OPTIONS.find(c => c.id === currentChainId)?.name || "Unknown";

  return (
    <div className="mb-8 p-6 rounded-lg border bg-base-100">
      <h2 className="text-xl font-bold mb-2">Show Balance</h2>
      {sdk ? (
        <div className="flex flex-col gap-2">
          <Address address={address} />
          <UnifiedBalanceDropdown sdk={sdk} />
        </div>
      ) : (
        <div>Connect Nexus to see your unified balance.</div>
      )}
    </div>
  );
}

function Transfer() {
  const { address } = useAccount();
  const { sdk } = useNexusSdk();
  const fromAddress = address || "";
  const [recipient, setRecipient] = useState<`0x${string}` | "">("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<SUPPORTED_TOKENS>("ETH");
  const [destinationChain, setDestinationChain] = useState<SUPPORTED_CHAINS_IDS>(CHAIN_OPTIONS[0].id);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [transferResult, setTransferResult] = useState<Record<string, any> | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  useEffect(() => {
    const client = createPublicClient({
      chain: base,
      transport: http(),
    });
    client.getChainId().then(setCurrentChainId);
  }, []);

  const handleTransfer = async () => {
    setTransferResult(null);
    setTransferError(null);
    setTxStatus(null);

    if (!sdk) {
      setTransferError("Nexus SDK not initialized!");
      return;
    }
    if (!destinationChain) {
      setTransferError("No destination chain selected");
      return;
    }
    if (!recipient) {
      setTransferError("Recipient address required");
      return;
    }
    if (!amount) {
      setTransferError("Amount required");
      return;
    }

    try {
      setTxStatus("Preparing transfer...");
      
      // Convert amount to string to preserve precision
      const transferParams: TransferParams = {
        token,
        amount: amount.toString(), // Pass as string to preserve precision
        chainId: destinationChain,
        recipient: recipient as `0x${string}`,
      };

      console.log("Transfer params:", transferParams); // Debug log

      setTxStatus("Sending transfer...");
      const result = await sdk.transfer(transferParams);
      setTransferResult(result as Record<string, any>);
      setTxStatus("Transfer successful!");
      
      // Clear form after successful transfer
      setAmount("");
      setRecipient("");
    } catch (err: any) {
      setTxStatus(null);
      setTransferError(err?.message || "Transfer failed");
      console.error("Transfer error:", err);
    }
  };

  const handleSimulateTransfer = async () => {
    setSimulationResult(null);
    setSimulationError(null);

    if (!sdk) {
      setSimulationError("Nexus SDK not initialized!");
      return;
    }
    if (!destinationChain) {
      setSimulationError("No destination chain selected");
      return;
    }
    if (!recipient) {
      setSimulationError("Recipient address required");
      return;
    }
    if (!amount) {
      setSimulationError("Amount required");
      return;
    }

    try {
      const transferParams: TransferParams = {
        token,
        amount: amount.toString(), // Pass as string to preserve precision
        chainId: destinationChain,
        recipient: recipient as `0x${string}`,
      };

      console.log("Simulation params:", transferParams); // Debug log

      const result = await sdk.simulateTransfer(transferParams);
      setSimulationResult(result);
    } catch (err: any) {
      setSimulationError(err?.message || "Simulation failed");
      console.error("Simulation error:", err);
    }
  };

  return (
    <div className="mb-8 p-6 rounded-lg border bg-base-100">
      <h2 className="text-xl font-bold mb-2">Transfer</h2>
      <div className="flex flex-col gap-4">
        <AddressInput 
          value={recipient} 
          onChange={value => setRecipient(value as `0x${string}`)} 
          placeholder="Recipient address" 
        />
        <EtherInput 
          value={amount} 
          onChange={setAmount} 
          placeholder="Amount" 
        />
        <select
          className="input input-bordered"
          value={token}
          onChange={e => setToken(e.target.value as SUPPORTED_TOKENS)}
        >
          {TOKEN_OPTIONS.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          className="input input-bordered"
          value={destinationChain}
          onChange={e => setDestinationChain(Number(e.target.value) as SUPPORTED_CHAINS_IDS)}
        >
          {CHAIN_OPTIONS.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        
        {/* Simulate Transfer Button */}
        <button
          className="btn btn-secondary mt-2"
          disabled={!fromAddress || !recipient || !amount}
          onClick={handleSimulateTransfer}
        >
          Simulate Transfer
        </button>
        
        {/* Simulation Result/Error */}
        {simulationError && (
          <div className="p-2 bg-error/10 rounded text-error text-xs">
            Error: {simulationError}
          </div>
        )}
        {simulationResult && (
          <div className="p-2 bg-success/10 rounded text-success text-xs whitespace-pre-wrap">
            Simulation: {JSON.stringify(simulationResult, null, 2)}
          </div>
        )}

        {/* Transfer Button */}
        <button 
          className="btn btn-primary mt-2" 
          disabled={!fromAddress || !recipient || !amount} 
          onClick={handleTransfer}
        >
          Transfer
        </button>

        {/* Transfer Status and Results */}
        {txStatus && <div className="mt-2 text-sm">{txStatus}</div>}
        {transferError && (
          <div className="p-2 bg-error/10 rounded text-error text-xs">
            Error: {transferError}
          </div>
        )}
        {transferResult && (
          <div className="p-2 bg-success/10 rounded text-success text-xs whitespace-pre-wrap">
            Transfer Result: {JSON.stringify(transferResult, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
}

function Bridge() {
  const { address } = useAccount();
  const { sdk } = useNexusSdk();
  const connectedAddress = address || "";
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<string>("ETH");
  const [destinationChain, setDestinationChain] = useState<number>(CHAIN_OPTIONS[0].id);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [allowanceState, setAllowanceState] = useState<any>(null);
  const [intentState, setIntentState] = useState<any>(null);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [bridgeError, setBridgeError] = useState<string | null>(null);

  useEffect(() => {
    const client = createPublicClient({
      chain: base,
      transport: http(),
    });
    client.getChainId().then(setCurrentChainId);
  }, []);

  // Set hooks on SDK
  useEffect(() => {
    if (!sdk) return;
    sdk.setOnAllowanceHook(({ sources, allow }) => {
      console.log('Setting allowances for:', sources);
      allow(['min']); // Use minimum required allowances
    });
    sdk.setOnIntentHook(({ intent, allow, deny }) => {
      // The intent object shape is not fully documented; display the full object for confirmation
      // to avoid type errors and ensure all relevant info is shown.
      if (confirm(`Bridge intent:\n${JSON.stringify(intent, null, 2)}`)) {
        allow();
      } else {
        deny();
      }
    });
  }, [sdk]);

  const handleSimulate = async () => {
    setSimulationResult(null);
    setBridgeError(null);
    if (!sdk) return setBridgeError("Nexus SDK not initialized!");
    if (!destinationChain) return setBridgeError("No destination chain selected");
    try {
      const result = await sdk.simulateBridge({
        token: token as SUPPORTED_TOKENS,
        amount,
        chainId: destinationChain as SUPPORTED_CHAINS_IDS,
      });
      setSimulationResult(result);
      console.log(result);
    } catch (err: any) {
      setBridgeError(err?.message || "Simulation failed");
    }
  };

  const handleBridge = async () => {
    setTxStatus(null);
    setBridgeError(null);
    if (!sdk) return setBridgeError("Nexus SDK not initialized!");
    if (!destinationChain) return setBridgeError("No destination chain selected");
    try {
      setTxStatus("Bridging...");
      const result = await sdk.bridge({
        token: token as SUPPORTED_TOKENS,
        amount,
        chainId: destinationChain as SUPPORTED_CHAINS_IDS,
      });
      setTxStatus("Bridge sent!");
      console.log("Bridge SUCCESS result:", result);
    } catch (err: any) {
      setTxStatus(null);
      setBridgeError(err?.message || "Bridge failed");
      console.error(err);
    }
  };

  return (
    <div className="mb-8 p-6 rounded-lg border bg-base-100">
      <h2 className="text-xl font-bold mb-2">Bridge</h2>
      <div className="flex flex-col gap-4">
        <input
          className="input input-bordered"
          value={connectedAddress}
          disabled
          placeholder="Recipient address"
        />
        <EtherInput value={amount} onChange={setAmount} placeholder="Amount" />
        <select
          className="input input-bordered"
          value={token}
          onChange={e => setToken(e.target.value)}
        >
          {TOKEN_OPTIONS.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          className="input input-bordered"
          value={destinationChain}
          onChange={e => setDestinationChain(Number(e.target.value))}
        >
          {CHAIN_OPTIONS.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="btn btn-secondary mt-2" disabled={!amount} onClick={handleSimulate}>
          Simulate Bridge
        </button>
        {allowanceState && (
          <div className="p-2 bg-warning/10 rounded text-warning text-xs">
            Allowance: {JSON.stringify(allowanceState)}
          </div>
        )}
        {intentState && (
          <div className="p-2 bg-success/10 rounded text-success text-xs">
            Intent: {JSON.stringify(intentState)}
          </div>
        )}
        {bridgeError && (
          <div className="p-2 bg-error/10 rounded text-error text-xs">
            Error: {bridgeError}
          </div>
        )}
        <button className="btn btn-primary mt-2" disabled={!amount} onClick={handleBridge}>
          Bridge
        </button>
        {txStatus && <div className="mt-2 text-sm">{txStatus}</div>}
      </div>
    </div>
  );
}

export default function NexusPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <InitNexus />
      <ShowBalance />
      <Transfer />
      <Bridge />
    </div>
  );
} 