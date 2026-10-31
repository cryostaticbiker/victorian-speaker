# Victorian Speaker

A Revenge plugin that rewrites outgoing Discord messages into playful Victorian-style English.

## Three styles

- **Tea & Toast** — light touch: “thanks” becomes “many thanks”.
- **Drawing Room** — moderate formality: “hello” becomes “I bid you good day”.
- **Royal Decree** — deliberately extravagant: “please” becomes “I beseech thee”.

Choose the active style from the three buttons added above the chat composer. The selected style is saved locally.

## Behaviour

- Rewrites message text immediately before Discord sends it.
- Leaves URLs, inline code, and fenced code blocks unchanged.
- Preserves other message fields, including attachment metadata.
- Does not edit the visible draft while typing.
- Runs entirely on-device. No message text is sent to an external rewriting service.

The first version uses a small local phrase dictionary, not a language model. This keeps it private and fast, but it will not perfectly rewrite arbitrary sentences.

## Build status

The source and manifest are committed, but this repository has **not yet been built or published as an installable plugin**. The runtime API and composer patch still need to be checked against the exact Revenge build being used.

The code follows the modern Revenge plugin API style used in current community plugin examples. The older `@vendetta/plugin` examples in some repositories are useful for patterns, but are not interchangeable with the modern plugin API.

## Local development

Use the current Revenge plugin tooling for the installed app version. Once the build tooling is pinned and configured, the expected workflow will be:

```sh
bun install
bun run build
```

A TypeScript source file by itself is not an installable plugin. Revenge needs the built JavaScript bundle and a valid manifest.

## Publishing and installing

To make this repository installable by URL, it needs a hosted plugin repository index and a built plugin artifact (or the specific distribution format supported by the Revenge version in use). The repository does not have that published index or artifact yet, so **do not add this GitHub repository URL to Revenge as though it were already an installable plugin source**.

Once distribution is configured, the usual flow is to add the hosted repository URL in Revenge's plugin/repository settings, browse to Victorian Speaker, install it, and enable it. That also gives the repository a path for future updates.

## Compatibility note

The send-time rewrite and the chat-bar picker use internal Discord modules. Those module names and shapes can change between Discord releases. The composer picker currently targets `ChatInputGuardWrapper`; it must be tested on the target app version before release. The message interception is separate, so a composer UI change should not silently disable the rewrite itself.

## Ideas for later versions

- Preview the transformed message before sending.
- Add a per-channel or per-server default style.
- Add a custom phrase dictionary and user-defined substitutions.
- Add a “preserve mentions and markdown” toggle.
- Add a quick “rewrite this draft” button that updates the composer text.
- Add a Regency, Shakespearean, or legalistic mode as optional extra styles.
