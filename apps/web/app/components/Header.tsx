"use client";

import { useState } from "react";
import { ChainSelector } from "./ChainSelector";
import { PersonalitySelector } from "./PersonalitySelector";
import { WalletConnect } from "./WalletConnect";
import { SiweAuth } from "./SiweAuth";
import { DebugToggle } from "./DebugToggle";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-foreground">
                        Nodit Agent
                    </h1>
                </div>

                {/* Desktop Action Items - hidden on medium and smaller screens */}
                <div className="hidden md:flex items-center gap-2">
                    <ChainSelector />
                    <PersonalitySelector />
                    <WalletConnect />
                    <SiweAuth />
                    <DebugToggle />
                    <ThemeToggle />
                </div>

                {/* Mobile Hamburger Button - shown on medium and smaller screens */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden p-2 text-foreground hover:bg-accent rounded-md"
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu - shown when hamburger is clicked */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background/95 backdrop-blur">
                    <div className="container py-4 space-y-4">
                        {/* Mobile Navigation Links */}
                        <nav className="flex flex-col space-y-3">
                            <Link
                                href="/"
                                className="text-foreground hover:underline font-medium py-2"
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>
                        </nav>

                        {/* Mobile Action Items */}
                        <div className="pt-4 border-t space-y-3">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Chain
                                    </span>
                                    <ChainSelector />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        AI Personality
                                    </span>
                                    <PersonalitySelector />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <WalletConnect />
                                    <SiweAuth />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Settings
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <DebugToggle />
                                        <ThemeToggle />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
