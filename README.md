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

## Build

This repository uses the official Revenge plugin CLI and manifest format.

Requirements: Bun (recommended) or Node.js 22.18+, plus a current Revenge installation for testing.

```sh
bun install
bun run build
```

The CLI packages the plugin using the entry point and `dist.script` declared in `plugins/victorian-speaker/manifest.json`.

## Install in Revenge

For a local test build:

1. Build the plugin with `bun run build`.
2. Find the generated ZIP in the CLI output.
3. In Revenge, open **Settings → Revenge → Plugins**.
4. Open the repository/settings gear, choose **Install from file**, and select the ZIP.
5. Enable **Victorian Speaker** in the plugin list.

For a public install link with automatic updates, this repository still needs a published plugin repository index and GitHub Pages deployment. A raw TypeScript source URL is not an installable plugin.

## Compatibility note

The composer picker uses the internal `ChatInputGuardWrapper` component name, which can change when Discord updates. The send-time rewrite is patched separately, so a composer UI change should not silently disable message rewriting. Test the picker on the exact Revenge/Discord build in use before treating this as a release.

## Ideas for later versions

- Preview the transformed message before sending.
- Add a per-channel or per-server default style.
- Add a custom phrase dictionary and user-defined substitutions.
- Add a “preserve mentions and markdown” toggle.
- Add a quick “rewrite this draft” button that updates the composer text.
- Add a Regency, Shakespearean, or legalistic mode as optional extra styles.
