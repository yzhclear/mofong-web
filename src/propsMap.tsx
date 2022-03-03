import { TextComponentProps } from './defaultProps';
import { VNode, h } from 'vue';

export interface PropToForm {
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

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm;
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

export const mapPropsToForms: PropsToForms = {
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
};
