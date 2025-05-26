"use client";

import { useDebug } from "../contexts/DebugContext";
import { Button } from "./ui/button";

export function DebugToggle() {
    const { isDebug, toggleDebug } = useDebug();

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleDebug}
            className={`transition-all duration-200 ${
                isDebug
                    ? "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                    : "bg-background hover:bg-accent text-muted-foreground hover:text-foreground"
            }`}
        >
            <span className="flex items-center gap-1">
                {isDebug ? (
                    <>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        🔍 Debug On
                    </>
                ) : (
                    <>
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Debug Off
                    </>
                )}
            </span>
        </Button>
    );
}
