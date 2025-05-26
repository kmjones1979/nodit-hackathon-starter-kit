import { contractInteractor } from "./agentkit/action-providers/contract-interactor";
import { tokenDetailsProvider } from "./agentkit/action-providers/TokenDetailsProvider";
import { noditProvider } from "./agentkit/action-providers/NoditProvider";
import { agentKitToTools } from "./agentkit/framework-extensions/ai-sdk";
import {
    AgentKit,
    ViemWalletProvider,
    walletActionProvider,
} from "@coinbase/agentkit";
import { tool } from "ai";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry, baseSepolia } from "viem/chains";
import { z } from "zod";
import { CHAINS } from "../../config/chains";

export async function createAgentKit(chainId?: number) {
    // Use provided chainId or fallback to baseSepolia
    const selectedChainId = chainId || baseSepolia.id;
    const selectedChain = CHAINS[selectedChainId as keyof typeof CHAINS];

    if (!selectedChain) {
        throw new Error(`Unsupported chain ID: ${selectedChainId}`);
    }

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
        chainName: selectedChain.name,
    };
}

export function getTools(agentKit: AgentKit) {
    const tools = agentKitToTools(agentKit);

    return {
        ...tools,
        showTransaction: tool({
            description: "Show the transaction hash",
            parameters: z.object({
                transactionHash: z
                    .string()
                    .describe("The transaction hash to show"),
            }),
            execute: async ({ transactionHash }) => {
                return {
                    transactionHash,
                };
            },
        }),
    };
}
