import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ExportData {
    type:
        | "token-balances"
        | "token-transfers"
        | "transactions"
        | "portfolio-summary";
    data: any[];
    metadata: {
        accountAddress: string;
        network: string;
        chainType: string;
        exportDate: string;
        totalRecords: number;
    };
}

export interface ExportOptions {
    format: "csv" | "json" | "pdf" | "xlsx";
    filename?: string;
    includeMetadata?: boolean;
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[], headers?: string[]): string {
    if (!data || data.length === 0) {
        return "";
    }

    // Auto-generate headers if not provided
    const csvHeaders = headers || Object.keys(data[0]);

    // Create CSV header row
    const headerRow = csvHeaders.join(",");

    // Create CSV data rows
    const dataRows = data.map((row) => {
        return csvHeaders
            .map((header) => {
                const value = row[header];
                // Handle values that need quotes (contain commas, quotes, or newlines)
                if (
                    typeof value === "string" &&
                    (value.includes(",") ||
                        value.includes('"') ||
                        value.includes("\n"))
                ) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value || "";
            })
            .join(",");
    });

    return [headerRow, ...dataRows].join("\n");
}

/**
 * Convert data to JSON format
 */
export function convertToJSON(data: any[], metadata?: any): string {
    const exportData = {
        metadata,
        data,
        exportInfo: {
            timestamp: new Date().toISOString(),
            totalRecords: data.length,
            format: "json",
        },
    };

    return JSON.stringify(exportData, null, 2);
}

/**
 * Generate filename based on data type and date
 */
export function generateFilename(
    dataType: string,
    network: string,
    format: string
): string {
    const date = new Date().toISOString().split("T")[0];
    const time = new Date()
        .toISOString()
        .split("T")[1]
        .split(".")[0]
        .replace(/:/g, "-");
    return `${dataType}_${network}_${date}_${time}.${format}`;
}

/**
 * Export data as CSV file
 */
export function exportAsCSV(
    data: any[],
    options: ExportOptions & { dataType: string; network: string }
): void {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const filename =
        options.filename ||
        generateFilename(options.dataType, options.network, "csv");
    saveAs(blob, filename);
}

/**
 * Export data as JSON file
 */
export function exportAsJSON(
    data: any[],
    metadata: any,
    options: ExportOptions & { dataType: string; network: string }
): void {
    const json = convertToJSON(data, metadata);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const filename =
        options.filename ||
        generateFilename(options.dataType, options.network, "json");
    saveAs(blob, filename);
}

/**
 * Export data as PDF file
 */
export function exportAsPDF(data: any[], metadata: any, options: ExportOptions & { dataType: string; network: string }): void {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`${metadata.type} Report`, 14, 22);
    
    // Add metadata
    doc.setFontSize(12);
    doc.text(`Network: ${metadata.network}`, 14, 35);
    doc.text(`Total Records: ${metadata.totalRecords}`, 14, 42);
    doc.text(`Export Date: ${new Date(metadata.exportDate).toLocaleDateString()}`, 14, 49);
    
    if (data.length > 0) {
        // Convert data to table format
        const headers = Object.keys(data[0]);
        const tableData = data.map(row => headers.map(header => row[header]));
        
        // Add table
        autoTable(doc, {
            head: [headers],
            body: tableData,
            startY: 60,
            styles: {
                fontSize: 8,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [66, 139, 202],
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
        });
    }
    
    const filename = options.filename || generateFilename(options.dataType, options.network, 'pdf');
    doc.save(filename);
}

/**
 * Export data as Excel file
 */
export function exportAsExcel(data: any[], metadata: any, options: ExportOptions & { dataType: string; network: string }): void {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add metadata as a separate sheet
    const metadataSheet = XLSX.utils.json_to_sheet([metadata]);
    
    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');
    
    // Generate filename
    const filename = options.filename || generateFilename(options.dataType, options.network, 'xlsx');
    
    // Write to file
    XLSX.writeFile(workbook, filename);
}

/**
 * Format token balance data for export
 */
export function formatTokenBalancesForExport(balances: any[]): any[] {
    return balances.map((balance) => ({
        TokenAddress: balance.tokenAddress || balance.contractAddress || "",
        TokenName: balance.name || balance.tokenName || "",
        TokenSymbol: balance.symbol || balance.tokenSymbol || "",
        Balance: balance.balance || balance.amount || "0",
        Decimals: balance.decimals || "18",
        USDValue: balance.usdValue || balance.value || "0",
        Network: balance.network || "",
        LastUpdated: balance.lastUpdated || new Date().toISOString(),
    }));
}

