# Victorian Speaker

A Valenced plugin that rewrites text into playful Victorian-style English.

## Three styles

- **Tea & Toast** — a light touch, such as changing “thanks” to “many thanks”.
- **Drawing Room** — moderate formality, such as changing “hello” to “I bid you good day”.
- **Royal Decree** — deliberately extravagant, such as changing “please” to “I beseech thee”.

Choose the active style and translation intensity using the compact controls added to the chat composer action row. Both preferences are saved locally.

## Translation intensity

- **Subtle** — rewrites complete phrases while leaving individual words and greetings alone.
- **Balanced** — uses the full existing phrase and vocabulary dictionary. This is the default.
- **Florid** — adds stronger, style-specific vocabulary substitutions for a more exaggerated result.

## Rewrite text

Tap **Rewrite text** in the composer action row to open the Victorian Speaker sheet. Enter or paste text, preview the rewritten result, and copy it when you're happy with it.

The rewrite sheet works independently of the Discord composer draft. It does not intercept message sending, modify the current draft, or send anything automatically.

The current rewrite action uses the local phrase dictionary. The provider-independent AI engine foundation is included in the development branch, but cloud account sign-in and a local inference runtime are not connected yet. Until those are implemented, the UI clearly identifies the result as an offline dictionary rewrite.

## Behaviour and privacy

- Leaves URLs, inline code, and fenced code blocks unchanged.
- Keeps the original message separate from the rewritten result.
- Does not send message text to an external service in the current implementation.
- Does not automatically send rewritten text.

The local phrase dictionary is private and fast, but it will not perfectly rewrite arbitrary sentences.

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

The plugin targets the Valenced API and patches the chat composer action row to display its style controls and rewrite action.

A successful CI build confirms that the code bundles and packages. It does not prove that Discord's internal composer component is identical on every client version. Verify that the controls appear and test the rewrite sheet on your installed Valenced version.

## Ideas for later versions

- Connect cloud AI providers through supported account sign-in flows.
- Add an optional on-device language model with clear storage, memory, and battery disclosures.
- Add custom phrase dictionaries and user-defined substitutions.
- Add per-server or per-channel default styles.
- Add Regency, Shakespearean, or legalistic styles.
