import {
    mainnet,
    base,
    optimism,
    arbitrum,
    polygon,
    avalanche,
    blast,
    baseSepolia,
} from "viem/chains";

export const CHAINS = {
    [mainnet.id]: {
        ...mainnet,
        name: "Ethereum",
        icon: "⟠",
        factory: "0x0000000000000000000000000000000000000000", // Add actual factory address if needed
        explorer: "https://etherscan.io",
        rpc: "https://eth.llamarpc.com",
    },
    [base.id]: {
        ...base,
        name: "Base",
        icon: "🟦",
        factory: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
        explorer: "https://basescan.org",
        rpc: "https://mainnet.base.org",
    },
    [baseSepolia.id]: {
        ...baseSepolia,
        name: "Base Sepolia",
        icon: "🔵",
        factory: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
        explorer: "https://sepolia.basescan.org",
        rpc: "https://sepolia.base.org",
    },

    [optimism.id]: {
        ...optimism,
        name: "Optimism",
        icon: "🟧",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://optimistic.etherscan.io",
        rpc: "https://mainnet.optimism.io",
    },
    [arbitrum.id]: {
        ...arbitrum,
        name: "Arbitrum",
        icon: "🟨",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://arbiscan.io",
        rpc: "https://arb1.arbitrum.io/rpc",
    },
    [polygon.id]: {
        ...polygon,
        name: "Polygon",
        icon: "🟣",
        factory: "0x0000000000000000000000000000000000000000", // Add actual factory address if needed
        explorer: "https://polygonscan.com",
        rpc: "https://polygon-rpc.com",
    },
    [avalanche.id]: {
        ...avalanche,
        name: "Avalanche",
        icon: "🔺",
        factory: "0x0000000000000000000000000000000000000000", // Add actual factory address if needed
        explorer: "https://snowtrace.io",
        rpc: "https://api.avax.network/ext/bc/C/rpc",
    },
    [blast.id]: {
        ...blast,
        name: "Blast",
        icon: "💥",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://blastscan.io",
        rpc: "https://rpc.blast.io",
    },
} as const;
