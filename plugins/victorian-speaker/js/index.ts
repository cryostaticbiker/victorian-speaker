import { ActionSheetActionCreators } from '@valenced/discord/actions'
import { getModules } from '@valenced/modules/finders'
import {
	createFilterGenerator,
	withProps,
} from '@valenced/modules/finders/filters'
import { after } from '@valenced/patcher'
import { cloneElement, createElement, isValidElement, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import type {
	Filter,
	FilterGenerator,
	FilterScopes,
} from '@valenced/modules/finders/filters'
import type {
	FC,
	MemoExoticComponent,
	ReactNode,
} from 'react'
import {
	transformText,
	type VictorianIntensity,
	type VictorianMode,
} from './victorian'

interface Settings {
	mode: VictorianMode
	intensity: VictorianIntensity
}

const MODES: Array<{ id: VictorianMode; label: string; shortLabel: string }> = [
	{ id: 'tea', label: 'Tea & Toast', shortLabel: 'Tea' },
	{ id: 'drawing-room', label: 'Drawing Room', shortLabel: 'Drawing' },
	{ id: 'royal', label: 'Royal Decree', shortLabel: 'Royal' },
]

const INTENSITIES: Array<{ id: VictorianIntensity; label: string }> = [
	{ id: 'subtle', label: 'Subtle' },
	{ id: 'balanced', label: 'Balanced' },
	{ id: 'florid', label: 'Florid' },
]

const REWRITE_SHEET_KEY = 'victorian-speaker-rewrite-sheet'

let activeMode: VictorianMode = 'drawing-room'
let activeIntensity: VictorianIntensity = 'balanced'
let persistSettings: ((settings: Partial<Settings>) => void) | undefined

function openRewriteSheet() {
	ActionSheetActionCreators.openLazy(
		import('./rewrite-sheet'),
		REWRITE_SHEET_KEY,
		{
			sheetKey: REWRITE_SHEET_KEY,
			mode: activeMode,
			intensity: activeIntensity,
		},
	)
}

function ModePicker() {
	const [selectedMode, setSelectedMode] = useState<VictorianMode>(activeMode)
	const [selectedIntensity, setSelectedIntensity] =
		useState<VictorianIntensity>(activeIntensity)

	const option = (
		id: string,
		label: string,
		selected: boolean,
		onPress: () => void,
	) =>
		createElement(
			Pressable,
			{
				key: id,
				onPress,
				style: {
					backgroundColor: selected ? '#5865f2' : '#34363c',
					borderRadius: 10,
					paddingHorizontal: 8,
					paddingVertical: 5,
				},
				accessibilityRole: 'button',
				accessibilityLabel: label,
				accessibilityState: { selected },
			},
			createElement(
				Text,
				{
					style: {
						color: '#ffffff',
						fontSize: 11,
						fontWeight: selected ? '700' : '500',
					},
				},
				label,
			),
		)

	return createElement(
		View,
		{
			style: {
				flexDirection: 'column',
				alignItems: 'flex-start',
				paddingHorizontal: 4,
				paddingVertical: 3,
				gap: 5,
			},
			accessibilityLabel: 'Victorian Speaker controls',
		},
		createElement(
			View,
			{ style: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 } },
			...MODES.map(mode =>
				option(mode.id, mode.shortLabel, selectedMode === mode.id, () => {
					activeMode = mode.id
					setSelectedMode(mode.id)
					persistSettings?.({ mode: mode.id })
				}),
			),
		),
		createElement(
			View,
			{ style: { flexDirection: 'row', alignItems: 'center', gap: 4 } },
			createElement(
				Text,
				{ style: { color: '#b5bac1', fontSize: 10, marginRight: 2 } },
				'Intensity',
			),
			...INTENSITIES.map(intensity =>
				option(
					intensity.id,
					intensity.label,
					selectedIntensity === intensity.id,
					() => {
						activeIntensity = intensity.id
						setSelectedIntensity(intensity.id)
						persistSettings?.({ intensity: intensity.id })
					},
				),
			),
		),
		createElement(
			Pressable,
			{
				onPress: openRewriteSheet,
				style: {
					backgroundColor: '#5865f2',
					borderRadius: 10,
					paddingHorizontal: 12,
					paddingVertical: 7,
					marginTop: 2,
				},
				accessibilityRole: 'button',
				accessibilityLabel: 'Open Victorian Speaker rewrite',
			},
			createElement(
				Text,
				{ style: { color: '#ffffff', fontSize: 12, fontWeight: '700' } },
				'Rewrite text',
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
	([name]) => 'memoizedNamedExoticComponent(' + name + ')',
) as WithMemoizedNamedExoticComponent

export default plugin<{ jsonStorage: Settings }>({
	jsonStorage: {
		load: true,
		default: { mode: 'drawing-room', intensity: 'balanced' },
	},

	start({ cleanup, jsonStorage }) {
		const storedMode = jsonStorage.cache?.mode
		const storedIntensity = jsonStorage.cache?.intensity
		activeMode = MODES.some(mode => mode.id === storedMode)
			? storedMode!
			: 'drawing-room'
		activeIntensity = INTENSITIES.some(
			intensity => intensity.id === storedIntensity,
		)
			? storedIntensity!
			: 'balanced'
		persistSettings = settings => jsonStorage.set(settings)

		// Add the style controls and manual rewrite action to the composer row.
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
		persistSettings = undefined
	},
})
