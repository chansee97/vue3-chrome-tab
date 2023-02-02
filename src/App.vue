<script setup lang="ts">
import { ref } from 'vue';
import { Tab } from '../package/index';

const currentKey = ref(0);

const tabsRef = ref(null);

const tabsList = ref<Tab[]>([]);

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
}
function handleClick(e, tab, i) {
	currentKey.value = tab.key;
}

function handleClose(tab, i) {
	console.log('🚀 ~ file: App.vue:36 ~ handleClose ~ e, tab, i', tab, i);
}
</script>

<template>
	<div>
		<Vue3ChromeTabs
			ref="tabsRef"
			v-model="currentKey"
			:tabs="tabsList"
			@click="handleClick"
			@close="handleClose"></Vue3ChromeTabs>

		<div class="mock-options">
			<button @click="addTab">add new tab</button>
			<button>remove active tab</button>
			<button>remove inactive tab</button>
			<button>toggle tabs theme</button>
		</div>
	</div>
</template>

<style scoped lang="less">
.mock-options {
	height: 400px;
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
