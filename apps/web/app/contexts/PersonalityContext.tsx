"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    Personality,
    getPersonality,
    DEFAULT_PERSONALITY_ID,
} from "../config/personalities";

interface PersonalityContextType {
    personality: Personality;
    setPersonality: (personalityId: string) => void;
    personalityId: string;
}

const PersonalityContext = createContext<PersonalityContextType | undefined>(
    undefined
);

export function PersonalityProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [personalityId, setPersonalityId] = useState<string>(
        DEFAULT_PERSONALITY_ID
    );
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check for saved personality preference
        const savedPersonality = localStorage.getItem("personality");
        if (savedPersonality) {
            setPersonalityId(savedPersonality);
        }
    }, []);

    const setPersonality = (newPersonalityId: string) => {
        console.log(
            `[PersonalityContext] Setting personality to: ${newPersonalityId}`
        );
        setPersonalityId(newPersonalityId);
        localStorage.setItem("personality", newPersonalityId);
    };

    const personality = getPersonality(personalityId);

    // Prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <PersonalityContext.Provider
            value={{ personality, setPersonality, personalityId }}
        >
            {children}
        </PersonalityContext.Provider>
    );
}

export function usePersonality() {
    const context = useContext(PersonalityContext);
    if (context === undefined) {
        throw new Error(
            "usePersonality must be used within a PersonalityProvider"
        );
    }
    return context;
}
