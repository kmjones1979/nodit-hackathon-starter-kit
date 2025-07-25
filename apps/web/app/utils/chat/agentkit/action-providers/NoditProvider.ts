import {
    ActionProvider,
    CreateAction,
    WalletProvider,
    Network,
} from "@coinbase/agentkit";
import { z } from "zod";

const NODIT_BASE_URL = "https://web3.nodit.io/v1";

interface NoditConfig {
    apiKey: string;
}

class NoditProvider extends ActionProvider<WalletProvider> {
    private apiKey: string;

    constructor(config?: NoditConfig) {
        super("nodit", []);
        this.apiKey = config?.apiKey || process.env.NODIT_API_KEY;

        if (!this.apiKey) {
            throw new Error("NODIT_API_KEY is required");
        }

        // Log configuration for debugging (without exposing the full API key)
        console.log(
            `[NoditProvider] Initialized with API key: ${this.apiKey.substring(0, 8)}...`
        );
        console.log(`[NoditProvider] Base URL: ${NODIT_BASE_URL}`);
    }

    supportsNetwork = (network: Network): boolean => {
        return true; // Nodit supports multiple networks
    };

    /**
     * Test the Nodit API connectivity
     */
    async testConnection() {
        try {
            const response = await fetch(`${NODIT_BASE_URL}/health`, {
                method: "GET",
                headers: {
                    "X-API-KEY": this.apiKey,
                    Authorization: `Bearer ${this.apiKey}`,
                    accept: "application/json",
                },
            });

            if (response.ok) {
                return { success: true, message: "Nodit API is accessible" };
            } else {
                return {
                    success: false,
                    error: `Health check failed: ${response.status} ${response.statusText}`,
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    @CreateAction({
        name: "getTokenTransfersByAccount",
        description: "Get token transfer history for a specific account",
        schema: z.object({
            network: z
                .string()
                .describe(
                    "The blockchain network (e.g., 'ethereum', 'polygon')"
                ),
            chainType: z
                .string()
                .describe("The chain type (e.g., 'mainnet', 'testnet')"),
            accountAddress: z.string().describe("The account address to query"),
            fromDate: z
                .string()
                .optional()
                .describe(
                    "Start date in ISO format (e.g., '2025-01-01T00:00:00+00:00')"
                ),
            toDate: z
                .string()
                .optional()
                .describe(
                    "End date in ISO format (e.g., '2025-01-31T00:00:00+00:00')"
                ),
            limit: z
                .number()
                .optional()
                .describe("Maximum number of results to return"),
            offset: z.number().optional().describe("Number of results to skip"),
        }),
    })
    async getTokenTransfersByAccount(
        walletProvider: WalletProvider,
        params: {
            network: string;
            chainType: string;
            accountAddress: string;
            fromDate?: string;
            toDate?: string;
            limit?: number;
            offset?: number;
        }
    ) {
        try {
            // Use the correct endpoint structure confirmed by testing
            const url = `${NODIT_BASE_URL}/${params.network}/${params.chainType}/token/getTokenTransfersByAccount`;

            console.log(`[NoditProvider] Using transfers URL: ${url}`);

            const requestBody: any = {
                accountAddress: params.accountAddress,
            };

            if (params.fromDate) requestBody.fromDate = params.fromDate;
            if (params.toDate) requestBody.toDate = params.toDate;
            if (params.limit) requestBody.limit = params.limit;
            if (params.offset) requestBody.offset = params.offset;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-API-KEY": this.apiKey,
                    Authorization: `Bearer ${this.apiKey}`,
                    accept: "application/json",
                    "content-type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(
                    `[NoditProvider] Success! Retrieved token transfers for ${params.accountAddress}`
                );
                return {
                    success: true,
                    data,
                    message: `Retrieved token transfers for account ${params.accountAddress}`,
                };
            } else {
                const errorText = await response.text();
                throw new Error(
                    `Nodit API error: ${response.status} ${response.statusText} - ${errorText}`
                );
            }

            // If the request failed, provide a fallback response
            console.warn(
                `[NoditProvider] API request failed for ${params.network}/${params.chainType}, providing fallback response`
            );
            return {
                success: true,
                data: {
                    transfers: [],
                    message: `Unable to retrieve token transfers for ${params.network} ${params.chainType}. Using fallback data.`,
                    fallback: true,
                },
                message: `Unable to retrieve token transfers for account ${params.accountAddress} from Nodit API. Please try again later.`,
            };
        } catch (error) {
            console.error("[NoditProvider] Final transfers error:", error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred",
            };
        }
    }

    @CreateAction({
        name: "getTokenBalancesByAccount",
        description: "Get token balances for a specific account",
        schema: z.object({
            network: z
                .string()
                .describe(
                    "The blockchain network (e.g., 'ethereum', 'polygon')"
                ),
            chainType: z
                .string()
                .describe("The chain type (e.g., 'mainnet', 'testnet')"),
            accountAddress: z.string().describe("The account address to query"),
            tokenAddresses: z
                .array(z.string())
                .optional()
                .describe("Specific token contract addresses to query"),
        }),
    })
    async getTokenBalancesByAccount(
        walletProvider: WalletProvider,
        params: {
            network: string;
            chainType: string;
            accountAddress: string;
            tokenAddresses?: string[];
        }
    ) {
        try {
            // Use the correct endpoint structure confirmed by testing
            const url = `${NODIT_BASE_URL}/${params.network}/${params.chainType}/token/getTokensOwnedByAccount`;

            console.log(`[NoditProvider] Using URL: ${url}`);

            const requestBody: any = {
                accountAddress: params.accountAddress,
            };

            if (params.tokenAddresses) {
                requestBody.tokenAddresses = params.tokenAddresses;
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-API-KEY": this.apiKey,
                    Authorization: `Bearer ${this.apiKey}`,
                    accept: "application/json",
                    "content-type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(
                    `[NoditProvider] Success! Retrieved token balances for ${params.accountAddress}`
                );
                return {
                    success: true,
                    data,
                    message: `Retrieved token balances for account ${params.accountAddress}`,
                };
            } else {
                const errorText = await response.text();
                throw new Error(
                    `Nodit API error: ${response.status} ${response.statusText} - ${errorText}`
                );
            }

            // If the request failed, provide a fallback response
            console.warn(
                `[NoditProvider] API request failed for ${params.network}/${params.chainType}, providing fallback response`
            );
            return {
                success: true,
                data: {
                    balances: [],
                    message: `Unable to retrieve token balances for ${params.network} ${params.chainType}. Using fallback data.`,
                    fallback: true,
                },
                message: `Unable to retrieve token balances for account ${params.accountAddress} from Nodit API. Please try again later.`,
            };
        } catch (error) {
            console.error("[NoditProvider] Final error:", error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred",
            };
        }
    }

    @CreateAction({
        name: "getBlockByNumber",
        description: "Get block information by block number",
        schema: z.object({
            network: z
                .string()
                .describe(
                    "The blockchain network (e.g., 'ethereum', 'polygon')"
                ),
            chainType: z
                .string()
                .describe("The chain type (e.g., 'mainnet', 'testnet')"),
            blockNumber: z
                .union([z.string(), z.number()])
                .describe("The block number to query"),
            includeTransactions: z
                .boolean()
                .optional()
                .describe("Whether to include transaction details"),
        }),
    })
    async getBlockByNumber(
        walletProvider: WalletProvider,
        params: {
            network: string;
            chainType: string;
            blockNumber: string | number;
            includeTransactions?: boolean;
        }
    ) {
        try {
            const url = `${NODIT_BASE_URL}/${params.network}/${params.chainType}/block/getBlockByNumber`;

            const requestBody: any = {
                blockNumber: params.blockNumber.toString(),
            };

            if (params.includeTransactions !== undefined) {
                requestBody.includeTransactions = params.includeTransactions;
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-API-KEY": this.apiKey,
                    accept: "application/json",
                    "content-type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(
                    `Nodit API error: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            return {
                success: true,
                data,
                message: `Retrieved block ${params.blockNumber} information`,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred",
            };
        }
    }

    @CreateAction({
        name: "getTransactionByHash",
        description: "Get transaction details by transaction hash",
        schema: z.object({
            network: z
                .string()
                .describe(
                    "The blockchain network (e.g., 'ethereum', 'polygon')"
                ),
            chainType: z
                .string()
                .describe("The chain type (e.g., 'mainnet', 'testnet')"),
            transactionHash: z
                .string()
                .describe("The transaction hash to query"),
        }),
    })
    async getTransactionByHash(
        walletProvider: WalletProvider,
        params: {
            network: string;
            chainType: string;
            transactionHash: string;
        }
    ) {
        try {
            const url = `${NODIT_BASE_URL}/${params.network}/${params.chainType}/transaction/getTransactionByHash`;

            const requestBody = {
                transactionHash: params.transactionHash,
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-API-KEY": this.apiKey,
                    accept: "application/json",
                    "content-type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(
                    `Nodit API error: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            return {
                success: true,
                data,
                message: `Retrieved transaction ${params.transactionHash} details`,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred",
            };
        }
    }
}

export const noditProvider = (config?: NoditConfig) =>
    new NoditProvider(config);
