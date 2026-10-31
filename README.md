# Victorian Speaker

A Revenge plugin that rewrites outgoing Discord messages into playful Victorian-style English.

## Three styles

- **Tea & Toast** — light touch: “thanks” becomes “many thanks”.
- **Drawing Room** — moderate formality: “hello” becomes “I bid you good day”.
- **Royal Decree** — deliberately extravagant: “please” becomes “I beseech thee”.

Choose the active style using the three compact buttons added to the chat composer action row. The selected style is saved locally.

## Behaviour

- Rewrites message text immediately before Discord sends it.
- Leaves URLs, inline code, and fenced code blocks unchanged.
- Preserves other message fields, including attachment metadata.
- Does not edit the visible draft while typing.
- Runs entirely on-device. No message text is sent to an external rewriting service.

The first version uses a local phrase dictionary, not a language model. This keeps it private and fast, but it will not perfectly rewrite arbitrary sentences.

## Build

This repository uses the official Revenge plugin CLI.

```sh
bun install
bun run build victorian-speaker
```

The JavaScript bundle is written to `plugins/victorian-speaker/build/js/index.js`. The GitHub Actions workflow packages that bundle with the manifest into an installable ZIP and publishes the ZIP plus a generated repository index to the `gh-pages` branch.

## Install on Android

### Recommended: add the plugin repository

After the first successful Pages deployment:

1. In GitHub, open **Settings → Pages**.
2. Set the publishing source to **Deploy from a branch**.
3. Select branch **gh-pages** and folder **/(root)**, then save.
4. In Revenge, open **Settings → Revenge → Plugins**.
5. Tap the settings gear and add this repository URL:

   `https://cryostaticbiker.github.io/victorian-speaker/index.json`

6. Open **Browse Plugins**, find **Victorian Speaker**, install it, and enable it.

The repository URL is the generated `index.json`, not the GitHub source-code URL.

### Manual test install

1. Open the [GitHub Actions builds](https://github.com/cryostaticbiker/victorian-speaker/actions).
2. Open the latest successful **Build Victorian Speaker** run.
3. Download the `Victorian-Speaker-Android-Plugin` artifact.
4. Extract the downloaded artifact ZIP. It contains the actual plugin ZIP.
5. In Revenge, open **Settings → Revenge → Plugins**, tap the settings gear, choose **Install from file**, and select the inner plugin ZIP.
6. Enable Victorian Speaker.

Manual ZIP installs do not receive automatic updates. Use the repository method for updates.

## Compatibility and testing

The plugin targets the current Revenge API and uses the current community pattern for the memoized `ChatInputRightActions` component. The send-time rewrite is separately hooked through the `sendMessage` action.

A successful CI build confirms that the code bundles and packages. It does not prove that Discord's internal composer component is identical on every Android client version. Verify that the three mode buttons appear and that a test message is transformed before relying on it.

## Ideas for later versions

- Preview the transformed message before sending.
- Add a custom phrase dictionary and user-defined substitutions.
- Add per-server or per-channel default styles.
- Add a one-tap enable/disable control.
- Add a “rewrite this draft” button that updates the composer text.
- Preserve mentions and markdown with dedicated parsing.
- Add Regency, Shakespearean, or legalistic styles.
