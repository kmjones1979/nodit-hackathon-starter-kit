"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    Download,
    FileText,
    FileJson,
    FileSpreadsheet,
} from "lucide-react";
import { exportData, ExportOptions } from "../utils/export/exportUtils";

interface ExportButtonProps {
    data: any[];
    dataType:
        | "token-balances"
        | "token-transfers"
        | "transactions"
        | "portfolio-summary";
    network: string;
    disabled?: boolean;
    className?: string;
}

const exportFormats = [
    {
        format: "csv",
        label: "CSV",
        icon: FileText,
        description: "Spreadsheet format",
    },
    {
        format: "json",
        label: "JSON",
        icon: FileJson,
        description: "Developer format",
    },
    {
        format: "xlsx",
        label: "Excel",
        icon: FileSpreadsheet,
        description: "Advanced analysis",
    },
    {
        format: "pdf",
        label: "PDF",
        icon: FileText,
        description: "Formal report",
    },
] as const;

export function ExportButton({
    data,
    dataType,
    network,
    disabled = false,
    className,
}: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (format: ExportOptions["format"]) => {
        if (!data || data.length === 0) {
            alert("No data available to export");
            return;
        }

        setIsExporting(true);
        try {
            await exportData(data, dataType, network, { format });
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const getDataTypeLabel = (type: string) => {
        switch (type) {
            case "token-balances":
                return "Token Balances";
            case "token-transfers":
                return "Token Transfers";
            case "transactions":
                return "Transactions";
            case "portfolio-summary":
                return "Portfolio Summary";
            default:
                return type;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={
                        disabled || isExporting || !data || data.length === 0
                    }
                    className={className}
                >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting
                        ? "Exporting..."
                        : `Export ${getDataTypeLabel(dataType)}`}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    Export Format
                </div>
                {exportFormats.map(
                    ({ format, label, icon: Icon, description }) => (
                        <DropdownMenuItem
                            key={format}
                            onClick={() => handleExport(format)}
                            className="cursor-pointer"
                        >
                            <Icon className="h-4 w-4 mr-2" />
                            <div className="flex flex-col">
                                <span className="font-medium">{label}</span>
                                <span className="text-xs text-muted-foreground">
                                    {description}
                                </span>
                            </div>
                        </DropdownMenuItem>
                    )
                )}
                <div className="px-2 py-1.5 text-xs text-muted-foreground border-t mt-1 pt-1">
                    {data?.length || 0} records available
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
