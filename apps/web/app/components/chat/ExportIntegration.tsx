"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Download, Eye, EyeOff } from "lucide-react";
import { ExportButton } from "../ExportButton";
import { ExportPanel } from "../ExportPanel";

interface ToolResult {
    success: boolean;
    data?: any;
    message?: string;
    toolName?: string;
}

interface ExportIntegrationProps {
    toolResults: ToolResult[];
    network: string;
    accountAddress?: string;
    className?: string;
}

export function ExportIntegration({
    toolResults,
    network,
    accountAddress,
    className,
}: ExportIntegrationProps) {
    const [showExportPanel, setShowExportPanel] = useState(false);
    const [showData, setShowData] = useState(false);

    // Extract data from tool results
    const data = {
        tokenBalances: [] as any[],
        tokenTransfers: [] as any[],
        transactions: [] as any[],
    };

    toolResults.forEach((result) => {
        if (result.success && result.data) {
            // Simple debug log to see the data structure
            console.log(
                "ExportIntegration - Tool:",
                result.toolName,
                "Data keys:",
                Object.keys(result.data)
            );

            switch (result.toolName) {
                case "getTokenBalancesByAccount":
                    if (result.data.items) {
                        data.tokenBalances = result.data.items;
                    } else if (result.data.balances) {
                        data.tokenBalances = result.data.balances;
                    } else if (Array.isArray(result.data)) {
                        data.tokenBalances = result.data;
                    }
                    break;
                case "getTokenTransfersByAccount":
                    if (result.data.items) {
                        data.tokenTransfers = result.data.items;
                    } else if (result.data.transfers) {
                        data.tokenTransfers = result.data.transfers;
                    }
                    break;
                case "getTransactionByHash":
                    if (Array.isArray(result.data)) {
                        data.transactions = result.data;
                    } else {
                        data.transactions = [result.data];
                    }
                    break;
            }
        }
    });

    const totalRecords =
        data.tokenBalances.length +
        data.tokenTransfers.length +
        data.transactions.length;

    if (totalRecords === 0) {
        return null;
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Data Export</span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowData(!showData)}
                        >
                            {showData ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                            {showData ? "Hide" : "Show"} Data
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowExportPanel(!showExportPanel)}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </CardTitle>
                <CardDescription>
                    Export your blockchain data for analysis and reporting
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Data Summary */}
                <div className="flex items-center gap-4">
                    <Badge variant="secondary">
                        {data.tokenBalances.length} Token Balances
                    </Badge>
                    <Badge variant="secondary">
                        {data.tokenTransfers.length} Token Transfers
                    </Badge>
                    <Badge variant="secondary">
                        {data.transactions.length} Transactions
                    </Badge>
                    <Badge variant="outline">
                        {totalRecords} Total Records
                    </Badge>
                </div>

                {/* Quick Export Buttons */}
                <div className="flex items-center gap-2">
                    {data.tokenBalances.length > 0 && (
                        <ExportButton
                            data={data.tokenBalances}
                            dataType="token-balances"
                            network={network}
                            className="flex-1"
                        />
                    )}
                    {data.tokenTransfers.length > 0 && (
                        <ExportButton
                            data={data.tokenTransfers}
                            dataType="token-transfers"
                            network={network}
                            className="flex-1"
                        />
                    )}
                    {data.transactions.length > 0 && (
                        <ExportButton
                            data={data.transactions}
                            dataType="transactions"
                            network={network}
                            className="flex-1"
                        />
                    )}
                </div>

                {/* Data Preview */}
                {showData && (
                    <div className="space-y-4">
                        {data.tokenBalances.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">
                                    Token Balances Preview
                                </h4>
                                <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto">
                                    <pre className="text-xs">
                                        {JSON.stringify(
                                            data.tokenBalances.slice(0, 3),
                                            null,
                                            2
                                        )}
                                        {data.tokenBalances.length > 3 &&
                                            `\n... and ${data.tokenBalances.length - 3} more records`}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {data.tokenTransfers.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">
                                    Token Transfers Preview
                                </h4>
                                <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto">
                                    <pre className="text-xs">
                                        {JSON.stringify(
                                            data.tokenTransfers.slice(0, 3),
                                            null,
                                            2
                                        )}
                                        {data.tokenTransfers.length > 3 &&
                                            `\n... and ${data.tokenTransfers.length - 3} more records`}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {data.transactions.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">
                                    Transactions Preview
                                </h4>
                                <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto">
                                    <pre className="text-xs">
                                        {JSON.stringify(
                                            data.transactions.slice(0, 3),
                                            null,
                                            2
                                        )}
                                        {data.transactions.length > 3 &&
                                            `\n... and ${data.transactions.length - 3} more records`}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Advanced Export Panel */}
                {showExportPanel && (
                    <ExportPanel
                        tokenBalances={data.tokenBalances}
                        tokenTransfers={data.tokenTransfers}
                        transactions={data.transactions}
                        network={network}
                        accountAddress={accountAddress}
                    />
                )}
            </CardContent>
        </Card>
    );
}
