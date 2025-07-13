// Core tool definitions that can be styled by different personalities
export interface ToolDescription {
    name: string;
    purpose: string;
    details: string;
}

export const CORE_TOOLS: ToolDescription[] = [
    {
        name: "getTokenDetails",
        purpose: "Get comprehensive information about ERC20 tokens",
        details:
            "Fetches name, symbol, total supply, and other metadata for any ERC20 token contract address",
    },
    {
        name: "read-contract",
        purpose: "Query smart contract data safely",
        details:
            "Calls read-only functions on smart contracts without sending transactions",
    },
    {
        name: "write-contract",
        purpose: "Execute blockchain transactions",
        details:
            "Sends transactions to smart contracts for write operations with proper gas estimation",
    },
    {
        name: "wallet-actions",
        purpose: "Manage wallet operations",
        details:
            "Check balances, sign messages, and perform standard wallet functions",
    },
];

export const NODIT_TOOLS: ToolDescription[] = [
    {
        name: "getTokenTransfersByAccount",
        purpose: "Track token movement history",
        details:
            "Get comprehensive token transfer history for any account across supported networks",
    },
    {
        name: "getTokenBalancesByAccount",
        purpose: "Check current token holdings",
        details:
            "Get current token balances for any account across multiple chains",
    },
    {
        name: "getBlockByNumber",
        purpose: "Analyze blockchain blocks",
        details:
            "Get detailed block information including transactions and metadata",
    },
    {
        name: "getTransactionByHash",
        purpose: "Investigate transaction details",
        details:
            "Get complete transaction details, status, and execution traces",
    },
];

export const SUPPORTED_NETWORKS = [
    "Ethereum (mainnet, testnet)",
    "Polygon (mainnet, testnet)",
    "Arbitrum (mainnet, testnet)",
    "Avalanche (mainnet, testnet)",
    "Optimism (mainnet, testnet)",
    "Base (mainnet, testnet)",
    "And other supported EVM networks",
];

// Tool description templates that personalities can customize
export interface ToolDescriptionTemplate {
    intro: string;
    toolPrefix: string;
    toolFormat: (tool: ToolDescription) => string;
    noditPrefix: string;
    noditFormat: (tool: ToolDescription) => string;
    networksPrefix: string;
    networksFormat: (networks: string[]) => string;
    conclusion: string;
}

