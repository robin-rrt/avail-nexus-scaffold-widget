# Avail Nexus Scaffold-ETH 2 Extension

A comprehensive extension for Scaffold-ETH 2 that integrates the Avail Nexus SDK for cross-chain token operations.

## Features

- **Cross-Chain Transfers**: Transfer tokens across multiple supported chains
- **Bridge Operations**: Bridge tokens between different chains
- **Unified Balance Display**: View your portfolio across all supported chains
- **Simulation Support**: Simulate transfers and bridge operations before execution
- **Privy Integration**: Seamless wallet integration with Privy
- **Real-time Status Updates**: Track transaction status and results

## Supported Chains

- Ethereum
- Optimism
- Polygon
- Arbitrum
- Avalanche
- Base
- Linea
- Scroll

## Supported Tokens

- ETH
- USDC
- USDT

## Installation

1. Copy the extension files to your Scaffold-ETH 2 project
2. Install the required dependencies:

```bash
yarn add avail-nexus-sdk@0.0.4-dev.1 viem
```

3. Add the NexusProvider to your app's provider hierarchy
4. Import and use the Nexus components in your pages

## Usage

### 1. Provider Setup

Add the NexusProvider to your app's provider hierarchy:

```tsx
import { NexusProvider } from "./app/nexus/NexusContext";

function ScaffoldEthAppWithProviders({ children }: { children: React.ReactNode }) {
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

### 2. Using the Nexus Page

The extension provides a complete Nexus page with all functionality:

```tsx
import NexusPage from "./app/nexus/page";

// Use in your app
<NexusPage />
```

### 3. Individual Components

You can also use individual components:

```tsx
import { InitNexus } from "./app/nexus/InitNexus";
import { useNexusSdk } from "./app/nexus/NexusContext";

function MyComponent() {
  const { sdk } = useNexusSdk();
  
  // Use the SDK for custom operations
  const handleCustomTransfer = async () => {
    if (!sdk) return;
    
    const result = await sdk.transfer({
      token: "ETH",
      amount: "0.1",
      chainId: 1, // Ethereum
      recipient: "0x...",
    });
  };
  
  return (
    <div>
      <InitNexus />
      {/* Your custom UI */}
    </div>
  );
}
```

## Components

### InitNexus
Handles wallet creation and Nexus SDK initialization.

### ShowBalance
Displays the connected address and unified balance across all chains.

### Transfer
Provides cross-chain transfer functionality with simulation support.

### Bridge
Enables bridging tokens between different chains.

### UnifiedBalanceDropdown
Shows a detailed breakdown of your portfolio across all supported chains.

## API Reference

### useNexusSdk Hook

```tsx
const { sdk, setSdk } = useNexusSdk();
```

- `sdk`: The initialized Nexus SDK instance
- `setSdk`: Function to update the SDK instance

### Transfer Parameters

```tsx
interface TransferParams {
  token: SUPPORTED_TOKENS;
  amount: string;
  chainId: SUPPORTED_CHAINS_IDS;
  recipient: `0x${string}`;
}
```

### Bridge Parameters

```tsx
interface BridgeParams {
  token: SUPPORTED_TOKENS;
  amount: string;
  chainId: SUPPORTED_CHAINS_IDS;
}
```

## Configuration

The extension uses the following configuration:

- **Network**: Mainnet (configurable in InitNexus)
- **Wallet Provider**: Privy embedded wallet
- **Default Chain**: Base (configurable)

## Error Handling

The extension includes comprehensive error handling:

- SDK initialization errors
- Transfer/bridge failures
- Network connectivity issues
- User input validation

## Development

To extend the functionality:

1. Add new components to the `app/nexus/` directory
2. Update the main page to include new features
3. Add new chain/token support in the constants
4. Test thoroughly with the simulation features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the [Scaffold-ETH 2 documentation](https://docs.scaffoldeth.io/)
- Review the [Avail Nexus SDK documentation](https://docs.availproject.org/)
- Open an issue in the repository 