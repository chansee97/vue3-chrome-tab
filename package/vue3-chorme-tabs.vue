<template>
	<div class="vue3-chrome-tabs">
		<div class="chrome-tabs" style="--tab-content-margin: 9px">
			<div class="chrome-tabs-content" ref="contentRef">
				<div
					class="chrome-tab"
					v-for="tab in props.tabs"
					:key="tab.key"
					:ref="(el) => setTabRef(el, tab)"
					:class="{ active: tab.key == props.modelValue }">
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
						<div class="chrome-tab-favicon">口</div>
						<div class="chrome-tab-title">{{ tab.label }}</div>
						<div class="chrome-tab-drag-handle"></div>
						<div class="chrome-tab-close"></div>
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

const contentRef = ref(null);

nextTick(() => {});

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
	tab._instance.setPosition(240 * i, 0);
}

function setTabRef(el: tabType, tab: Tab) {
	if (el) {
		tab._el = el;
	}
}

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
});
</script>

<style scoped>
@import './chrome-tabs.css';
.vue3-chrome-tabs {
	--container-background-color: #dee1e6;

	--tab-width: 240px;
	--tab-content-margin: 9px;
	--tab-background-color: #fff;
	--tab-text-color: #5f6368;
	--tab-text-color-active: #45474a;
}
</style>
