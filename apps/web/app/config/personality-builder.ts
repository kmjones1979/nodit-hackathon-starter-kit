import {
    generateToolDescription,
    ToolDescriptionTemplate,
} from "./tool-descriptions";
import { Personality } from "./personalities";

export interface PersonalityBuilder {
    id: string;
    name: string;
    description: string;
    emoji: string;
    color: string;
    characterTraits: string;
    toolTemplate?: ToolDescriptionTemplate;
    additionalContext?: string;
}

/**
 * Creates a personality with automatically generated tool descriptions
 * @param builder - The personality configuration
 * @returns A complete Personality object
 */
export function createPersonality(builder: PersonalityBuilder): Personality {
    const toolDescription = generateToolDescription(builder.id);

    let systemPrompt = builder.characterTraits;

    // Add tool descriptions
    systemPrompt += `\n\n${toolDescription}`;

    // Add any additional context
    if (builder.additionalContext) {
        systemPrompt += `\n\n${builder.additionalContext}`;
    }

    return {
        id: builder.id,
        name: builder.name,
        description: builder.description,
        emoji: builder.emoji,
        color: builder.color,
        systemPrompt,
    };
}

/**
 * Example of how to create a new personality
 */
export const EXAMPLE_PERSONALITY = createPersonality({
    id: "example",
    name: "Example Character",
    description: "An example of how to create personalities",
    emoji: "🎭",
    color: "#6366f1",
    characterTraits: `I'm an example personality that shows how easy it is to create new AI characters. I speak in a clear, helpful manner and love to demonstrate features.`,
    additionalContext: `Remember, I'm just an example - you can create any personality you want using this system!`,
});

/**
 * Quick personality templates for common character types
 */
export const PERSONALITY_TEMPLATES = {
    professional: {
        characterTraits:
            "I am a professional assistant who communicates formally and precisely. I provide comprehensive explanations and maintain business-appropriate language.",
        additionalContext:
            "I focus on accuracy and thoroughness in all interactions.",
    },
    casual: {
        characterTraits:
            "Hey there! I'm your casual, friendly helper who likes to keep things relaxed and fun. I explain things in simple terms and use everyday language.",
        additionalContext:
            "I'm here to make Web3 accessible and enjoyable for everyone!",
    },
    expert: {
        characterTraits:
            "I am a technical expert with deep knowledge and extensive experience. I provide detailed analysis and advanced insights.",
        additionalContext:
            "I excel at explaining complex concepts and providing in-depth technical guidance.",
    },
    teacher: {
        characterTraits:
            "I'm an educational mentor focused on helping you learn step by step. I break down complex topics and encourage questions.",
        additionalContext:
            "Every interaction is a learning opportunity. Feel free to ask me to explain anything you don't understand!",
    },
};

/**
 * Creates a personality using a template
 * @param template - The template to use
 * @param customization - Custom overrides
 * @returns A complete Personality object
 */
export function createPersonalityFromTemplate(
    template: keyof typeof PERSONALITY_TEMPLATES,
    customization: Omit<
        PersonalityBuilder,
        "characterTraits" | "additionalContext"
    > & {
        characterTraits?: string;
        additionalContext?: string;
    }
): Personality {
    const templateData = PERSONALITY_TEMPLATES[template];

    return createPersonality({
        ...customization,
        characterTraits:
            customization.characterTraits || templateData.characterTraits,
        additionalContext:
            customization.additionalContext || templateData.additionalContext,
    });
}

/**
 * Validates a personality configuration
 * @param personality - The personality to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validatePersonality(personality: PersonalityBuilder): string[] {
    const errors: string[] = [];

    if (!personality.id) errors.push("ID is required");
    if (!personality.name) errors.push("Name is required");
    if (!personality.description) errors.push("Description is required");
    if (!personality.emoji) errors.push("Emoji is required");
    if (!personality.color) errors.push("Color is required");
    if (!personality.characterTraits)
        errors.push("Character traits are required");

    // Validate color format
    if (personality.color && !personality.color.match(/^#[0-9A-F]{6}$/i)) {
        errors.push("Color must be in hex format (e.g., #FF0000)");
    }

    return errors;
}

/**
 * Example of creating a custom personality
 */
export const CUSTOM_PERSONALITY_EXAMPLE = createPersonalityFromTemplate(
    "casual",
    {
        id: "surfer",
        name: "Surfer Dude",
        description: "Laid-back surfer who loves crypto",
        emoji: "🏄",
        color: "#00CED1",
        characterTraits:
            "Whoa, dude! I'm like, totally stoked about Web3 and crypto, man. I keep things chill and explain stuff in a way that's easy to understand. Think of me as your crypto buddy who just caught an epic wave!",
        additionalContext:
            "I'm all about good vibes and helping you ride the crypto waves safely. Cowabunga! 🌊",
    }
);
