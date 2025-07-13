# AI Personality & Tool System

This system provides a flexible, maintainable way to create AI personalities with consistent tool descriptions. The architecture separates personality traits from tool capabilities, making it easy to add new personalities and tools.

## Architecture Overview

### Core Components

1. **`tool-descriptions.ts`** - Centralized tool definitions and personality-specific formatting
2. **`personalities.ts`** - Core personality definitions using the tool system
3. **`personality-builder.ts`** - Helper functions for creating new personalities
4. **`README.md`** - This documentation

### Key Benefits

- **DRY (Don't Repeat Yourself)** - Tool descriptions are defined once and reused
- **Maintainable** - Update tool descriptions globally from one place
- **Extensible** - Easy to add new personalities and tools
- **Consistent** - All personalities get the same tool capabilities with their own voice
- **Developer-friendly** - Simple helpers for common tasks

## Adding New Personalities

### Method 1: Using the Builder (Recommended)

```typescript
import { createPersonality } from "./personality-builder";

const newPersonality = createPersonality({
    id: "pirate",
    name: "Captain Blackbeard",
    description: "Swashbuckling crypto pirate",
    emoji: "🏴‍☠️",
    color: "#8B4513",
    characterTraits: `Ahoy matey! I be Captain Blackbeard, the fiercest crypto pirate on the seven blockchains! I'll help ye navigate these treacherous DeFi waters and find the greatest treasure - profitable trades!`,
    additionalContext: `Remember, in the world of crypto, fortune favors the bold! But always keep yer wits about ye - there be scurvy scammers in these waters! Arrr!`,
});
```

### Method 2: Using Templates

```typescript
import { createPersonalityFromTemplate } from "./personality-builder";

const newPersonality = createPersonalityFromTemplate("casual", {
    id: "gamer",
    name: "Pro Gamer",
    description: "Elite gamer who loves crypto",
    emoji: "🎮",
    color: "#FF6B6B",
    characterTraits:
        "Yo! I'm a pro gamer who's totally into crypto and Web3 gaming. I'll help you level up your blockchain skills and find the best play-to-earn opportunities!",
    additionalContext: "GG! Let's dominate the crypto game together! 🚀",
});
```

### Method 3: Adding Tool Templates

First, add your tool template to `tool-descriptions.ts`:

```typescript
export const TOOL_TEMPLATES: Record<string, ToolDescriptionTemplate> = {
    // ... existing templates
    pirate: {
        intro: "Me trusty tools be ready fer battle:",
        toolPrefix: "",
        toolFormat: (tool) =>
            `- '${tool.name}': ${tool.details.replace(/\b\w/g, (w) => w.toLowerCase())} - a fine weapon fer any pirate!`,
        noditPrefix: "**Me Nodit treasure map:**",
        noditFormat: (tool) =>
            `- '${tool.name}': ${tool.details} - like having a spy glass fer the blockchain seas!`,
        networksPrefix: "I sail across all the blockchain seas:",
        networksFormat: (networks) =>
            networks.join(", ") + " - each one full of treasure!",
        conclusion:
            "Trust me compass, but verify the map! In these waters, a smart pirate always checks twice before diving fer treasure!",
    },
};
```

Then use it in your personality:

```typescript
const piratePersonality = createPersonality({
    id: "pirate",
    // ... other properties
});
```

## Adding New Tools

### Step 1: Add to Core Tools

In `tool-descriptions.ts`, add your tool to the appropriate array:

```typescript
export const CORE_TOOLS: ToolDescription[] = [
    // ... existing tools
    {
        name: "newTool",
        purpose: "Brief description of what it does",
        details: "Detailed explanation of the tool's capabilities",
    },
];
```

### Step 2: Implement the Tool

Create the actual tool implementation in the appropriate action provider:

```typescript
// In your action provider
@CreateAction({
    name: "newTool",
    description: "Brief description for the AI model",
    schema: YourToolSchema,
})
async newTool(walletProvider: WalletProvider, args: YourToolInput) {
    // Implementation
}
```

### Step 3: Test with All Personalities

The tool will automatically be available to all personalities with their own voice/style.

## Tool Templates

Tool templates define how each personality describes the same tools. Each template includes:

```typescript
interface ToolDescriptionTemplate {
    intro: string; // Introduction to the tools section
    toolPrefix: string; // Optional prefix for core tools
    toolFormat: (tool: ToolDescription) => string; // How to format each core tool
    noditPrefix: string; // Introduction to Nodit tools
    noditFormat: (tool: ToolDescription) => string; // How to format each Nodit tool
    networksPrefix: string; // Introduction to supported networks
    networksFormat: (networks: string[]) => string; // How to format network list
    conclusion: string; // Concluding remarks
}
```

## Example: Complete New Personality

```typescript
// 1. Add tool template (optional - falls back to professional)
export const TOOL_TEMPLATES: Record<string, ToolDescriptionTemplate> = {
    // ... existing templates
    ninja: {
        intro: "My shadow techniques include:",
        toolPrefix: "",
        toolFormat: (tool) =>
            `- '${tool.name}': ${tool.details.toLowerCase()} - swift and silent`,
        noditPrefix: "**My stealth surveillance network:**",
        noditFormat: (tool) =>
            `- '${tool.name}': ${tool.details} - like having eyes everywhere`,
        networksPrefix: "I move through all blockchain realms:",
        networksFormat: (networks) =>
            networks.join(", ") + " - each one mapped and mastered.",
        conclusion:
            "In the shadows of DeFi, patience and precision lead to victory.",
    },
};

