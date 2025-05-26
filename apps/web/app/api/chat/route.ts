import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { baseSepolia, foundry, type Chain } from "viem/chains";
import { getTools, createAgentKit } from "../../utils/chat/tools";
import { siweAuthOptions } from "../../utils/scaffold-eth/auth";
import { CHAINS } from "../../config/chains";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const session = (await getServerSession(
        siweAuthOptions({ chain: baseSepolia })
    )) as any;
    const userAddress = session?.user?.address;

    if (!userAddress) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages, chainId } = await req.json();

    // Use the provided chainId or fallback to baseSepolia
    const selectedChainId = chainId || baseSepolia.id;
    const selectedChain = CHAINS[selectedChainId as keyof typeof CHAINS];

    if (!selectedChain) {
        return new Response(`Unsupported chain ID: ${selectedChainId}`, {
            status: 400,
        });
    }

    const { agentKit } = await createAgentKit(selectedChainId);

    const prompt = `
  You are a helpful Web3 assistant operating on EVM-compatible blockchains.
  You can interact with smart contracts and access comprehensive Web3 data through Nodit.
  
  Your available tools include:

  - 'getTokenDetails': To fetch the name, symbol, and total supply for a given ERC20-like token contract address on a specified chain.
  - 'read-contract': To call read-only functions on smart contracts. (Note: Full contract interaction setup might be pending, if so, inform the user if a specific contract isn't found/configured).
  - 'write-contract': To send transactions to smart contracts for write operations. (Note: Full contract interaction setup might be pending).

  - Tools provided by 'tokenApiProvider' (you can infer its capabilities if a user asks for token-related data beyond basic details, like market prices or balances if supported).
  - Standard wallet actions like checking balance or signing messages via 'walletActionProvider'.
  
  **Nodit Web3 Data API Tools:**
  - 'getTokenTransfersByAccount': Get comprehensive token transfer history for any account across supported networks
  - 'getTokenBalancesByAccount': Get current token balances for any account
  - 'getBlockByNumber': Get detailed block information including transactions
  - 'getTransactionByHash': Get complete transaction details and status
  
  For Nodit tools, you can query data from multiple networks including:
  - Ethereum (mainnet, testnet)
  - Polygon (mainnet, testnet)
  - Arbitrum (mainnet, testnet)
  - Avalanche (mainnet, testnet)
  - Optimism (mainnet, testnet)
  - Base (mainnet, testnet)
  - And other supported EVM networks
  
  When using Nodit tools, specify the network (e.g., 'ethereum') and chainType (e.g., 'mainnet' or 'testnet').

  When creating coins or sending transactions, clearly state the action to be taken and ask for confirmation if appropriate or if parameters are ambiguous.
  If the user asks about contract interactions and a specific contract is not found/configured (due to the placeholder setup for 'deployedContracts'), politely inform them that the full contract details are not yet available for that specific contract/chain in your current setup but you can attempt standard ERC20 calls if they provide an address and ABI details, or use other tools.
  You are currently configured to work with ${selectedChain.name} (chainId: ${selectedChainId}). Tools like 'getTokenDetails' will operate on this chain unless otherwise specified by the user.
  The current user's address is ${userAddress}.
  `;

    try {
        console.log(
            `[api/chat] Calling streamText with AI SDK for chain ${selectedChain.name} (${selectedChainId})...`
        );
        const result = await streamText({
            model: openai("gpt-4-turbo-preview"),
            system: prompt,
            messages,
            tools: getTools(agentKit),
        });
        console.log("[api/chat] streamText initial call completed.");

        // --- DEBUG: Log stream parts using async iterator ---
        let loggedToolCalls = 0;
        let loggedText = "";
        console.log("[api/chat] Reading stream parts...");
        for await (const part of result.fullStream) {
            // Use fullStream or potentially another iterator if available
            switch (part.type) {
                case "text-delta":
                    // console.log("[api/chat] Stream part: text-delta:", part.textDelta);
                    loggedText += part.textDelta;
                    break;
                case "tool-call":
                    console.log(
                        "[api/chat] Stream part: tool-call: ID:",
                        part.toolCallId,
                        "Name:",
                        part.toolName,
                        "Args:",
                        JSON.stringify(part.args)
                    );
                    loggedToolCalls++;
                    break;
                case "tool-result":
                    console.log(
                        "[api/chat] Stream part: tool-result:",
                        JSON.stringify(part.result)
                    );
                    break;
                case "error":
                    console.error("[api/chat] Stream part: error:", part.error);
                    break;
                // Handle other part types if necessary (e.g., 'finish')
                case "finish":
                    console.log(
                        "[api/chat] Stream part: finish. Reason:",
                        part.finishReason,
                        "Usage:",
                        part.usage
                    );
                    break;
                default:
                    // console.log("[api/chat] Stream part: other type:", part.type);
                    break;
            }
        }
        console.log(
            `[api/chat] Finished reading stream. Logged ${loggedToolCalls} tool calls. Logged text length: ${loggedText.length}`
        );
        // --- END DEBUG ---

        // Re-execute to get a fresh stream for the actual response
        console.log("[api/chat] Re-executing streamText to return response...");
        const finalResult = await streamText({
            model: openai("gpt-4-turbo-preview"),
            system: prompt,
            messages,
            tools: getTools(agentKit),
        });

        // Use toDataStreamResponse as indicated by the linter error
        return finalResult.toDataStreamResponse();
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.error(
            `[api/chat] Error in POST handler: ${errorMessage}`,
            error
        ); // Log 8: Catching errors
        return new Response(`Error processing request: ${errorMessage}`, {
            status: 500,
        });
    }
}