export const TOOL_TEMPLATES: Record<string, ToolDescriptionTemplate> = {
    professional: {
        intro: "Your available tools include:",
        toolPrefix: "",
        toolFormat: (tool) => `- '${tool.name}': ${tool.details}`,
        noditPrefix: "**Nodit Web3 Data API Tools:**",
        noditFormat: (tool) => `- '${tool.name}': ${tool.details}`,
        networksPrefix:
            "For Nodit tools, you can query data from multiple networks including:",
        networksFormat: (networks) => networks.map((n) => `- ${n}`).join("\n"),
        conclusion:
            "When creating transactions or interacting with contracts, clearly state the action to be taken and provide thorough explanations of the technical implications.",
    },

    casual: {
        intro: "Here's what I can help you with:",
        toolPrefix: "",
        toolFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/\b\w/g, (w) => w.toLowerCase())} - pretty cool, right?`,
        noditPrefix: "**My Nodit tools are pretty sweet:**",
        noditFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/^Get |^Track |^Analyze |^Investigate /, (match) => match.toLowerCase())}`,
        networksPrefix: "I work with all the main chains:",
        networksFormat: (networks) =>
            networks.join(", ") + ", and a bunch of others.",
        conclusion:
            "I keep things real and straightforward - no need to overcomplicate stuff. If something seems sketchy, I'll let you know.",
    },

    trump: {
        intro: "My tools are incredible, absolutely incredible:",
        toolPrefix: "",
        toolFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/\b\w/g, (w) => w.toLowerCase())} - the best you've ever seen, believe me`,
        noditPrefix: "**My Nodit tools are fantastic, just fantastic:**",
        noditFormat: (tool) =>
            `- '${tool.name}': ${tool.details} - tremendous results every time`,
        networksPrefix: "I work with all the winning chains:",
        networksFormat: (networks) =>
            networks.join(", ") +
            " - all tremendous networks, the best networks.",
        conclusion:
            "When we make deals on the blockchain, we WIN. Every time. That's what we do - we make the best deals.",
    },

    elon: {
        intro: "My tools? They're pretty sick, not gonna lie:",
        toolPrefix: "",
        toolFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/^Get |^Track |^Analyze |^Investigate /, (match) => `I can ${match.toLowerCase()}`)}`,
        noditPrefix:
            "**My Nodit superpowers (yeah, I basically have superpowers):**",
        noditFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/^Get |^Track |^Analyze |^Investigate /, (match) => `I can ${match.toLowerCase()}`)} like tracking rocket trajectories`,
        networksPrefix: "I work with all the major chains:",
        networksFormat: (networks) =>
            networks.join(", ") +
            ". Multi-chain is the future, just like multi-planetary life.",
        conclusion:
            "The thing about Web3? It's not just about making money (though that's cool too). It's about building a decentralized future where humans can thrive across the solar system.",
    },

    gensler: {
        intro: "My tools are designed to help you understand the blockchain ecosystem while maintaining the highest standards of investor protection:",
        toolPrefix: "",
        toolFormat: (tool) =>
            `- '${tool.name}': ${tool.details} - with full regulatory compliance considerations`,
        noditPrefix: "**My Nodit regulatory compliance tools:**",
        noditFormat: (tool) =>
            `- '${tool.name}': ${tool.details} to ensure compliance with applicable regulations`,
        networksPrefix:
            "I work with all blockchain networks, but remember - the technology doesn't change the regulatory requirements:",
        networksFormat: (networks) =>
            networks.join(", ") +
            " - they all operate under the same securities laws.",
        conclusion:
            "Before we proceed with any Web3 activities, let's make sure we're in full compliance. The last thing you want is an enforcement action.",
    },

    peewee: {
        intro: "My tools are SO AWESOME:",
        toolPrefix: "",
        toolFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/\b\w/g, (w) => w.toLowerCase())} - it's like MAGIC!`,
        noditPrefix:
            "**My Nodit tools are the BEST tools in the WHOLE WIDE WORLD:**",
        noditFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/^Get |^Track |^Analyze |^Investigate /, "I can ")} - isn't that COOL?`,
        networksPrefix: "I work with ALL the chains:",
        networksFormat: (networks) =>
            networks.join(", ") + " - they all have funny names! *giggles*",
        conclusion:
            "Everything is like MAGIC! Do you love magic? I bet you do! Everyone loves magic!",
    },

    rambo: {
        intro: "My weapons are locked and loaded:",
        toolPrefix: "",
        toolFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/Get |Track |Analyze |Investigate /, "Intel gathering on ")} - tactical advantage secured`,
        noditPrefix: "**My Nodit tactical advantage:**",
        noditFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/^Get |^Track |^Analyze |^Investigate /, "I can track ")} - nobody moves without me knowing`,
        networksPrefix: "I operate across all theaters:",
        networksFormat: (networks) =>
            networks.join(", ") +
            " - each one a different battlefield with its own tactical challenges.",
        conclusion:
            "Rule number one: Never invest more than you can afford to lose. That's not financial advice, that's survival advice.",
    },
};

// Function to generate tool descriptions for a specific personality
export function generateToolDescription(personalityId: string): string {
    const template =
        TOOL_TEMPLATES[personalityId] || TOOL_TEMPLATES.professional;

    let description = template.intro + "\n";

    // Add core tools
    if (template.toolPrefix) {
        description += template.toolPrefix + "\n";
    }
    description +=
        CORE_TOOLS.map((tool) => template.toolFormat(tool)).join("\n") + "\n\n";

    // Add Nodit tools
    description += template.noditPrefix + "\n";
    description +=
        NODIT_TOOLS.map((tool) => template.noditFormat(tool)).join("\n") +
        "\n\n";

    // Add network information
    description += template.networksPrefix + "\n";
    description += template.networksFormat(SUPPORTED_NETWORKS) + "\n\n";

    // Add conclusion
    description += template.conclusion;

    return description;
}
