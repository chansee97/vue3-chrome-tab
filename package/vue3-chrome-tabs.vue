<template>
	<div class="vue3-chrome-tabs">
		<div class="chrome-tabs" style="--tab-content-margin: 9px">
			<div class="chrome-tabs-content" ref="contentRef">
				<div class="chrome-tab" v-for="(tab, i) in tabs" :key="tab.key" :ref="(el) => setTabRef(el, tab)"
					:class="{ active: tab.key == modelValue }" @contextmenu="(e) => handleContextMenu(e, tab, i)">
					<div class="chrome-tab-dividers"></div>
					<div class="chrome-tab-background">
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
							<defs>
								<symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36">
									<path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" />
								</symbol>
								<symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36">
									<use xlink:href="#chrome-tab-geometry-left" />
								</symbol>
								<clipPath id="crop">
									<rect class="mask" width="100%" height="100%" x="0" />
								</clipPath>
							</defs>
							<svg width="52%" height="100%">
								<use xlink:href="#chrome-tab-geometry-left" width="214" height="36" class="chrome-tab-geometry" />
							</svg>
							<g transform="scale(-1, 1)">
								<svg width="52%" height="100%" x="-100%" y="0">
									<use xlink:href="#chrome-tab-geometry-right" width="214" height="36" class="chrome-tab-geometry" />
								</svg>
							</g>
						</svg>
					</div>
					<div class="chrome-tab-content">
						<div class="chrome-tab-favicon">😄</div>
						<div class="chrome-tab-title">{{ tab.label }}</div>
						<div class="chrome-tab-drag-handle"></div>
						<div class="chrome-tab-close" @click.stop="handleClose(tab, i)"></div>
					</div>
				</div>
			</div>
			<div class="chrome-tabs-bottom-bar"></div>
		</div>
		<div class="chrome-tabs-optional-shadow-below-bottom-bar"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, PropType, nextTick, onMounted, computed } from 'vue';
import { Tab, tabType } from './types';
import Draggabilly from 'draggabilly'; //https://draggabilly.desandro.com/

const contentRef = ref<HTMLDivElement>();

onMounted(() => {
	init();
});
const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: '',
	},
	tabs: {
		type: Array as PropType<Tab[]>,
		default: () => [],
	},
	/**
	 * tab 的最小宽度
	 */
	minWidth: {
		type: Number,
		default: 24,
	},
	/**
	 * tab 的最大宽度
	 */
	maxWidth: {
		type: Number,
		default: 240,
	},
});
const emit = defineEmits<{
	(event: 'click', e: Event, tab: Tab, i: number): void;
	(event: 'contextmenu', e: Event, tab: Tab, i: number): void;
	(event: 'dragstart', e: Event, tab: Tab, i: number): void;
	(event: 'draging', e: Event, tab: Tab, i: number): void;
	(event: 'dragend', e: Event, tab: Tab, i: number): void;
	(event: 'close', tab: Tab, i: number): void;
	(event: 'update:modelValue', key: number | string): void;
}>();

function init() {
	props.tabs.forEach((tab: Tab, i: number) => {
		addInstance(tab, i);
	});
}

const GAP = 19;

function addInstance(tab: Tab, i: number) {
	// 如果已经存在实例，则重新设置位置
	if (tab._instance) {
		tab._instance.setPosition(tab._x, 0);
		return;
	}

	tab._instance = new Draggabilly(tab._el, {
		axis: 'x',
		containment: contentRef.value,
		handle: '.chrome-tab-drag-handle',
	});

	setTabPosition(tab, i);

	// 绑定拖拽事件
	const { dragable = true } = tab
	if (dragable) {
		tab._instance.on('dragStart', (e: Event) => handleDragStart(e, tab, i));
		tab._instance.on('dragMove', (e: Event) => handleDragMove(e, tab, i));
		tab._instance.on('dragEnd', (e: Event) => handleDragEnd(e, tab, i));
	}
	tab._instance.on('staticClick', (e: Event) => handleClick(e, tab, i));
}

function setTabRef(el: tabType, tab: Tab) {
	if (el) {
		tab._el = el;
	}
}

function doLayout() {
	props.tabs.forEach((tab, i) => {
		setTabPosition(tab, i);
	});
}

function setTabPosition(tab: Tab, i: number) {
	const instance = tab._instance;
	const _x = (calcTabWidth.value - GAP) * i;
	tab._x = _x;
	instance.setPosition(_x, 0);
}

