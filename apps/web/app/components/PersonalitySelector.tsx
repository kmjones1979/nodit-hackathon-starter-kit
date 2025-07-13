"use client";

import { useState } from "react";
import { usePersonality } from "../contexts/PersonalityContext";
import { getAllPersonalities } from "../config/personalities";
import { ChevronDown, User } from "lucide-react";

export function PersonalitySelector() {
    const { personality, setPersonality, personalityId } = usePersonality();
    const [isOpen, setIsOpen] = useState(false);
    const allPersonalities = getAllPersonalities();

    const handlePersonalitySelect = (newPersonalityId: string) => {
        console.log(
            `[PersonalitySelector] Selecting personality: ${newPersonalityId}`
        );
        setPersonality(newPersonalityId);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Select AI personality"
            >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{personality.emoji}</span>
                <span className="hidden md:inline">{personality.name}</span>
                <ChevronDown className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-md shadow-lg z-50">
                    <div className="p-2 border-b border-border">
                        <h3 className="text-sm font-semibold text-foreground">
                            AI Personality
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Choose how your AI assistant communicates
                        </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {allPersonalities.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => handlePersonalitySelect(p.id)}
                                className={`w-full text-left px-3 py-3 hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0 ${
                                    personalityId === p.id
                                        ? "bg-accent text-accent-foreground"
                                        : ""
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                        style={{ backgroundColor: p.color }}
                                    >
                                        {p.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-sm truncate">
                                                {p.name}
                                            </h4>
                                            {personalityId === p.id && (
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {p.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
