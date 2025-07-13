"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { ChatInput } from "../components/chat/ChatInput";
import { MessageToolCalls } from "../components/chat/MessageToolCalls";
import { StatusIndicator } from "../components/chat/StatusIndicator";
import { Header } from "../components/Header";
import { useAccount, useChainId } from "wagmi";
import { useSession } from "next-auth/react";
import { CHAINS } from "../config/chains";
import { usePersonality } from "../contexts/PersonalityContext";

export default function Chat() {
    const { address, isConnected } = useAccount();
    const { data: session, status: sessionStatus } = useSession();
    const chainId = useChainId();
    const currentChain = CHAINS[chainId as keyof typeof CHAINS];
    const { personalityId, personality } = usePersonality();

    // Debug logging
    console.log(`[chat/page] Current personality ID: ${personalityId}`);
    console.log(`[chat/page] Current personality name: ${personality.name}`);

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit: originalHandleSubmit,
        status,
        stop,
    } = useChat({
        maxSteps: 10,
        body: {
            chainId,
            personalityId,
        },
        // Force re-initialization when personality changes
        id: `chat-${personalityId}`,
    });
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const lastMessageCount = useRef(messages.length);

    type OriginalHandleSubmitType = typeof originalHandleSubmit;

    const handleSubmit: OriginalHandleSubmitType = (e, options) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (!session) {
            alert("Please connect your wallet and sign in to use the chat.");
            return;
        }
        if (!currentChain) {
            alert("Please switch to a supported chain before using the chat.");
            return;
        }
        (originalHandleSubmit as any)(e, options);
    };

    useEffect(() => {
        if (
            messages.length > lastMessageCount.current &&
            messagesContainerRef.current
        ) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
            lastMessageCount.current = messages.length;
        }
    }, [messages]);

    // Show authentication status
    const renderAuthStatus = () => {
        if (!isConnected) {
            return (
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200">
                        Please connect your wallet to use the chat.
                    </p>
                </div>
            );
        }

        if (sessionStatus === "loading") {
            return (
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200">
                        Checking authentication status...
                    </p>
                </div>
            );
        }

        if (!session) {
            return (
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <p className="text-orange-800 dark:text-orange-200">
                        Wallet connected! Please click "Sign In" in the header
                        to authenticate and use the chat.
                    </p>
                </div>
            );
        }

        // Check if current chain is supported
        if (!currentChain) {
            const supportedChains = Object.values(CHAINS)
                .map((chain) => chain.name)
                .join(", ");
            return (
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200">
                        Unsupported chain (ID: {chainId}). Please switch to a
                        supported chain: {supportedChains}
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="h-screen bg-background flex flex-col m-0 p-0">
            <Header />
            <div className="flex-1 bg-background flex justify-center py-2 sm:py-4 lg:py-6">
                <div className="w-[90vw] max-w-[1000px] min-w-[320px] h-full mx-4 sm:mx-8 lg:mx-16 xl:mx-24">
                    <div className="bg-card border rounded-lg shadow-sm h-full flex flex-col">
                        <div className="border-b p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-semibold">
                                        Nodit AI Agent
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Ask questions about Web3, query
                                        blockchain data with Nodit, or interact
                                        with smart contracts across multiple
                                        networks.
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs text-muted-foreground">
                                            Personality:
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                                                style={{
                                                    backgroundColor:
                                                        personality.color,
                                                }}
                                            >
                                                {personality.emoji}
                                            </div>
                                            <span className="text-xs font-medium">
                                                {personality.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {currentChain && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                                        <span className="text-lg">
                                            {currentChain.icon}
                                        </span>
                                        <div className="text-sm">
                                            <div className="font-medium">
                                                {currentChain.name}
                                            </div>
                                            <div className="text-muted-foreground">
                                                Chain {chainId}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {renderAuthStatus()}

                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                        >
                            {messages.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8 space-y-4">
                                    <p>
                                        Welcome to Nodit AI Agent! Start a
                                        conversation to get help with Web3
                                        tasks.
                                    </p>
                                    <div className="text-left max-w-2xl mx-auto space-y-2">
                                        <p className="font-medium text-foreground">
                                            Try asking:
                                        </p>
                                        <ul className="text-sm space-y-1">
                                            <li>
                                                • "Show me token transfers for
                                                [address] on Ethereum mainnet"
                                            </li>
                                            <li>
                                                • "What are the token balances
                                                for [address] on Polygon?"
                                            </li>
                                            <li>
                                                • "Get details for block
                                                [number] on Arbitrum"
                                            </li>
                                            <li>
                                                • "Query Avalanche transaction
                                                data"
                                            </li>
                                            <li>
                                                • "Interact with smart
                                                contracts"
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.role === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                                message.role === "user"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            }`}
                                        >
                                            {message.role === "assistant" &&
                                                message.toolInvocations && (
                                                    <MessageToolCalls
                                                        toolParts={message.toolInvocations.map(
                                                            (ti) => ({
                                                                toolInvocation:
                                                                    ti,
                                                            })
                                                        )}
                                                        messageId={message.id}
                                                    />
                                                )}
                                            <ReactMarkdown>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <StatusIndicator
                                    status={status}
                                    onStop={stop}
                                />
                            </div>
                            <ChatInput
                                input={input}
                                status={status}
                                onSubmit={handleSubmit}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
