export const noditExamples = [
    {
        title: "Token Transfer History",
        description: "Get token transfer history for an account",
        prompt: "Show me the token transfers for address 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 on Ethereum mainnet from January 2025",
    },
    {
        title: "Token Balances",
        description: "Check current token balances for an account",
        prompt: "What are the current token balances for address 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 on Ethereum mainnet?",
    },
    {
        title: "Block Information",
        description: "Get detailed information about a specific block",
        prompt: "Show me details about block 19000000 on Ethereum mainnet including transactions",
    },
    {
        title: "Transaction Details",
        description: "Get comprehensive transaction information",
        prompt: "Get details for transaction 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef on Ethereum mainnet",
    },
];

export const supportedNetworks = [
    { name: "Ethereum", network: "ethereum", chains: ["mainnet", "testnet"] },
    { name: "Polygon", network: "polygon", chains: ["mainnet", "testnet"] },
    { name: "Base", network: "base", chains: ["mainnet", "testnet"] },
    { name: "Arbitrum", network: "arbitrum", chains: ["mainnet", "testnet"] },
];
