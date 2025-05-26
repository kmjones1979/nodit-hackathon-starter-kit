import { http, createConfig } from "wagmi";
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
import { CHAINS } from "./chains";

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
        [baseSepolia.id]: http(CHAINS[baseSepolia.id].rpc),
        [base.id]: http(CHAINS[base.id].rpc),
        [optimism.id]: http(CHAINS[optimism.id].rpc),
        [arbitrum.id]: http(CHAINS[arbitrum.id].rpc),
        [polygon.id]: http(CHAINS[polygon.id].rpc),
        [avalanche.id]: http(CHAINS[avalanche.id].rpc),
        [blast.id]: http(CHAINS[blast.id].rpc),
    },
});
