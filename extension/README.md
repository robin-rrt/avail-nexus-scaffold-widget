# Avail Nexus Extension

This extension adds Avail Nexus SDK integration to your Scaffold-ETH 2 project.

## What's Added

- `/nexus` page with cross-chain transfer functionality
- Nexus SDK integration with wallet connection
- Unified balance display across supported chains
- Transfer and bridge operations with simulation support

## Setup Instructions

After the extension is installed, you need to:

1. **Add NexusProvider to your app providers**

   In your `packages/nextjs/app/providers.tsx`, add the NexusProvider:

   ```tsx
   import { NexusProvider } from "./nexus/NexusContext";

   export function ScaffoldEthAppWithProviders({ children }: { children: React.ReactNode }) {
     return (
       <Provider>
         <NexusProvider>
           {/* Other providers */}
           {children}
         </NexusProvider>
       </Provider>
     );
   }
   ```

2. **Add navigation to the nexus page**

   In your navigation component, add a link to `/nexus`:

   ```tsx
   <Link href="/nexus">Nexus</Link>
   ```

## Features

- **Cross-Chain Transfers**: Transfer tokens across multiple supported chains
- **Bridge Operations**: Bridge tokens between different chains  
- **Smart Contract Execution**: Execute contracts on destination chains after bridging
- **Unified Balance Display**: View your portfolio across all supported chains
- **Simulation Support**: Simulate transfers and bridge operations before execution
- **Real-time Status Updates**: Track transaction status and results
- **React UI Components**: Pre-built widgets for easy integration
- **Allowance Management**: Automatic token approval handling

## Supported Chains

- Ethereum
- Optimism
- Polygon
- Arbitrum
- Avalanche
- Base
- Scroll

## Supported Tokens

- ETH
- USDC
- USDT

## Usage

Visit `/nexus` in your app to access the Nexus functionality. The page includes:

- Wallet connection and Nexus SDK initialization
- Unified balance display across all chains
- Cross-chain transfer interface
- Bridge operations
- Transaction simulation and execution

## Dependencies

This extension adds the following dependencies to your project:
- `@avail-project/nexus`: The Avail Nexus SDK
- `viem`: Ethereum library for interacting with the blockchain 