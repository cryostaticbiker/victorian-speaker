export type VictorianMode = "tea" | "drawing-room" | "royal"

type Replacement = readonly [string, string]

const REPLACEMENTS: Record<VictorianMode, Replacement[]> = {
  tea: [
    ["what's up", "what news"],
    ["how are you", "how do you fare"],
    ["thank you", "I thank you"],
    ["I think", "I am inclined to think"],
    ["I want", "I should like"],
    ["I need", "I require"],
    ["no problem", "think nothing of it"],
    ["my bad", "my apologies"],
    ["can't", "cannot"],
    ["don't", "do not"],
    ["won't", "shall not"],
    ["gonna", "going to"],
    ["wanna", "wish to"],
    ["hello", "good day"],
    ["hey", "good day"],
    ["hi", "good day"],
    ["thanks", "many thanks"],
    ["please", "pray"],
    ["okay", "very well"],
    ["ok", "very well"],
    ["cool", "splendid"],
    ["awesome", "remarkable"],
    ["great", "excellent"],
    ["bye", "farewell"],
    ["lol", "ha"],
  ],
  "drawing-room": [
    ["what's up", "what news have you"],
    ["how are you", "how do you fare this fine day"],
    ["thank you", "I am exceedingly obliged"],
    ["thanks", "I am much obliged"],
    ["I think", "I am of the opinion"],
    ["I want", "I should very much like"],
    ["I need", "I find myself in need of"],
    ["you guys", "you fine people"],
    ["no problem", "think nothing of it"],
    ["my bad", "I must beg your pardon"],
    ["can't", "cannot"],
    ["don't", "do not"],
    ["won't", "shall not"],
    ["gonna", "going to"],
    ["wanna", "wish to"],
    ["hello", "I bid you good day"],
    ["hey", "good morrow"],
    ["hi", "good morrow"],
    ["please", "I beseech you"],
    ["okay", "very well, indeed"],
    ["ok", "very well, indeed"],
    ["cool", "most splendid"],
    ["awesome", "truly marvellous"],
    ["great", "most excellent"],
    ["bye", "I bid you farewell"],
    ["lol", "I must say, how amusing"],
  ],
  royal: [
    ["what's up", "what tidings dost thou bring"],
    ["how are you", "how fares thee"],
    ["thank you", "I am eternally obliged to thee"],
    ["thanks", "I remain profoundly in thy debt"],
    ["I think", "it is my considered and most humble conviction"],
    ["I want", "I am most desirous of"],
    ["I need", "I am in dire need of"],
    ["you guys", "esteemed company"],
    ["no problem", "pray, think nothing further of it"],
    ["my bad", "I must offer my sincerest apologies"],
    ["can't", "cannot"],
    ["don't", "do not"],
    ["won't", "shall not"],
    ["gonna", "going to"],
    ["wanna", "wish to"],
    ["hello", "I humbly bid thee good morrow"],
    ["hey", "a most auspicious day to thee"],
    ["hi", "a most auspicious day to thee"],
    ["please", "I beseech thee"],
    ["okay", "so it shall be"],
    ["ok", "so it shall be"],
    ["cool", "of the utmost splendour"],
    ["awesome", "a most magnificent affair"],
    ["great", "truly a triumph of the highest order"],
    ["bye", "until fate permits our paths to cross again"],
    ["lol", "I confess, I am quite amused"],
  ],
}

function preserveInitialCapital(source: string, replacement: string) {
  if (source.length > 0 && source[0] === source[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }
  return replacement
}

function rewritePlainText(text: string, mode: VictorianMode) {
  let result = text

  // Longer phrases are listed first so short words do not consume them.
  for (const [from, to] of REPLACEMENTS[mode]) {
    const escaped = from.replace(/ /g, "\\s+")
    const expression = new RegExp(`\\b${escaped}\\b`, "gi")
    result = result.replace(expression, match => preserveInitialCapital(match, to))
  }

  return result
}

/**
 * Rewrites prose locally. URLs, inline code, and fenced code blocks are left alone.
 * This is intentionally rule-based and does not send message text to an external service.
 */
export function transformText(text: string, mode: VictorianMode): string {
  const protectedParts = /(```[\s\S]*?```|`[^\n`]*`|https?:\/\/[^\s<>]+)/g

  return text
    .split(protectedParts)
    .map(part => {
      if (!part) return part
      if (part.startsWith("`") || /^https?:\/\//i.test(part)) return part
      return rewritePlainText(part, mode)
    })
    .join("")
}
