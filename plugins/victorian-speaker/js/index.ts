import { getModules } from '@revenge-mod/modules/finders'
import {
	createFilterGenerator,
	withProps,
} from '@revenge-mod/modules/finders/filters'
import { after, before } from '@revenge-mod/patcher'
import { cloneElement, createElement, isValidElement, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import type {
	Filter,
	FilterGenerator,
	FilterScopes,
} from '@revenge-mod/modules/finders/filters'
import type {
	FC,
	MemoExoticComponent,
	ReactElement,
	ReactNode,
} from 'react'
import { transformText, type VictorianMode } from './victorian'

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

const MODES: Array<{ id: VictorianMode; label: string; shortLabel: string }> = [
	{ id: 'tea', label: 'Tea & Toast', shortLabel: 'Tea' },
	{ id: 'drawing-room', label: 'Drawing Room', shortLabel: 'Drawing' },
	{ id: 'royal', label: 'Royal Decree', shortLabel: 'Royal' },
]

let activeMode: VictorianMode = 'drawing-room'
let persistMode: ((mode: VictorianMode) => void) | undefined

function ModePicker() {
	const [selected, setSelected] = useState<VictorianMode>(activeMode)

	return createElement(
		View,
		{
			style: {
				flexDirection: 'row',
				alignItems: 'center',
				flexWrap: 'wrap',
				paddingHorizontal: 4,
				paddingVertical: 3,
				gap: 4,
			},
			accessibilityLabel: 'Victorian Speaker style selector',
		},
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
						backgroundColor: selected === mode.id ? '#5865f2' : '#34363c',
						borderRadius: 10,
						paddingHorizontal: 8,
						paddingVertical: 5,
					},
					accessibilityRole: 'button',
					accessibilityLabel: `Use ${mode.label} style`,
					accessibilityState: { selected: selected === mode.id },
				},
				createElement(
					Text,
					{
						style: {
							color: '#ffffff',
							fontSize: 11,
							fontWeight: selected === mode.id ? '700' : '500',
						},
					},
					mode.shortLabel,
				),
			),
		),
	)
}

function addPicker(tree: ReactNode): ReactNode {
	if (!isValidElement<{ children?: ReactNode }>(tree)) return tree

	const children = tree.props.children
	const existing = (Array.isArray(children) ? children : [children]).some(
		child =>
			isValidElement(child) &&
			child.key === 'victorian-speaker-mode-picker',
	)
	if (existing) return tree

	const picker = createElement(ModePicker, {
		key: 'victorian-speaker-mode-picker',
	})

	if (children == null) return cloneElement(tree, undefined, picker)
	if (Array.isArray(children))
		return cloneElement(tree, undefined, picker, ...children)

	return cloneElement(tree, undefined, picker, children)
}

type WithMemoizedNamedExoticComponent = FilterGenerator<
	<P = object>(
		name: string,
	) => Filter<{
		Result: MemoExoticComponent<FC<P>>
		Scopes: [typeof FilterScopes.Initialized]
	}>
>

const withMemoizedNamedExoticComponent = createFilterGenerator(
	([name], _, exports) =>
		exports?.type?.length === 1 && exports.type.displayName === name,
	([name]) => `memoizedNamedExoticComponent(${name})`,
) as WithMemoizedNamedExoticComponent

export default plugin<{ jsonStorage: Settings }>({
	jsonStorage: {
		load: true,
		default: { mode: 'drawing-room' },
	},

	start({ cleanup, jsonStorage }) {
		const storedMode = jsonStorage.cache?.mode
		activeMode = MODES.some(mode => mode.id === storedMode)
			? storedMode!
			: 'drawing-room'
		persistMode = mode => jsonStorage.set({ mode })

		// Intercept the actual outgoing message action. Only the content field
		// changes; embeds, attachments, and other message metadata are retained.
		cleanup(
			getModules(withProps<MessageActions>('sendMessage'), messages => {
				cleanup(
					before(messages, 'sendMessage', args => {
						const message = args[1]
						if (
							message &&
							typeof message.content === 'string' &&
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

		// Add the mode buttons to the existing chat composer action row.
		cleanup(
			getModules(
				withMemoizedNamedExoticComponent('ChatInputRightActions'),
				ChatInputRightActions => {
					cleanup(
						after(ChatInputRightActions, 'type', tree => addPicker(tree)),
					)
				},
			),
		)
	},

	stop() {
		persistMode = undefined
	},
})
