import { useState } from "react";
import { Transaction } from "./Transaction";
import { ExportIntegration } from "./ExportIntegration";
import { foundry } from "viem/chains";

interface ToolCallsProps {
    toolParts: any[];
    messageId: string;
    chainName?: string;
    accountAddress?: string;
}

export function MessageToolCalls({
    toolParts,
    messageId,
    chainName = "ethereum",
    accountAddress,
}: ToolCallsProps) {
    const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>(
        {}
    );

    const toggleToolExpansion = (id: string) => {
        setExpandedTools((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!toolParts.length) return null;

    // Find any transaction hashes to display
    const transactionParts = toolParts.filter(
        (part) =>
            part.toolInvocation.toolName === "showTransaction" &&
            part.toolInvocation.result?.transactionHash
    );

    // Check if we have any data that can be exported
    const hasExportableData = toolParts.some((part) => {
        const toolName = part.toolInvocation.toolName;
        return (
            toolName === "getTokenBalancesByAccount" ||
            toolName === "getTokenTransfersByAccount" ||
            toolName === "getTransactionByHash"
        );
    });

    return (
        <div className="mx-4 mt-2 mb-4">
            {/* Always show transactions */}
            {transactionParts.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                    {transactionParts.map((part, index) => (
                        <Transaction
                            key={index}
                            hash={part.toolInvocation.result.transactionHash}
                            chain={foundry}
                        />
                    ))}
                </div>
            )}

            {/* Export Integration - show when we have exportable data */}
            {hasExportableData && (
                <div className="mb-4">
                    <ExportIntegration
                        toolResults={toolParts.map((part) => ({
                            success: true,
                            data: part.toolInvocation.result,
                            toolName: part.toolInvocation.toolName,
                        }))}
                        network={chainName}
                        accountAddress={accountAddress}
                        className="border border-zinc-200 dark:border-zinc-700"
                    />
                </div>
            )}

            {/* Expandable tool calls section */}
            <button
                onClick={() => toggleToolExpansion(messageId)}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1"
            >
                <svg
                    className={`w-4 h-4 transform transition-transform ${expandedTools[messageId] ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
                Show Tool Calls ({toolParts.length})
            </button>

            {expandedTools[messageId] && (
                <div className="space-y-2">
                    {toolParts.map((part: any, index: number) => (
                        <div
                            key={`tool-${index}`}
                            className="bg-zinc-100 dark:bg-zinc-800/70 p-3 rounded-lg text-sm"
                        >
                            <div className="text-zinc-500">
                                Tool Call: {part.toolInvocation.toolName}
                            </div>
                            {Object.entries(part.toolInvocation.args).map(
                                ([key, value]) => (
                                    <div key={key} className="mt-1">
                                        <span className="font-medium capitalize">
                                            {key}:
                                        </span>{" "}
                                        <pre className="inline font-mono text-xs bg-zinc-200 dark:bg-zinc-700/50 px-1 rounded whitespace-pre-wrap break-all">
                                            {value as string}
                                        </pre>
                                    </div>
                                )
                            )}
                            {part.toolInvocation.result && (
                                <div className="mt-2">
                                    <pre className="font-mono text-xs bg-zinc-200 dark:bg-zinc-700/50 p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
                                        {JSON.stringify(
                                            part.toolInvocation.result,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
