import { describe, expect, test } from 'bun:test'
import {
  buildRewritePrompt,
  protectMessage,
  restoreProtectedMessage,
  rewriteWithEngine,
  type RewriteProvider,
} from './ai'

const dictionary = (text: string) => 'dictionary:' + text

function provider(
  id: string,
  result: string | Error,
  available = true,
): RewriteProvider {
  return {
    id,
    isAvailable: () => available,
    rewrite: async () => {
      if (result instanceof Error) throw result
      return result
    },
  }
}

const request = {
  text: 'hello',
  mode: 'drawing-room' as const,
  intensity: 'florid' as const,
}

describe('AI rewrite engine', () => {
  test('builds prompts with the selected style and intensity', () => {
    const prompt = buildRewritePrompt(request)
    expect(prompt).toContain('Drawing Room')
    expect(prompt).toContain('elaborate')
    expect(prompt).toContain('Preserve the exact meaning')
  })

  test('protects URLs, code, mentions, and custom emoji', () => {
    const tick = String.fromCharCode(96)
    const source = 'hello https://example.com ' + tick + 'code' + tick + ' <@123> <:wave:456>'
    const protectedMessage = protectMessage(source)
    expect(protectedMessage.parts).toHaveLength(4)
    expect(protectedMessage.text).not.toContain('https://example.com')
    expect(restoreProtectedMessage(protectedMessage.text, protectedMessage.parts)).toBe(source)
  })

  test('rejects missing or duplicated protected placeholders', () => {
    const protectedMessage = protectMessage('hello https://example.com')
    expect(() =>
      restoreProtectedMessage('rewritten', protectedMessage.parts),
    ).toThrow()
    expect(() =>
      restoreProtectedMessage(
        protectedMessage.text + ' ' + protectedMessage.parts[0].token,
        protectedMessage.parts,
      ),
    ).toThrow()
  })

  test('uses cloud AI first in hybrid mode', async () => {
    const result = await rewriteWithEngine(request, {
      engine: 'hybrid',
      providers: { cloud: provider('cloud', 'Good day') },
      dictionary,
    })
    expect(result).toEqual({ text: 'Good day', engine: 'cloud' })
  })

  test('falls back to local AI when cloud fails', async () => {
    const result = await rewriteWithEngine(request, {
      engine: 'hybrid',
      providers: {
        cloud: provider('cloud', new Error('offline')),
        local: provider('local', 'A most pleasant day'),
      },
      dictionary,
    })
    expect(result).toEqual({
      text: 'A most pleasant day',
      engine: 'local',
    })
  })

  test('falls back to dictionary when no AI provider is available', async () => {
    const result = await rewriteWithEngine(request, {
      engine: 'hybrid',
      dictionary,
    })
    expect(result.engine).toBe('dictionary')
    expect(result.text).toBe('dictionary:hello')
    expect(result.fallbackReason).toContain('not configured')
  })

  test('cloud-only mode does not silently use local AI', async () => {
    const result = await rewriteWithEngine(request, {
      engine: 'cloud',
      providers: { local: provider('local', 'local result') },
      dictionary,
    })
    expect(result.engine).toBe('dictionary')
  })

  test('local-only mode does not silently use cloud AI', async () => {
    const result = await rewriteWithEngine(request, {
      engine: 'local',
      providers: { cloud: provider('cloud', 'cloud result') },
      dictionary,
    })
    expect(result.engine).toBe('dictionary')
  })

  test('malformed AI output falls back without losing the original message', async () => {
    const result = await rewriteWithEngine(
      { ...request, text: 'hello https://example.com' },
      {
        engine: 'cloud',
        providers: { cloud: provider('cloud', 'rewritten but link omitted') },
        dictionary,
      },
    )
    expect(result.text).toBe('dictionary:hello https://example.com')
    expect(result.engine).toBe('dictionary')
  })

  test('does not use an unavailable provider', async () => {
    const result = await rewriteWithEngine(request, {
      engine: 'hybrid',
      providers: {
        cloud: provider('cloud', 'unused', false),
        local: provider('local', 'local result'),
      },
      dictionary,
    })
    expect(result.engine).toBe('local')
  })
})
