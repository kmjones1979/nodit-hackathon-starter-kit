import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./global.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProvidersDynamic as Providers } from "./providers";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
});

export const metadata: Metadata = {
    title: "Nodit AI Agent",
    description:
        "Web3 AI assistant powered by Nodit for blockchain data queries and smart contract interactions",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.variable} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
