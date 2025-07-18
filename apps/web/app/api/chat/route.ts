import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { baseSepolia, foundry, type Chain } from "viem/chains";
import { getTools, createAgentKit } from "../../utils/chat/tools";
import { siweAuthOptions } from "../../utils/scaffold-eth/auth";
import { CHAINS } from "../../config/chains";
import {
    getPersonality,
    DEFAULT_PERSONALITY_ID,
} from "../../config/personalities";

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

    const { messages, chainId, personalityId } = await req.json();

    // Use the provided chainId or fallback to baseSepolia
    const selectedChainId = chainId || baseSepolia.id;
    const selectedChain = CHAINS[selectedChainId as keyof typeof CHAINS];

    if (!selectedChain) {
        return new Response(`Unsupported chain ID: ${selectedChainId}`, {
            status: 400,
        });
    }

    const { agentKit } = await createAgentKit(selectedChainId);

    // Get the personality and use its system prompt
    const selectedPersonalityId = personalityId || DEFAULT_PERSONALITY_ID;
    const selectedPersonality = getPersonality(selectedPersonalityId);

    // Debug logging
    console.log(`[api/chat] Selected personality ID: ${selectedPersonalityId}`);
    console.log(
        `[api/chat] Selected personality name: ${selectedPersonality.name}`
    );

    // Log the complete system prompt to debug
    console.log(
        `[api/chat] System prompt preview (first 500 chars): ${selectedPersonality.systemPrompt.substring(0, 500)}...`
    );

    const prompt = `${selectedPersonality.systemPrompt}
  
  You are currently configured to work with ${selectedChain.name} (chainId: ${selectedChainId}). Tools like 'getTokenDetails' will operate on this chain unless otherwise specified by the user.
  The current user's address is ${userAddress}.
  
  IMPORTANT: You must ALWAYS respond in character as ${selectedPersonality.name}. Do not break character or give generic responses. Every word must reflect this personality.
  `;

    try {
        console.log(
            `[api/chat] Calling streamText with AI SDK for chain ${selectedChain.name} (${selectedChainId})...`
        );
        const result = await streamText({
            model: openai("gpt-4-turbo"),
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
            model: openai("gpt-4-turbo"),
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
