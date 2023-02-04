<script setup lang="ts">
import { ref } from 'vue';
import { Tab } from '../package/index';

const currentKey = ref(0);

const tabsRef = ref(null);

const tabsList = ref<Tab[]>([]);

const logs = ref<string[]>([]);
function addLog(log: string) {
	logs.value.push(log);
}

tabsList.value = [
	{
		label: 'baidu',
		key: 0,
	},
	{
		label: 'alibaba',
		key: 1,
	},
];

function addTab() {
	const length = tabsList.value.length;

	if (!tabsRef.value) return;
	tabsRef.value.addTab({
		label: `new Tab ${length}`,
		key: length,
	});
	addLog('add');
}
function handleClick(e, tab, i) {
	addLog('Click' + i);
}

function handleClose(tab, i) {
	addLog('Close');
}
function handleDragStart() {
	addLog('DragStart');
}
function handleDraging() {
	console.log('Draging');
}
function handleDragEnd() {
	addLog('DragEnd');
}
</script>

<template>
	<div>
		<Vue3ChromeTabs
			ref="tabsRef"
			v-model="currentKey"
			:tabs="tabsList"
			@click="handleClick"
			@close="handleClose"
			@dragstart="handleDragStart"
			@draging="handleDraging"
			@dragend="handleDragEnd"></Vue3ChromeTabs>
		<h1>vue3-chrome-tabs</h1>
		<div class="mock-options">
			<button @click="addTab">add new tab</button>
			<button>remove active tab</button>
			<button>remove inactive tab</button>
			<button>toggle tabs theme</button>
		</div>
		<div>
			<ul>
				<button @click="logs = []">clear</button>
				<li v-for="(item, i) in logs" :key="i">{{ item }}</li>
			</ul>
		</div>
	</div>
</template>

<style lang="less">
body {
	margin: 0;
}
.mock-options {
	height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 50px;
	> button {
		min-width: 100px;
		width: fit-content;
		height: 40px;
		border-radius: 20px;
		outline: unset;
		border: 1px solid #ccc;
		padding: 0 15px;
		&:hover {
			background-color: #ddd;
		}
		&:active {
			outline: 2px solid #111;
		}
	}
}
</style>
