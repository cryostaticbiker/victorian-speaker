export type VictorianMode = "tea" | "drawing-room" | "royal"

type Replacement = readonly [phrase: string, replacement: string]

const REPLACEMENTS: Record<VictorianMode, Replacement[]> = {
  tea: [
    ["what's up", "what's the news"],
    ["how are you", "how do you fare"],
    ["thank you", "I thank you kindly"],
    ["thanks", "many thanks"],
    ["you're welcome", "think nothing of it"],
    ["no problem", "think nothing of it"],
    ["my bad", "my apologies"],
    ["I don't know", "I'm not quite certain"],
    ["I have no idea", "I haven't the faintest notion"],
    ["I think", "I reckon"],
    ["I want", "I'd quite like"],
    ["I need", "I could do with"],
    ["I like", "I rather like"],
    ["I love", "I absolutely adore"],
    ["I hate", "I cannot stand"],
    ["I'm sorry", "I'm terribly sorry"],
    ["see you later", "until later"],
    ["good morning", "a very good morning"],
    ["good night", "sleep well, and good night"],
    ["what the hell", "what on earth"],
    ["what the fuck", "what on earth"],
    ["shut up", "do be quiet"],
    ["help me", "do lend me a hand"],
    ["come on", "do come along"],
    ["let me know", "do keep me informed"],
    ["can't", "cannot"],
    ["don't", "do not"],
    ["doesn't", "does not"],
    ["didn't", "did not"],
    ["isn't", "is not"],
    ["aren't", "are not"],
    ["won't", "will not"],
    ["wouldn't", "would not"],
    ["couldn't", "could not"],
    ["shouldn't", "should not"],
    ["I'm", "I am"],
    ["I've", "I have"],
    ["I'll", "I shall"],
    ["you're", "you are"],
    ["they're", "they are"],
    ["we're", "we are"],
    ["it's", "it is"],
    ["that's", "that is"],
    ["gonna", "going to"],
    ["wanna", "wish to"],
    ["gotta", "have to"],
    ["kinda", "rather"],
    ["sorta", "somewhat"],
    ["hello", "good day"],
    ["hey", "good day"],
    ["hi", "good day"],
    ["please", "if you please"],
    ["okay", "very well"],
    ["ok", "very well"],
    ["cool", "splendid"],
    ["awesome", "marvellous"],
    ["great", "excellent"],
    ["amazing", "wonderful"],
    ["weird", "rather peculiar"],
    ["annoying", "most irritating"],
    ["bye", "farewell"],
    ["lol", "ha"],
  ],
  "drawing-room": [
    ["what's up", "what news have you"],
    ["how are you", "how do you fare this fine day"],
    ["thank you", "I am exceedingly obliged"],
    ["thanks", "I am much obliged"],
    ["you're welcome", "the pleasure is entirely mine"],
    ["no problem", "it is quite my pleasure"],
    ["my bad", "I must beg your pardon"],
    ["I don't know", "I cannot say with certainty"],
    ["I have no idea", "I am entirely without knowledge of the matter"],
    ["I think", "I am of the opinion"],
    ["I want", "I should very much like"],
    ["I need", "I find myself in need of"],
    ["I like", "I find most agreeable"],
    ["I love", "I hold in the highest affection"],
    ["I hate", "I find utterly disagreeable"],
    ["I'm sorry", "you have my sincerest apologies"],
    ["see you later", "I look forward to our next meeting"],
    ["good morning", "I wish you a most pleasant morning"],
    ["good night", "I wish you a most restful evening"],
    ["what the hell", "whatever can be the meaning of this"],
    ["what the fuck", "whatever can be the meaning of this"],
    ["shut up", "might I request a moment of silence"],
    ["help me", "might I ask for your assistance"],
    ["come on", "I must insist that we proceed"],
    ["let me know", "I should be grateful if you would inform me"],
    ["can't", "cannot"],
    ["don't", "do not"],
    ["doesn't", "does not"],
    ["didn't", "did not"],
    ["isn't", "is not"],
    ["aren't", "are not"],
    ["won't", "shall not"],
    ["wouldn't", "would not"],
    ["couldn't", "could not"],
    ["shouldn't", "should not"],
    ["I'm", "I am"],
    ["I've", "I have"],
    ["I'll", "I shall"],
    ["you're", "you are"],
    ["they're", "they are"],
    ["we're", "we are"],
    ["it's", "it is"],
    ["that's", "that is"],
    ["gonna", "going to"],
    ["wanna", "wish to"],
    ["gotta", "must"],
    ["kinda", "somewhat"],
    ["sorta", "rather"],
    ["hello", "I bid you good day"],
    ["hey", "good morrow"],
    ["hi", "good morrow"],
    ["please", "I beseech you"],
    ["okay", "very well, indeed"],
    ["ok", "very well, indeed"],
    ["cool", "most splendid"],
    ["awesome", "truly marvellous"],
    ["great", "most excellent"],
    ["amazing", "quite extraordinary"],
    ["weird", "decidedly peculiar"],
    ["annoying", "exceedingly tiresome"],
    ["bye", "I bid you farewell"],
    ["lol", "I must say, how amusing"],
  ],
  royal: [
    ["what's up", "what tidings dost thou bring"],
    ["how are you", "how fares thee"],
    ["thank you", "I am eternally in thy debt"],
    ["thanks", "thou hast my deepest gratitude"],
    ["you're welcome", "think nothing of it, good subject"],
    ["no problem", "let it be known that the matter is settled"],
    ["my bad", "I hereby offer my most solemn apology"],
    ["I don't know", "such knowledge hath not been granted unto me"],
    ["I have no idea", "the matter is shrouded in mystery"],
    ["I think", "it is my considered royal judgment"],
    ["I want", "I am most desirous of"],
    ["I need", "I have urgent need of"],
    ["I like", "I hold in high regard"],
    ["I love", "I cherish with all due fervour"],
    ["I hate", "I find wholly intolerable"],
    ["I'm sorry", "I humbly beg thy forgiveness"],
    ["see you later", "until our paths cross by royal decree"],
    ["good morning", "may this morning find thee in good fortune"],
    ["good night", "may the night grant thee peaceful rest"],
    ["what the hell", "what in the kingdom's name"],
    ["what the fuck", "what in the kingdom's name"],
    ["shut up", "silence, by order of the crown"],
    ["help me", "I command thee to lend assistance"],
    ["come on", "let us proceed without further delay"],
    ["let me know", "you shall report back to me"],
    ["can't", "cannot"],
    ["don't", "do not"],
    ["doesn't", "does not"],
    ["didn't", "did not"],
    ["isn't", "is not"],
    ["aren't", "are not"],
    ["won't", "shall not"],
    ["wouldn't", "would not"],
    ["couldn't", "could not"],
    ["shouldn't", "should not"],
    ["I'm", "I am"],
    ["I've", "I have"],
    ["I'll", "I shall"],
    ["you're", "thou art"],
    ["they're", "they are"],
    ["we're", "we are"],
    ["it's", "it is"],
    ["that's", "that is"],
    ["gonna", "shall"],
    ["wanna", "desire to"],
    ["gotta", "must needs"],
    ["kinda", "of a sort"],
    ["sorta", "in a manner of speaking"],
    ["hello", "I graciously bid thee welcome"],
    ["hey", "attend, good subject"],
    ["hi", "attend, good subject"],
    ["please", "by thy leave"],
    ["okay", "so it shall be"],
    ["ok", "so it shall be"],
    ["cool", "of the utmost splendour"],
    ["awesome", "a matter of magnificent consequence"],
    ["great", "a triumph worthy of the crown"],
    ["amazing", "a marvel to rival the finest wonders"],
    ["weird", "most unnatural"],
    ["annoying", "an affront to the royal patience"],
    ["bye", "until fate permits our paths to cross again"],
    ["lol", "the court is most amused"],
  ],
}

function matchCase(source: string, replacement: string): string {
  if (source === source.toUpperCase()) return replacement.toUpperCase()

  const firstLetter = source.match(/[A-Za-z]/)?.[0]
  if (firstLetter && firstLetter === firstLetter.toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }

  return replacement
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function rewritePlainText(text: string, mode: VictorianMode): string {
  const replacements = REPLACEMENTS[mode]
    .map(([from, to]) => ({ from, to }))
    .sort((a, b) => b.from.length - a.from.length)

  const alternatives = replacements
    .map(({ from }) => escapeRegExp(from).replace(/\s+/g, "\\s+"))
    .join("|")

  const lookup = new Map(replacements.map(({ from, to }) => [from.toLowerCase(), to]))
  const expression = new RegExp(`\\b(${alternatives})\\b`, "gi")

  return text.replace(expression, match => {
    const replacement = lookup.get(match.replace(/\s+/g, " ").toLowerCase())
    return replacement ? matchCase(match, replacement) : match
  })
}

/**
 * Rewrites prose locally. URLs, inline code, and fenced code blocks are left alone.
 * This is intentionally rule-based and never sends message text to an external service.
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
