# Nodit AI Agent

A comprehensive Web3 AI assistant powered by Nodit's blockchain data API, built with Next.js, Vercel AI SDK, and OpenAI. This application provides natural language access to blockchain data across multiple EVM networks with secure wallet-based authentication.

## 🚀 Features

- **Multi-Chain Support**: Query blockchain data across Ethereum, Polygon, Arbitrum, Avalanche, Optimism, Base, and Blast
- **Natural Language Interface**: Ask questions about blockchain data in plain English
- **Secure Authentication**: SIWE (Sign-In with Ethereum) wallet-based authentication
- **Real-time AI Responses**: Powered by OpenAI GPT-4 with streaming responses
- **Comprehensive Data Access**: Token transfers, balances, block data, and transaction details
- **Smart Contract Interaction**: Read and write contract functions across supported chains

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Web3**: Wagmi, Viem, RainbowKit
- **AI**: Vercel AI SDK, OpenAI GPT-4
- **Authentication**: NextAuth.js with SIWE
- **Blockchain Data**: Nodit Web3 Data API
- **Agent Framework**: Coinbase AgentKit

### Project Structure

```
├── apps/web/                          # Main Next.js application
│   ├── app/
│   │   ├── api/chat/route.ts          # AI chat API endpoint
│   │   ├── chat/                      # Chat page and utilities
│   │   ├── components/                # React components
│   │   ├── config/                    # Chain and wallet configurations
│   │   └── utils/chat/                # AI agent tools and providers
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Nodit API key
- OpenAI API key
- Agent private key (for blockchain interactions)

### Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```bash
# Nodit API Configuration
NODIT_API_KEY=your_nodit_api_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Agent Configuration (for blockchain transactions)
AGENT_PRIVATE_KEY=0x_your_private_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔐 Authentication System

### SIWE (Sign-In with Ethereum) Integration

The application uses SIWE for secure, wallet-based authentication. Users must connect their wallet and sign a message to access the AI chat functionality.

#### Authentication Flow

```typescript
// apps/web/app/components/SiweAuth.tsx
const handleSignIn = async () => {
    if (!address) return;

    // Create SIWE message
    const message = createSiweMessage({
        address,
        chainId: baseSepolia.id,
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        statement: "Sign in to Nodit AI Agent",
        nonce: Math.random().toString(36).substring(2, 15),
    });

    // Sign the message
    const signature = await signMessageAsync({
        account: address,
        message,
    });

    // Authenticate with NextAuth
    const result = await signIn("credentials", {
        message,
        signature,
        redirect: false,
    });
};
```

#### NextAuth Configuration

```typescript
// apps/web/app/utils/scaffold-eth/auth.ts
export const siweAuthOptions = ({
    chain,
}: {
    chain: Chain;
}): NextAuthOptions => ({
    providers: [
        CredentialsProvider({
            name: "Ethereum",
            credentials: {
                message: { label: "Message", type: "text" },
                signature: { label: "Signature", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.message || !credentials?.signature) {
                    return null;
                }

                const siweMessage = new SiweMessage(credentials.message);
                const result = await siweMessage.verify({
                    signature: credentials.signature,
                });

                if (result.success) {
                    return {
                        id: siweMessage.address,
                        address: siweMessage.address,
                    };
                }
                return null;
            },
        }),
    ],
    // ... additional configuration
});
```

## 🤖 AI Integration

### Vercel AI SDK with OpenAI

The chat functionality is powered by the Vercel AI SDK with OpenAI's GPT-4 model, providing streaming responses and tool calling capabilities.

#### Chat API Route

```typescript
// apps/web/app/api/chat/route.ts
export async function POST(req: Request) {
    // Authenticate user
    const session = await getServerSession(
        siweAuthOptions({ chain: baseSepolia })
    );
    const userAddress = session?.user?.address;

    if (!userAddress) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages, chainId } = await req.json();
    const { agentKit } = await createAgentKit(chainId);

    // Stream AI response with tools
    const result = await streamText({
        model: openai("gpt-4-turbo-preview"),
        system: systemPrompt,
        messages,
        tools: getTools(agentKit),
    });

    return result.toDataStreamResponse();
}
```

#### Client-Side Chat Hook

```typescript
// apps/web/app/chat/page.tsx
const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
        maxSteps: 10,
        body: { chainId },
    });
```

## 🌐 Nodit Integration

### Nodit Provider Implementation

The Nodit provider enables natural language queries for blockchain data across multiple networks.

```typescript
// apps/web/app/utils/chat/agentkit/action-providers/NoditProvider.ts
export function noditProvider(config?: NoditConfig): ActionProvider {
    const apiKey = config?.apiKey || process.env.NODIT_API_KEY;

    return {
        name: "nodit",
        description: "Nodit Web3 Data API provider for blockchain data queries",
        actions: [
            {
                name: "getTokenTransfersByAccount",
                description:
                    "Get token transfer history for a specific account",
                schema: z.object({
                    network: z
                        .string()
                        .describe(
                            "The blockchain network (e.g., 'ethereum', 'polygon')"
                        ),
                    chainType: z
                        .string()
                        .describe(
                            "The chain type (e.g., 'mainnet', 'testnet')"
                        ),
                    accountAddress: z
                        .string()
                        .describe("The account address to query"),
                    fromDate: z.string().optional(),
                    toDate: z.string().optional(),
                    limit: z.number().optional(),
                    offset: z.number().optional(),
                }),
                handler: async (params) => {
                    const url = `${NODIT_BASE_URL}/${params.network}/${params.chainType}/token/getTokenTransfersByAccount`;

                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "X-API-KEY": apiKey,
                            accept: "application/json",
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            accountAddress: params.accountAddress,
                            fromDate: params.fromDate,
                            toDate: params.toDate,
                            limit: params.limit,
                            offset: params.offset,
                        }),
                    });

                    const data = await response.json();
                    return {
                        success: true,
                        data,
                        message: `Retrieved token transfers for account ${params.accountAddress}`,
                    };
                },
            },
            // ... additional actions
        ],
    };
}
```

