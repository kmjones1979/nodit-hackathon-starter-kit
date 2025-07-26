"use client";

import React from "react";
import { ExportIntegration } from "./ExportIntegration";

// Example usage in a chat component
export function ExportExample() {
    // This would typically come from your chat state or tool results
    const exampleToolResults = [
        {
            success: true,
            toolName: "getTokenBalancesByAccount",
            data: {
                items: [
                    {
                        ownerAddress:
                            "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
                        tokenAddress:
                            "0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c8",
                        tokenName: "USDC",
                        tokenSymbol: "USDC",
                        balance: "1000000000",
                        decimals: "6",
                        usdValue: "1000.00",
                    },
                    {
                        ownerAddress:
                            "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
                        tokenAddress:
                            "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
                        tokenName: "Uniswap",
                        tokenSymbol: "UNI",
                        balance: "500000000000000000000",
                        decimals: "18",
                        usdValue: "2500.00",
                    },
                ],
            },
            message: "Retrieved token balances successfully",
        },
        {
            success: true,
            toolName: "getTokenTransfersByAccount",
            data: {
                items: [
                    {
                        transactionHash:
                            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                        from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
                        to: "0x742d35cc6634c0532925a3b8d4c9db96c4b4d8b6",
                        tokenAddress:
                            "0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c8",
                        tokenName: "USDC",
                        tokenSymbol: "USDC",
                        amount: "100000000",
                        usdValue: "100.00",
                        blockNumber: "12345678",
                        timestamp: "2024-01-15T10:30:00Z",
                    },
                ],
            },
            message: "Retrieved token transfers successfully",
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">
                Export Functionality Example
            </h2>

            {/* This would appear after tool calls in your chat interface */}
            <ExportIntegration
                toolResults={exampleToolResults}
                network="ethereum"
                accountAddress="0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
            />

            <div className="text-sm text-muted-foreground">
                <p>
                    This component demonstrates how the export functionality
                    integrates with your chat interface.
                </p>
                <p>
                    When users query blockchain data, they can easily export the
                    results in various formats.
                </p>
            </div>
        </div>
    );
}
