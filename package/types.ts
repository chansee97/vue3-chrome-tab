import { ComponentPublicInstance } from 'vue';
export interface Tab {
	/** 显示名称 */
	label: string;
	/** 唯一 key */
	key: string | number;
	/** 图标 */
	favico?: string;
	/** 是否可关闭 */
	closable?: boolean;
	/** 是否可拖拽 */
	dragable?: boolean;

	_el?: tabType;
	_instance?: any;
	_x?: number;
}

export type tabType = Element | ComponentPublicInstance | null;

export type TabsIns = {
	addTab:Function
};