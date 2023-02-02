<script setup lang="ts">
import { ref } from 'vue';
import { Tab } from '../package/index';

const currentKey = ref(0);

const tabsList = ref<Tab[]>([]);

tabsList.value = [
	{
		label: 'baidu',
		key: 0,
	},
	{
		label: 'baidu',
		key: 1,
	},
];

function addTab() {
	const length = tabsList.value.length;

	tabsList.value.push({
		label: 'new Tab',
		key: length,
	});
}
</script>

<template>
	<div>
		<Vue3ChromeTabs v-model="currentKey" :tabs="tabsList"></Vue3ChromeTabs>

		<div class="mock-options">
			<button @click="addTab">add new tab</button>
			<button>remove active tab</button>
			<button>remove inactive tab</button>
			<button>toggle tabs theme</button>
		</div>
	</div>
</template>

<style scoped>
.mock-options {
	height: 400px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 50px;
}
.mock-options > button {
	min-width: 100px;
	width: fit-content;
	height: 40px;
	border-radius: 20px;
	outline: unset;
	border: 1px solid #ccc;
	padding: 0 15px;
}
.mock-options > button:hover {
	background-color: #ddd;
}
.mock-options > button:active {
	outline: 2px solid #111;
}
</style>
