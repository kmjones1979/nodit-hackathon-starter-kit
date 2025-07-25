export const noditConfig = {
    apiKey: process.env.NODIT_API_KEY,
    baseUrl: "https://web3.nodit.io/v1",
    isConfigured: !!process.env.NODIT_API_KEY,
};

export function validateNoditConfig() {
    if (!noditConfig.apiKey) {
        console.warn(
            "NODIT_API_KEY environment variable is not set. Nodit features will be unavailable."
        );
        return false;
    }
    return true;
}

export const supportedNetworks = [
    "ethereum",
    "polygon", 
    "base",
    "arbitrum",
    "avalanche",
    "optimism",
    "bsc",
    "aptos", // Based on documentation
] as const;

export const supportedChainTypes = ["mainnet", "testnet"] as const;

export type NoditNetwork = (typeof supportedNetworks)[number];
export type NoditChainType = (typeof supportedChainTypes)[number];
