import { describe, expect, test } from "bun:test"
import { transformText } from "./victorian"

describe("transformText", () => {
  test("uses a distinct vocabulary for each style", () => {
    expect(transformText("hello", "tea")).toBe("good day")
    expect(transformText("hello", "drawing-room")).toBe("I bid you good day")
    expect(transformText("hello", "royal")).toBe("I graciously bid thee welcome")
  })

  test("matches longer phrases before shorter phrases", () => {
    expect(transformText("what's up?", "tea")).toBe("what's the news?")
    expect(transformText("I don't know", "tea")).toBe("I'm not quite certain")
  })

  test("preserves sentence case and all-uppercase text", () => {
    expect(transformText("Hello", "tea")).toBe("Good day")
    expect(transformText("HELLO", "tea")).toBe("GOOD DAY")
  })

  test("matches phrases case-insensitively", () => {
    expect(transformText("THANK YOU", "drawing-room")).toBe("I AM EXCEEDINGLY OBLIGED")
  })

  test("does not rewrite text inside larger words", () => {
    expect(transformText("shelloworld", "tea")).toBe("shelloworld")
  })

  test("leaves URLs and inline or fenced code untouched", () => {
    const message = "hello https://example.com/hello `hello`\n```ts\nhello\n```"
    expect(transformText(message, "tea")).toBe(
      "good day https://example.com/hello `hello`\n```ts\nhello\n```",
    )
  })

  test("supports extra whitespace between words in a phrase", () => {
    expect(transformText("what's   up", "tea")).toBe("what's the news")
  })

  test("returns empty messages unchanged", () => {
    expect(transformText("", "royal")).toBe("")
  })
  
  test("subtle intensity only rewrites complete phrases", () => {
    expect(
      transformText("hello, thanks", "tea", "subtle"),
    ).toBe("hello, thanks")
    expect(
      transformText("how are you", "tea", "subtle"),
    ).toBe("how do you fare")
  })

  test("balanced intensity preserves the existing default behavior", () => {
    expect(transformText("hello", "tea")).toBe("good day")
    expect(transformText("hello", "tea", "balanced")).toBe("good day")
  })

  test("florid intensity applies stronger style-specific vocabulary", () => {
    expect(transformText("yes", "tea", "florid")).toBe("indeed")
    expect(
      transformText("yes", "drawing-room", "florid"),
    ).toBe("indeed, most certainly")
    expect(
      transformText("yes", "royal", "florid"),
    ).toBe("aye, by royal assent")
  })
})
