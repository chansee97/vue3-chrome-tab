<template>
	<div class="vue3-chrome-tabs">
		<div class="chrome-tabs" style="--tab-content-margin: 9px">
			<div class="chrome-tabs-content" ref="contentRef">
				<div
					class="chrome-tab"
					v-for="(tab, i) in tabs"
					:key="tab.key"
					:ref="(el) => setTabRef(el, tab)"
					:class="{ active: tab.key == modelValue }">
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
								<clipPath id="crop"><rect class="mask" width="100%" height="100%" x="0" /></clipPath>
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
import Draggabilly from 'draggabilly';

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
		default: 40,
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
	(event: 'close', tab: Tab, i: number): void;
	(event: 'update:modelValue', key): void;
}>();

function init() {
	props.tabs.forEach((tab: Tab, i: number) => {
		addInstance(tab, i);
	});
}

function addInstance(tab: Tab, i: number) {
	tab._instance = new Draggabilly(tab._el, {
		axis: 'x',
		containment: contentRef.value,
		handle: '.chrome-tab-drag-handle',
	});

	tab._instance.setPosition(222 * i, 0);

	tab._instance.on('staticClick', (e: Event) => {
		return handleClick(e, tab, i);
	});
}

function setTabRef(el: tabType, tab: Tab) {
	if (el) {
		tab._el = el;
	}
}

function addTab(tab: Tab) {
	props.tabs.push(tab);
	nextTick(() => {
		init();
	});
}
defineExpose({
	addTab,
});

/**
 * 单击事件监听
 * @param e 单击事件
 * @param tab 命中的 tab
 * @param i 当前单击的下标
 */
const handleClick = (e: Event, tab: Tab, i: number) => {
	emit('update:modelValue', tab.key);
	emit('click', e, tab, i);
};
function handleClose(tab: Tab, i: number) {
	props.tabs.splice(i, 1);
	emit('close', tab, i);
}
/**
 * 计算单个 tab 的宽度
 */
const calcTabWidth = computed(() => {
	const { tabs, minWidth, maxWidth } = props;
	const containerWidth = contentRef.value?.clientWidth || window.innerWidth;
	const averageWidth = containerWidth / tabs.length;
	let resultWidth;

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
	return `${resultWidth}px`;
});
</script>

<style scoped lang="less">
@import './chrome-tabs.less';
.vue3-chrome-tabs {
	--container-background-color: #dee1e6;

	--tab-width: v-bind(calcTabWidth);
	--tab-content-margin: 9px;
	--tab-background-color: #fff;
	--tab-text-color: #5f6368;
	--tab-text-color-active: #45474a;
}
</style>
