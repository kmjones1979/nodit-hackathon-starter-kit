const { getPersonality } = require("./apps/web/app/config/personalities.ts");

// Test the Trump personality
const trumpPersonality = getPersonality("trump");
console.log("Trump Personality:");
console.log("ID:", trumpPersonality.id);
console.log("Name:", trumpPersonality.name);
console.log("System Prompt:");
console.log(trumpPersonality.systemPrompt);
console.log("\n---\n");

// Test if the system prompt contains the expected Trump-like phrases
const prompt = trumpPersonality.systemPrompt;
const trumpPhrases = [
    "tremendous",
    "incredible",
    "HUGE",
    "believe me",
    "greatest",
    "beautiful",
];
const foundPhrases = trumpPhrases.filter((phrase) =>
    prompt.toLowerCase().includes(phrase.toLowerCase())
);

console.log("Found Trump phrases:", foundPhrases);
console.log(
    "Missing phrases:",
    trumpPhrases.filter((phrase) => !foundPhrases.includes(phrase))
);
