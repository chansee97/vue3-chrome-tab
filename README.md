# Vue3-Chrome-Tab

仿Chrome风格标签栏组件
## Demo

[overview](www.baidu.com)


## 使用方法/示例

### 插件用法

```javascript
...main.ts

import chromeTabs from 'Vue3ChromeTabs';

app.use(chromeTabs);
```

### 组件引用用法

```javascript
...xx.vue

import { Tab, TabsIns } from 'Vue3ChromeTabs';

<Vue3ChromeTabs	ref="tabsRef" v-model="currentKey" :tabs="tabsList"></Vue3ChromeTabs>
```
## API 参考

#### 导出类型

| 参数 | 描述                |
| :--------  |:------------------------- |
| `Tab`  | 单标签类型 |
| `TabsIns` | 组件实例类型 |


#### 实例属性

| 参数 | 类型     | 描述                |
| :-------- | :-------  |:------------------------- |
| `v-model` | `string`  | 当前激活标签key |
| `tabs` | `Tab[]`  | 绑定标签组数据 |
| `minWidth` | `number`  | 标签最小宽度 |
| `maxWidth` | `number`  | 标签最大宽度 |

#### 实例事件

| 参数 | 类型     | 描述                |
| :-------- | :-------  |:------------------------- |
| `click` | `(e: Event, tab: Tab, i: number)：void`  | 点击回调事件 |
| `contextmenu` | `(e: Event, tab: Tab, i: number)：void`  | 右击事件 |
| `dragstart` | `(e: Event, tab: Tab, i: number)：void`  | 拖拽开始事件 |
| `draging` | `(e: Event, tab: Tab, i: number)：void`  | 拖拽中事件 |
| `dragend` | `(e: Event, tab: Tab, i: number)：void`  | 拖拽结束事件 |
| `close` | `(tab: Tab, i: number)：void`  | 标签关闭事件 |

#### 实例方法

| 参数 | 参数     | 描述                |
| :-------- | :-------  |:------------------------- |
| `addTab` | `Tab`  | 新增标签 |

#### Tab支持属性

| 参数 | 类型     | 描述                       |
| :-------- | :------- | :-------------------------------- |
| `label`      | `string` | **必选** 标签名称 |
| `key`      | `string` `number`| **必选** 绑定key |
| `favico`      | `string` | 图标名称 |
| `closable`      | `boolean` | 是否可关闭 |
| `dragable`      | `boolean` | 是否可拖动 |

## 配色修改


| 变量 | 描述                |
| :--------  |:------------------------- |
| `--container-background-color`  | 容器背景色 |
| `--tab-content-margin` | 标签左右边距 |
| `--tab-background-color` | 标签背景色 |
| `--tab-background-color-active` | 标签触摸聚焦背景色 |
| `--tab-text-color` | 标签文本色 |
| `--tab-text-color-active` | 标签文本激活色 |
| `--tab-close-color` | 关闭图标颜色 |
| `--tab-close-background-color` | 关闭图标背景色 |
| `--tab-close-background-color-active` | 关闭图标背景激活色 |