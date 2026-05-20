// Lightweight Indonesian/English profanity filter for SafeSpace community.
// Goal: keep the forum safe — censor common slurs/curse words and surface a warning.

const BAD_WORDS = [
  // ID
  "anjing", "anjg", "anjir", "ajg", "bangsat", "bgst", "babi", "kontol", "kntl",
  "memek", "mmk", "ngentot", "ngentod", "ngewe", "pepek", "puki", "pukimak",
  "tai", "tahi", "tolol", "goblok", "goblog", "idiot", "bego", "bodoh",
  "bajingan", "bjir", "bjg", "asu", "jancok", "jancuk", "cuk", "cok",
  "kampret", "kampang", "lonte", "pelacur", "sundal", "perek",
  "monyet", "kunyuk", "setan", "iblis", "brengsek", "sialan",
  // EN
  "fuck", "fucker", "fucking", "shit", "bitch", "bastard", "asshole",
  "dick", "pussy", "cunt", "slut", "whore", "retard", "faggot", "nigger",
  // light insults often used to bully
  "jelek", "kampungan",
];

const ESCAPE = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Word boundary that also catches punctuation/letters around — relaxed but effective
const RE = new RegExp(`\\b(${BAD_WORDS.map(ESCAPE).join("|")})\\b`, "gi");

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  RE.lastIndex = 0;
  return RE.test(text);
}

export function censorProfanity(text: string): { clean: string; censored: boolean; matches: string[] } {
  if (!text) return { clean: "", censored: false, matches: [] };
  const matches: string[] = [];
  const clean = text.replace(RE, (m) => {
    matches.push(m.toLowerCase());
    return m[0] + "*".repeat(Math.max(m.length - 1, 2));
  });
  return { clean, censored: matches.length > 0, matches };
}
