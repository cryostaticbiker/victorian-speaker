import { getModules } from "@revenge-mod/modules/finders"
import { withName, withProps } from "@revenge-mod/modules/finders/filters"
import { after, before } from "@revenge-mod/patcher"
import { cloneElement, createElement, useState } from "react"
import { Pressable, Text, View } from "react-native"
import { transformText, type VictorianMode } from "./victorian"

interface Settings {
  mode: VictorianMode
}

interface MessageActions {
  sendMessage(
    channelId: string,
    message: { content?: string },
    clearDraft: boolean,
    options?: Record<string, unknown>,
  ): unknown
}

const MODES: { id: VictorianMode; label: string }[] = [
  { id: "tea", label: "Tea & Toast" },
  { id: "drawing-room", label: "Drawing Room" },
  { id: "royal", label: "Royal Decree" },
]

let activeMode: VictorianMode = "drawing-room"
let persistMode: ((mode: VictorianMode) => void) | undefined

function ModePicker() {
  const [selected, setSelected] = useState<VictorianMode>(activeMode)

  return createElement(
    View,
    {
      style: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: 7,
        marginTop: 2,
      },
    },
    createElement(
      Text,
      {
        style: {
          color: "#b9bac0",
          fontSize: 11,
          fontWeight: "600",
          marginRight: 7,
        },
      },
      "VICTORIAN",
    ),
    ...MODES.map(mode =>
      createElement(
        Pressable,
        {
          key: mode.id,
          onPress: () => {
            activeMode = mode.id
            setSelected(mode.id)
            persistMode?.(mode.id)
          },
          style: {
            backgroundColor: selected === mode.id ? "#5865f2" : "#34363c",
            borderRadius: 12,
            paddingHorizontal: 9,
            paddingVertical: 6,
            marginRight: 5,
            marginBottom: 3,
          },
          accessibilityRole: "button",
          accessibilityLabel: `Use ${mode.label} Victorian style`,
          accessibilityState: { selected: selected === mode.id },
        },
        createElement(
          Text,
          {
            style: {
              color: "#ffffff",
              fontSize: 11,
              fontWeight: selected === mode.id ? "700" : "500",
            },
          },
          mode.label,
        ),
      ),
    ),
  )
}

function addPickerToElement(element: any) {
  if (!element || !element.props) return element

  const children = element.props.children
  const picker = createElement(ModePicker, { key: "victorian-speaker-mode-picker" })

  if (Array.isArray(children)) {
    if (children.some(child => child?.key === "victorian-speaker-mode-picker")) return element
    return cloneElement(element, undefined, picker, ...children)
  }

  if (children?.key === "victorian-speaker-mode-picker") return element
  return children == null
    ? cloneElement(element, undefined, picker)
    : cloneElement(element, undefined, picker, children)
}

export default plugin<{ jsonStorage: Settings }>({
  jsonStorage: {
    load: true,
    default: { mode: "drawing-room" },
  },

  start({ cleanup, jsonStorage }) {
    const storedMode = jsonStorage.cache?.mode
    activeMode = MODES.some(mode => mode.id === storedMode)
      ? storedMode!
      : "drawing-room"

    persistMode = mode => jsonStorage.set({ mode })

    // Rewrite only the outgoing message content. Attachments and other message
    // fields are preserved, and the original draft is not modified in-place.
    cleanup(
      getModules(withProps<MessageActions>("sendMessage"), module => {
        cleanup(
          before(module, "sendMessage", args => {
            const message = args[1]
            if (
              message &&
              typeof message.content === "string" &&
              message.content.length > 0
            ) {
              args[1] = {
                ...message,
                content: transformText(message.content, activeMode),
              }
            }
            return args
          }),
        )
      }),
    )

    // Revenge's current composer wrapper is discovered by component name.
    // If Discord renames this internal component in a future update, sending
    // still works; only the in-composer picker will need its finder updated.
    cleanup(
      getModules(withName("ChatInputGuardWrapper"), module => {
        if (typeof module?.default !== "function") return

        cleanup(
          after(module, "default", (_args, result) => {
            return addPickerToElement(result)
          }),
        )
      }),
    )
  },

  stop() {
    persistMode = undefined
  },
})