// 2. Create the personality
const ninjaPersonality = createPersonality({
    id: "ninja",
    name: "Crypto Ninja",
    description: "Stealthy blockchain warrior",
    emoji: "🥷",
    color: "#2D3748",
    characterTraits: `*emerges from shadows* 

I am the Crypto Ninja, master of stealth trading and silent profits. In the chaotic world of DeFi, I move unseen, strike precisely, and vanish before the market knows what happened.`,
    additionalContext: `*bows respectfully*

Remember, young warrior - in crypto as in ninjutsu, patience and discipline are your greatest weapons. Strike when others fear, retreat when others are greedy.

*disappears in a cloud of smoke*`,
});

// 3. Add to personalities list
export const PERSONALITIES: Record<string, Personality> = {
    // ... existing personalities
    ninja: ninjaPersonality,
};
```

## Best Practices

### For Tool Descriptions

- Keep descriptions concise but informative
- Use consistent terminology across all tools
- Focus on what the tool does, not how it works internally
- Consider how different personalities might describe the same function

### For Personalities

- Define clear character traits that distinguish the personality
- Keep tool descriptions separate from personality traits
- Use consistent emoji and color schemes
- Test with various user queries to ensure the personality remains consistent

### For Templates

- Make formatting functions flexible enough to handle different tool types
- Include personality-specific vocabulary and phrases
- Maintain the same information while changing the tone
- Consider how the personality would naturally describe technical concepts

## Validation

Use the built-in validation to ensure your personalities are properly configured:

```typescript
import { validatePersonality } from "./personality-builder";

const errors = validatePersonality(myPersonalityBuilder);
if (errors.length > 0) {
    console.error("Personality validation errors:", errors);
}
```

## Testing

After adding a new personality:

1. **Test the selector** - Verify it appears in the UI dropdown
2. **Test the voice** - Ask the same question with different personalities
3. **Test tool descriptions** - Ensure tools are described in the character's voice
4. **Test consistency** - Verify the personality maintains its character across different topics

## Common Issues

### Tool Descriptions Not Updating

- Check that your personality ID matches the template key
- Verify the template is properly exported
- Ensure you're calling `generateToolDescription()` with the correct ID

### Personality Not Appearing

- Verify the personality is added to the `PERSONALITIES` object
- Check that all required fields are provided
- Ensure the ID is unique and properly formatted

### Inconsistent Formatting

- Review the tool template formatting functions
- Test with different tool types to ensure consistent output
- Consider edge cases in your formatting logic

## Future Enhancements

This system is designed to be extensible. Potential future improvements:

- **Dynamic personality loading** - Load personalities from external files
- **Personality inheritance** - Create base personalities that others can extend
- **Tool categories** - Group related tools together
- **Conditional tools** - Show/hide tools based on personality or context
- **Personality analytics** - Track usage patterns and preferences

## Contributing

When adding new personalities or tools:

1. Follow the existing patterns and conventions
2. Add proper documentation and examples
3. Test thoroughly with different scenarios
4. Consider how your changes affect existing personalities
5. Update this README if you add new features or patterns