### Supported Nodit Actions

1. **getTokenTransfersByAccount**: Query token transfer history
2. **getTokenBalancesByAccount**: Get current token balances
3. **getBlockByNumber**: Retrieve block information
4. **getTransactionByHash**: Get transaction details

### Usage Examples

```typescript
// Query token transfers
await noditProvider().actions[0].handler({
    network: "ethereum",
    chainType: "mainnet",
    accountAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
    limit: 10,
});

// Get token balances
await noditProvider().actions[1].handler({
    network: "polygon",
    chainType: "mainnet",
    accountAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
});
```

## 🔗 Multi-Chain Configuration

### Supported Networks

The application supports the following EVM-compatible networks:

```typescript
// apps/web/app/config/chains.ts
export const CHAINS = {
    [mainnet.id]: {
        ...mainnet,
        name: "Ethereum",
        icon: "⟠",
        explorer: "https://etherscan.io",
        rpc: "https://eth.llamarpc.com",
    },
    [polygon.id]: {
        ...polygon,
        name: "Polygon",
        icon: "🟣",
        explorer: "https://polygonscan.com",
        rpc: "https://polygon-rpc.com",
    },
    [arbitrum.id]: {
        ...arbitrum,
        name: "Arbitrum",
        icon: "🟨",
        explorer: "https://arbiscan.io",
        rpc: "https://arb1.arbitrum.io/rpc",
    },
    [avalanche.id]: {
        ...avalanche,
        name: "Avalanche",
        icon: "🔺",
        explorer: "https://snowtrace.io",
        rpc: "https://api.avax.network/ext/bc/C/rpc",
    },
    // ... additional chains
};
```

### Wagmi Configuration

```typescript
// apps/web/app/config/wagmi.ts
export const config = createConfig({
    chains: [
        mainnet,
        baseSepolia,
        base,
        optimism,
        arbitrum,
        polygon,
        avalanche,
        blast,
    ],
    transports: {
        [mainnet.id]: http(CHAINS[mainnet.id].rpc),
        [polygon.id]: http(CHAINS[polygon.id].rpc),
        [arbitrum.id]: http(CHAINS[arbitrum.id].rpc),
        [avalanche.id]: http(CHAINS[avalanche.id].rpc),
        // ... additional transports
    },
});
```

## 🛠️ Agent Tools System

### AgentKit Integration

The application uses Coinbase's AgentKit framework to provide structured tools for the AI agent.

```typescript
// apps/web/app/utils/chat/tools.ts
export async function createAgentKit(chainId?: number) {
    const selectedChainId = chainId || baseSepolia.id;
    const selectedChain = CHAINS[selectedChainId as keyof typeof CHAINS];

    const walletClient = createWalletClient({
        account: privateKeyToAccount(
            process.env.AGENT_PRIVATE_KEY as `0x${string}`
        ),
        chain: selectedChain,
        transport: http(selectedChain.rpc),
    });

    const viemWalletProvider = new ViemWalletProvider(walletClient as any);

    const agentKit = await AgentKit.from({
        walletProvider: viemWalletProvider,
        actionProviders: [
            walletActionProvider(),
            contractInteractor(selectedChainId),
            tokenDetailsProvider(),
            noditProvider(),
        ],
    });

    return {
        agentKit,
        address: walletClient.account.address,
        chainId: selectedChainId,
    };
}
```

### Available Tools

1. **Wallet Actions**: Balance checks, transaction signing
2. **Contract Interaction**: Read/write smart contract functions
3. **Token Details**: ERC20 token information
4. **Nodit Data**: Comprehensive blockchain data queries

## 📝 Usage Examples

### Natural Language Queries

Users can interact with the AI agent using natural language:

```
"Show me token transfers for 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45 on Ethereum mainnet"

"What are the token balances for vitalik.eth on Polygon?"

"Get details for block 18500000 on Arbitrum"

"Query the latest transactions on Avalanche"
```

### Programmatic Usage

```typescript
// Direct tool usage
const tools = getTools(agentKit);
const result = await tools.getTokenTransfersByAccount.execute({
    network: "ethereum",
    chainType: "mainnet",
    accountAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
    limit: 10,
});
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Environment Variables for Production

```bash
NODIT_API_KEY=your_production_nodit_key
OPENAI_API_KEY=your_production_openai_key
AGENT_PRIVATE_KEY=your_production_private_key
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🔒 Security Considerations

- **Private Key Management**: Store agent private keys securely
- **API Key Protection**: Use environment variables for all API keys
- **SIWE Verification**: Proper signature verification for authentication
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Input Validation**: Validate all user inputs and API parameters

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

- Create an issue on GitHub
- Check the Nodit API documentation
- Review the Vercel AI SDK documentation