function addTab(tab: Tab) {
	const { length } = props.tabs;
	props.tabs.push(tab);
	nextTick(() => {
		addInstance(tab, length);
		doLayout();
		emit('update:modelValue', tab.key);
	});
}
defineExpose({
	addTab,
});

const handleClick = (e: Event, tab: Tab, i: number) => {
	emit('update:modelValue', tab.key);
	emit('click', e, tab, i);
};

function handleClose(tab: Tab, i: number) {
	tab._instance.destroy();
	props.tabs.splice(i, 1);
	doLayout();
	emit('close', tab, i);
}
function handleContextMenu(e: Event, tab: Tab, i: number) {
	emit('contextmenu', e, tab, i);
}

function handleDragStart(e: Event, tab: Tab, i: number) {
	emit('update:modelValue', tab.key);
	emit('dragstart', e, tab, i);
}

function handleDragMove(e: Event, tab: Tab, i: number) {
	const halfWidth = calcTabWidth.value / 2;

	const { x } = tab._instance.position;
	const { length } = props.tabs;

	let swapTab: Tab | null = null;
	for (let i = 0; i < length; i++) {
		const currentTab: Tab = props.tabs[i];
		const targetX: number = (currentTab._x || 1) - 1;
		// 如果命中自己本身，则无需交换
		if (tab.key === currentTab.key) {
			continue;
		}
		// 判断是否有重叠的 tab
		const isSwap = (targetX <= x && x < targetX + halfWidth) || (targetX - halfWidth <= x && x < targetX)
		if (isSwap) {
			swapTab = currentTab;
			swapTabs(tab, swapTab);
			break;
		}
	}

	emit('draging', e, tab, i);
}
function swapTabs(tab: Tab, swapTab: Tab) {
	const { tabs } = props;
	let index = -1;
	let swapIndex = -1;

	for (let i = 0; i < tabs.length; i++) {
		const obj: Tab = tabs[i];
		if (obj.key === tab.key) {
			index = i;
		}
		if (obj.key === swapTab.key) {
			swapIndex = i;
		}
	}

	if (index < 0 || swapIndex < 0 || index === swapIndex) {
		return;
	}
	/** 交换index */
	[tabs[index], tabs[swapIndex]] = [tabs[swapIndex], tabs[index]];

	/** 交换position */
	const { _x } = tab
	tab._x = swapTab._x
	swapTab._x = _x

	const { _instance } = swapTab;
	setTimeout(() => {
		_instance.element.classList.add('move')
		_instance.setPosition(_x, _instance.position.y)
	}, 50)
	setTimeout(() => {
		_instance.element.classList.remove('move')
	}, 200)
}
function handleDragEnd(e: Event, tab: Tab, i: number) {
	const { _instance } = tab;

	if (_instance.position.x === 0) return
	setTimeout(() => {
		_instance.element.classList.add('move')
		_instance.setPosition(tab._x, 0)
	}, 50)
	setTimeout(() => {
		_instance.element.classList.remove('move')
		emit('dragend', e, tab, i)
	}, 200)
}

const calcTabWidth = computed(() => {
	const { tabs, minWidth, maxWidth } = props;
	const containerWidth = contentRef.value?.clientWidth || window.innerWidth;
	const averageWidth = (containerWidth - 7 - GAP) / tabs.length + GAP;
	let resultWidth = 0;

	const handle: [boolean, () => void][] = [
		[
			averageWidth > maxWidth,
			() => {
				resultWidth = maxWidth;
			},
		],
		[
			averageWidth < minWidth,
			() => {
				resultWidth = maxWidth;
			},
		],
		[
			true,
			() => {
				resultWidth = averageWidth;
			},
		],
	];

	handle.some((item) => {
		const [flag, action] = item;
		if (flag) {
			action();
		}
		return flag;
	});
	return resultWidth;
});
</script>

<style scoped lang="less">
@import './chrome-tabs.less';

.vue3-chrome-tabs {
	--container-background-color: #03629d;

	--tab-width: v-bind(calcTabWidth + 'px');
	--tab-content-margin: 9px;
	--tab-background-color: #056eae;
	--tab-background-color-active: #117fc3;
	--tab-text-color: #d9d9da;
	--tab-text-color-active: #fff;
	--tab-close-color: #fff;
	--tab-close-background-color: #3085bb;
	--tab-close-background-color-active: #4d97c5;
}
</style>