/**
 * Format token transfer data for export
 */
export function formatTokenTransfersForExport(transfers: any[]): any[] {
    return transfers.map((transfer) => ({
        TransactionHash: transfer.transactionHash || transfer.hash || "",
        From: transfer.from || transfer.fromAddress || "",
        To: transfer.to || transfer.toAddress || "",
        TokenAddress: transfer.tokenAddress || transfer.contractAddress || "",
        TokenName: transfer.tokenName || transfer.name || "",
        TokenSymbol: transfer.tokenSymbol || transfer.symbol || "",
        Amount: transfer.amount || transfer.value || "0",
        USDValue: transfer.usdValue || transfer.valueUSD || "0",
        BlockNumber: transfer.blockNumber || transfer.block || "",
        Timestamp: transfer.timestamp || transfer.blockTimestamp || "",
        Network: transfer.network || "",
        GasUsed: transfer.gasUsed || "",
        GasPrice: transfer.gasPrice || "",
    }));
}

/**
 * Format transaction data for export
 */
export function formatTransactionsForExport(transactions: any[]): any[] {
    return transactions.map((tx) => ({
        TransactionHash: tx.transactionHash || tx.hash || "",
        From: tx.from || tx.fromAddress || "",
        To: tx.to || tx.toAddress || "",
        Value: tx.value || "0",
        USDValue: tx.usdValue || "0",
        BlockNumber: tx.blockNumber || tx.block || "",
        Timestamp: tx.timestamp || tx.blockTimestamp || "",
        Network: tx.network || "",
        GasUsed: tx.gasUsed || "",
        GasPrice: tx.gasPrice || "",
        Status: tx.status || tx.isSuccessful ? "Success" : "Failed",
        Method: tx.method || tx.functionName || "",
    }));
}

/**
 * Create portfolio summary data
 */
export function createPortfolioSummary(
    balances: any[],
    transfers: any[],
    transactions: any[]
): any[] {
    const summary = {
        TotalTokens: balances.length,
        TotalTransfers: transfers.length,
        TotalTransactions: transactions.length,
        TotalUSDValue: balances.reduce(
            (sum, balance) => sum + (parseFloat(balance.usdValue || "0") || 0),
            0
        ),
        ExportDate: new Date().toISOString(),
        TopTokens: balances
            .sort(
                (a, b) =>
                    (parseFloat(b.usdValue || "0") || 0) -
                    (parseFloat(a.usdValue || "0") || 0)
            )
            .slice(0, 10)
            .map((balance) => ({
                Token: balance.name || balance.tokenName || "Unknown",
                Symbol: balance.symbol || balance.tokenSymbol || "",
                USDValue: balance.usdValue || "0",
            })),
    };

    return [summary];
}

/**
 * Main export function
 */
export async function exportData(
    data: any[],
    dataType: string,
    network: string,
    options: ExportOptions
): Promise<void> {
    try {
        let formattedData: any[];
        let metadata: any;

        // Format data based on type
        switch (dataType) {
            case "token-balances":
                formattedData = formatTokenBalancesForExport(data);
                metadata = {
                    type: "Token Balances",
                    network,
                    totalRecords: data.length,
                    exportDate: new Date().toISOString(),
                };
                break;
            case "token-transfers":
                formattedData = formatTokenTransfersForExport(data);
                metadata = {
                    type: "Token Transfers",
                    network,
                    totalRecords: data.length,
                    exportDate: new Date().toISOString(),
                };
                break;
            case "transactions":
                formattedData = formatTransactionsForExport(data);
                metadata = {
                    type: "Transactions",
                    network,
                    totalRecords: data.length,
                    exportDate: new Date().toISOString(),
                };
                break;
            default:
                formattedData = data;
                metadata = {
                    type: dataType,
                    network,
                    totalRecords: data.length,
                    exportDate: new Date().toISOString(),
                };
        }

        // Export based on format
        switch (options.format) {
            case "csv":
                exportAsCSV(formattedData, { ...options, dataType, network });
                break;
            case "json":
                exportAsJSON(formattedData, metadata, {
                    ...options,
                    dataType,
                    network,
                });
                break;
            case "pdf":
                exportAsPDF(formattedData, metadata, { ...options, dataType, network });
                break;
            case "xlsx":
                exportAsExcel(formattedData, metadata, { ...options, dataType, network });
                break;
            default:
                throw new Error(`Unsupported export format: ${options.format}`);
        }
    } catch (error) {
        console.error("Export failed:", error);
        throw error;
    }
}
