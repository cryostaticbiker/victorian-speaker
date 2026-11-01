# Victorian Speaker

A Valenced plugin that rewrites outgoing Discord messages into playful Victorian-style English.

## Three styles

- **Tea & Toast** — a light touch, such as changing “thanks” to “many thanks”.
- **Drawing Room** — moderate formality, such as changing “hello” to “I bid you good day”.
- **Royal Decree** — deliberately extravagant, such as changing “please” to “I beseech thee”.

Choose the active style using the three compact buttons added to the chat composer action row. The selected style is saved locally.

## Behaviour

- Rewrites message text immediately before Discord sends it.
- Leaves URLs, inline code, and fenced code blocks unchanged.
- Preserves other message fields, including attachment metadata.
- Does not edit the visible draft while typing.
- Runs entirely on-device. No message text is sent to an external rewriting service.

The first version uses a local phrase dictionary, not a language model. This keeps it private and fast, but it will not perfectly rewrite arbitrary sentences.

## Build

This repository uses the official Valenced plugin CLI.

```sh
bun install
bun run build victorian-speaker
```

The JavaScript bundle is written to `plugins/victorian-speaker/build/js/index.js`. The GitHub Actions workflow packages it with the manifest into an installable ZIP and publishes the ZIP plus a generated repository index to the `gh-pages` branch.

## Install on Android

### Add the plugin repository

After the first successful GitHub Pages deployment:

1. In GitHub, open **Settings → Pages**.
2. Set the publishing source to **Deploy from a branch**.
3. Select branch **gh-pages** and folder **/(root)**, then save.
4. In Valenced, open **Settings → Valenced → Plugins**.
5. Tap the settings gear and add:

   `https://cryostaticbiker.github.io/victorian-speaker/index.json`

6. Open **Browse Plugins**, find **Victorian Speaker**, install it, and enable it.

### Manual installation

1. Open the [GitHub Actions builds](https://github.com/cryostaticbiker/victorian-speaker/actions).
2. Open the latest successful build.
3. Download the `Victorian-Speaker-Android-Plugin` artifact.
4. Extract the downloaded artifact ZIP. It contains the actual plugin ZIP.
5. In Valenced, open **Settings → Valenced → Plugins**, tap the settings gear, choose **Install from file**, and select the inner plugin ZIP.
6. Enable Victorian Speaker.

Manual ZIP installs do not receive automatic updates. Use the repository method for updates.

## Compatibility and testing

The plugin targets the Valenced API. It intercepts the outgoing `sendMessage` action and patches the chat composer action row to display the three style buttons.

A successful CI build confirms that the code bundles and packages. It does not prove that Discord's internal composer component is identical on every client version. Verify that the three mode buttons appear and that a test message is transformed before relying on it.

## Ideas for later versions

- Preview the transformed message before sending.
- Add a custom phrase dictionary and user-defined substitutions.
- Add per-server or per-channel default styles.
- Add a one-tap enable/disable control.
- Add a “rewrite this draft” button that updates the composer text.
- Preserve mentions and markdown with dedicated parsing.
- Add Regency, Shakespearean, or legalistic styles.
