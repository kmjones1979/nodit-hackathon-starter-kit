"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Download,
    FileText,
    FileJson,
    FileSpreadsheet,
    Settings,
    BarChart3,
} from "lucide-react";
import {
    exportData,
    createPortfolioSummary,
    ExportOptions,
} from "../utils/export/exportUtils";

interface ExportPanelProps {
    tokenBalances?: any[];
    tokenTransfers?: any[];
    transactions?: any[];
    network: string;
    accountAddress?: string;
    className?: string;
}

interface ExportSelection {
    tokenBalances: boolean;
    tokenTransfers: boolean;
    transactions: boolean;
    portfolioSummary: boolean;
}

export function ExportPanel({
    tokenBalances = [],
    tokenTransfers = [],
    transactions = [],
    network,
    accountAddress,
    className,
}: ExportPanelProps) {
    const [selectedData, setSelectedData] = useState<ExportSelection>({
        tokenBalances: true,
        tokenTransfers: false,
        transactions: false,
        portfolioSummary: true,
    });
    const [exportFormat, setExportFormat] =
        useState<ExportOptions["format"]>("csv");
    const [isExporting, setIsExporting] = useState(false);
    const [includeMetadata, setIncludeMetadata] = useState(true);

    const handleSelectionChange = (
        key: keyof ExportSelection,
        value: boolean
    ) => {
        setSelectedData((prev) => ({ ...prev, [key]: value }));
    };

    const getSelectedDataCount = () => {
        let count = 0;
        if (selectedData.tokenBalances) count += tokenBalances.length;
        if (selectedData.tokenTransfers) count += tokenTransfers.length;
        if (selectedData.transactions) count += transactions.length;
        if (selectedData.portfolioSummary) count += 1;
        return count;
    };

    const handleExport = async () => {
        const selectedCount = getSelectedDataCount();
        if (selectedCount === 0) {
            alert("Please select at least one data type to export");
            return;
        }

        setIsExporting(true);
        try {
            // Export each selected data type
            const exportPromises: Promise<void>[] = [];

            if (selectedData.tokenBalances && tokenBalances.length > 0) {
                exportPromises.push(
                    exportData(tokenBalances, "token-balances", network, {
                        format: exportFormat,
                        includeMetadata,
                    })
                );
            }

            if (selectedData.tokenTransfers && tokenTransfers.length > 0) {
                exportPromises.push(
                    exportData(tokenTransfers, "token-transfers", network, {
                        format: exportFormat,
                        includeMetadata,
                    })
                );
            }

            if (selectedData.transactions && transactions.length > 0) {
                exportPromises.push(
                    exportData(transactions, "transactions", network, {
                        format: exportFormat,
                        includeMetadata,
                    })
                );
            }

            if (selectedData.portfolioSummary) {
                const summary = createPortfolioSummary(
                    tokenBalances,
                    tokenTransfers,
                    transactions
                );
                exportPromises.push(
                    exportData(summary, "portfolio-summary", network, {
                        format: exportFormat,
                        includeMetadata,
                    })
                );
            }

            await Promise.all(exportPromises);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const formatOptions = [
        {
            value: "csv",
            label: "CSV",
            icon: FileText,
            description: "Spreadsheet format",
        },
        {
            value: "json",
            label: "JSON",
            icon: FileJson,
            description: "Developer format",
        },
        {
            value: "xlsx",
            label: "Excel",
            icon: FileSpreadsheet,
            description: "Advanced analysis",
        },
        {
            value: "pdf",
            label: "PDF",
            icon: FileText,
            description: "Formal report",
        },
    ];

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Data
                </CardTitle>
                <CardDescription>
                    Export your blockchain data in various formats for analysis
                    and reporting
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Data Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">
                        Select Data to Export
                    </Label>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="tokenBalances"
                                checked={selectedData.tokenBalances}
                                onCheckedChange={(checked) =>
                                    handleSelectionChange(
                                        "tokenBalances",
                                        checked as boolean
                                    )
                                }
                            />
                            <Label htmlFor="tokenBalances" className="flex-1">
                                Token Balances ({tokenBalances.length} records)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="tokenTransfers"
                                checked={selectedData.tokenTransfers}
                                onCheckedChange={(checked) =>
                                    handleSelectionChange(
                                        "tokenTransfers",
                                        checked as boolean
                                    )
                                }
                            />
                            <Label htmlFor="tokenTransfers" className="flex-1">
                                Token Transfers ({tokenTransfers.length}{" "}
                                records)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="transactions"
                                checked={selectedData.transactions}
                                onCheckedChange={(checked) =>
                                    handleSelectionChange(
                                        "transactions",
                                        checked as boolean
                                    )
                                }
                            />
                            <Label htmlFor="transactions" className="flex-1">
                                Transactions ({transactions.length} records)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="portfolioSummary"
                                checked={selectedData.portfolioSummary}
                                onCheckedChange={(checked) =>
                                    handleSelectionChange(
                                        "portfolioSummary",
                                        checked as boolean
                                    )
                                }
                            />
                            <Label
                                htmlFor="portfolioSummary"
                                className="flex-1"
                            >
                                Portfolio Summary (1 record)
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Export Format */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Export Format</Label>
                    <Select
                        value={exportFormat}
                        onValueChange={(value: ExportOptions["format"]) =>
                            setExportFormat(value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {formatOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    <div className="flex items-center gap-2">
                                        <option.icon className="h-4 w-4" />
                                        <div>
                                            <div className="font-medium">
                                                {option.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {option.description}
                                            </div>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Options */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Export Options
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="includeMetadata"
                            checked={includeMetadata}
                            onCheckedChange={(checked) =>
                                setIncludeMetadata(checked as boolean)
                            }
                        />
                        <Label htmlFor="includeMetadata">
                            Include metadata and export information
                        </Label>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">
                        Export Summary
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                        <div>Network: {network}</div>
                        {accountAddress && (
                            <div>
                                Account: {accountAddress.slice(0, 6)}...
                                {accountAddress.slice(-4)}
                            </div>
                        )}
                        <div>Selected records: {getSelectedDataCount()}</div>
                        <div>
                            Format:{" "}
                            {
                                formatOptions.find(
                                    (opt) => opt.value === exportFormat
                                )?.label
                            }
                        </div>
                    </div>
                </div>

                {/* Export Button */}
                <Button
                    onClick={handleExport}
                    disabled={isExporting || getSelectedDataCount() === 0}
                    className="w-full"
                >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting
                        ? "Exporting..."
                        : `Export ${getSelectedDataCount()} Records`}
                </Button>
            </CardContent>
        </Card>
    );
}
