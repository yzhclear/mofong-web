import { TextComponentProps } from './defaultProps';
import { VNode, h } from 'vue';

// 1 component 确定对应是哪个 component
// 2 更改 value 的 事件名称
// 3 intialTransform 初始值的变换，有些初始值需要处理以后再传递给组件
// 4 afterTransform 触发更改以后，不同类型需要不同处理，因为 e 的值是不同的，或者需要回灌的值不同
// 5 text 属性对应的中文名称
// 6 给组件赋值的时候 属性的名称，一般是 value，也有可能是另外的，比如 checkbox 就是 checked
export interface PropDetailType {
  component: string; // 渲染的组件名称
  subComponent?: string; // 渲染组件的子组件
  extraProps?: { [key: string]: any }; // 一些组件的配置项属性
  text?: string; // 渲染的组件的说明文本
  options?: { text: string | VNode; value: string }[];
  initialTransform?: (v: any) => any;
  afterTransform?: (v: any) => any;
  valueProp?: string;
  eventName?: string;
}

export type MapTypes = {
  [key: string]: PropDetailType;
};

const defaultMap = {
  component: 'a-input',
  eventName: 'change',
  valueProp: 'value',
  intialTransform: (v: any) => v,
  afterTransform: (e: any) => e,
};

const fontFamily = [
  { text: '宋体', value: '"SimSun", "STSong"' },
  { text: '黑体', value: '"SimHei", "STHeiti"' },
  { text: '楷体', value: '"KaiTi", "STKaiti"' },
  { text: '仿宋', value: '"FangSong", "STFangsong"' },
];

const fontFamilyOptions = fontFamily.map((font) => {
  return {
    value: font.value,
    // text: h('span', { style: { fontFamily: font.value } }, font.text),
    text: <span style={{ fontFamily: font.value }}>{font.text}</span>,
  };
});

export const mapPropsToForms: MapTypes = {
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: { rows: 3 },
    afterTransform: (e: any) => e.target.value,
  },
  color: {
    text: '字体颜色',
    component: 'color-picker',
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number',
    initialTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : ''),
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: { min: 0, max: 3, step: 0.1 },
    initialTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString(),
  },
  textAlign: {
    text: '对齐',
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    options: [
      { text: '左', value: 'left' },
      { text: '中', value: 'center' },
      { text: '右', value: 'right' },
    ],
    afterTransform: (e: any) => e.target.value,
  },
  fontFamily: {
    text: '字体',
    component: 'a-select',
    subComponent: 'a-select-option',
    options: [{ text: '无', value: '' }, ...fontFamilyOptions],
  },
  fontWeight: {
    component: 'icon-switch',
    initialTransform: (v: string) => v === 'bold',
    afterTransform: (e: boolean) => (e ? 'bold' : 'normal'),
    valueProp: 'checked',
    extraProps: { iconName: 'BoldOutlined', tip: '加粗' },
  },
  fontStyle: {
    component: 'icon-switch',
    initialTransform: (v: string) => v === 'italic',
    afterTransform: (e: boolean) => (e ? 'italic' : 'normal'),
    valueProp: 'checked',
    extraProps: { iconName: 'ItalicOutlined', tip: '斜体' },
  },
  textDecoration: {
    component: 'icon-switch',
    initialTransform: (v: string) => v === 'underline',
    afterTransform: (e: boolean) => (e ? 'underline' : 'none'),
    valueProp: 'checked',
    extraProps: { iconName: 'UnderlineOutlined', tip: '下划线' },
  },
  imgSrc: {
    ...defaultMap,
    component: 'image-processer',
  },
};
