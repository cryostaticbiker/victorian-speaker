import { describe, expect, test } from 'bun:test'
import { createOpenAICompatibleProvider } from './openai-compatible'

describe('OpenAI-compatible provider', () => {
  test('sends a chat-completions request with the configured model', async () => {
    let requestedUrl = ''
    let requestBody: Record<string, unknown> | undefined
    let authorization = ''

    const provider = createOpenAICompatibleProvider({
      baseUrl: 'https://example.test/v1/',
      model: 'test-model',
      getApiKey: () => 'temporary-access-token',
      fetchImpl: async (input, init) => {
        requestedUrl = String(input)
        authorization = new Headers(init?.headers).get('Authorization') ?? ''
        requestBody = JSON.parse(String(init?.body))
        return new Response(
          JSON.stringify({
            choices: [{ message: { content: 'A most pleasant day.' } }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      },
    })

    const result = await provider.rewrite({
      text: 'hello',
      mode: 'drawing-room',
      intensity: 'balanced',
    })

    expect(requestedUrl).toBe('https://example.test/v1/chat/completions')
    expect(authorization).toBe('Bearer temporary-access-token')
    expect(requestBody?.model).toBe('test-model')
    expect(result).toBe('A most pleasant day.')
  })

  test('does not send a request without an access token', async () => {
    let called = false
    const provider = createOpenAICompatibleProvider({
      baseUrl: 'https://example.test/v1',
      model: 'test-model',
      getApiKey: () => undefined,
      fetchImpl: async () => {
        called = true
        return new Response('{}')
      },
    })

    await expect(
      provider.rewrite({
        text: 'hello',
        mode: 'tea',
        intensity: 'subtle',
      }),
    ).rejects.toThrow('No cloud AI API key')
    expect(called).toBe(false)
  })

  test('reports provider errors without exposing an unbounded response body', async () => {
    const provider = createOpenAICompatibleProvider({
      baseUrl: 'https://example.test/v1',
      model: 'test-model',
      getApiKey: () => 'token',
      fetchImpl: async () =>
        new Response('x'.repeat(1000), { status: 429 }),
    })

    await expect(
      provider.rewrite({
        text: 'hello',
        mode: 'tea',
        intensity: 'subtle',
      }),
    ).rejects.toThrow('Cloud AI request failed (429)')
  })
})
