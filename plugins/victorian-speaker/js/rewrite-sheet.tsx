import { ActionSheetActionCreators, ToastActionCreators } from '@valenced/discord/actions'
import { Design } from '@valenced/discord/design'
import { Clipboard } from '@valenced/externals/react-native-clipboard'
import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { rewriteWithEngine } from './ai'
import type { VictorianIntensity, VictorianMode } from './victorian'
import { transformText } from './victorian'

export interface RewriteSheetProps {
  sheetKey: string
  mode: VictorianMode
  intensity: VictorianIntensity
}

const MODE_LABELS: Record<VictorianMode, string> = {
  tea: 'Tea & Toast',
  'drawing-room': 'Drawing Room',
  royal: 'Royal Decree',
}

export default function RewriteSheet({
  sheetKey,
  mode,
  intensity,
}: RewriteSheetProps) {
  const [source, setSource] = useState('')
  const [rewritten, setRewritten] = useState('')
  const [engineLabel, setEngineLabel] = useState('')
  const [busy, setBusy] = useState(false)

  const close = () => ActionSheetActionCreators.hideActionSheet(sheetKey)

  const rewrite = async () => {
    const text = source.trim()
    if (!text || busy) return

    setBusy(true)
    setRewritten('')
    setEngineLabel('')

    try {
      const result = await rewriteWithEngine(
        { text, mode, intensity },
        {
          // The provider boundary is ready, but provider setup is not wired
          // into the plugin UI yet. Hybrid therefore safely falls back to the
          // local dictionary transformer until a provider is configured.
          engine: 'hybrid',
          dictionary: transformText,
        },
      )
      setRewritten(result.text)
      setEngineLabel(
        result.engine === 'dictionary'
          ? 'Offline dictionary rewrite'
          : result.engine === 'cloud'
            ? 'Cloud AI rewrite'
            : 'Local AI rewrite',
      )
    } catch {
      setRewritten(transformText(text, mode, intensity))
      setEngineLabel('Offline dictionary rewrite')
    } finally {
      setBusy(false)
    }
  }

  const copyResult = () => {
    if (!rewritten) return
    Clipboard.setString(rewritten)
    ToastActionCreators.open('victorian-speaker-copied', {
      text: 'Rewritten text copied',
      variant: 'success',
    })
  }

  const buttonStyle = (disabled = false) => ({
    backgroundColor: disabled ? '#3b3d44' : '#5865f2',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    opacity: disabled ? 0.55 : 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  })

  return (
    <Design.ActionSheet
      scrollable
      startExpanded
      keyboardShouldPersistTaps="handled"
      bodyStyles={{ paddingBottom: 24 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 12 }}
      >
        <View style={{ gap: 4 }}>
          <Text style={{ color: '#f2f3f5', fontSize: 20, fontWeight: '700' }}>
            Victorian Speaker
          </Text>
          <Text style={{ color: '#b5bac1', fontSize: 13 }}>
            Enter text to rewrite. Your original message will not be sent or changed.
          </Text>
          <Text style={{ color: '#b5bac1', fontSize: 12 }}>
            {MODE_LABELS[mode]} · {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
          </Text>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ color: '#dbdee1', fontSize: 13, fontWeight: '600' }}>
            Original text
          </Text>
          <TextInput
            value={source}
            onChangeText={setSource}
            placeholder="Write or paste something to rewrite…"
            placeholderTextColor="#80848e"
            multiline
            textAlignVertical="top"
            style={{
              minHeight: 112,
              maxHeight: 220,
              color: '#f2f3f5',
              backgroundColor: '#2b2d31',
              borderRadius: 10,
              padding: 12,
              fontSize: 15,
            }}
          />
        </View>

        <Pressable
          onPress={rewrite}
          disabled={!source.trim() || busy}
          style={buttonStyle(!source.trim() || busy)}
          accessibilityRole="button"
        >
          {busy ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
              Rewrite text
            </Text>
          )}
        </Pressable>

        <View style={{ gap: 6 }}>
          <Text style={{ color: '#dbdee1', fontSize: 13, fontWeight: '600' }}>
            Rewritten text
          </Text>
          {rewritten ? (
            <>
              <TextInput
                value={rewritten}
                editable={false}
                multiline
                selectTextOnFocus
                textAlignVertical="top"
                style={{
                  minHeight: 112,
                  color: '#f2f3f5',
                  backgroundColor: '#2b2d31',
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 15,
                }}
              />
              <Text style={{ color: '#b5bac1', fontSize: 12 }}>
                {engineLabel}
              </Text>
              <Pressable onPress={copyResult} style={buttonStyle()}>
                <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
                  Copy rewritten text
                </Text>
              </Pressable>
            </>
          ) : (
            <Text style={{ color: '#80848e', fontSize: 13 }}>
              Your rewritten text will appear here.
            </Text>
          )}
        </View>

        <Text style={{ color: '#949ba4', fontSize: 12, lineHeight: 17 }}>
          AI providers are not connected yet. For now, rewriting uses the offline
          dictionary rules and keeps URLs and code unchanged.
        </Text>

        <Pressable onPress={close} style={{ paddingVertical: 10, alignItems: 'center' }}>
          <Text style={{ color: '#b5bac1', fontSize: 14 }}>Close</Text>
        </Pressable>
      </ScrollView>
    </Design.ActionSheet>
  )
}
