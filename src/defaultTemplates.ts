import { textDefaultProps, imageDefaultProps, shapeDefaultProps } from './defaultProps';
const defaultTextTemplates = [
  {
    text: '大标题',
    fontSize: '30px',
    fontWeight: 'bold',
    tag: 'h2',
  },
  {
    text: '正文内容',
    tag: 'p',
  },
  {
    text: '链接内容',
    color: '#1890ff',
    textDecoration: 'underline',
    tag: 'p',
  },
  {
    text: '按钮内容',
    color: '#fff',
    backgroundColor: '#1890ff',
    borderWidth: '1px',
    borderColor: '#1890ff',
    borderStyle: 'solid',
    borderRadius: '2px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    width: '100px',
    tag: 'button',
    texAlign: 'center',
  },
];

export interface CreateComponentType {
  name: string;
  text?: string;
  type?: string;
  props: { [key: string]: string };
}

// text list
const textPropsList = [
  {
    text: '大标题',
    fontSize: '30px',
    fontWeight: 'bold',
    tag: 'h2',
  },
  {
    text: '楷体副标题',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: '"KaiTi","STKaiti"',
    tag: 'h2',
  },
  {
    text: '正文内容',
    tag: 'p',
  },
  {
    text: '宋体正文内容',
    tag: 'p',
    fontFamily: '"SimSun","STSong"',
  },
  {
    text: 'Arial style',
    tag: 'p',
    fontFamily: '"Arial", sans-serif',
  },
  {
    text: 'Comic Sans',
    tag: 'p',
    fontFamily: '"Comic Sans MS"',
  },
  {
    text: 'Courier New',
    tag: 'p',
    fontFamily: '"Courier New", monospace',
  },
  {
    text: 'Times New Roman',
    tag: 'p',
    fontFamily: '"Times New Roman", serif',
  },
  {
    text: '链接内容',
    color: '#1890ff',
    textDecoration: 'underline',
    tag: 'p',
  },
  {
    text: '按钮内容',
    color: '#ffffff',
    backgroundColor: '#1890ff',
    borderWidth: '1px',
    borderColor: '#1890ff',
    borderStyle: 'solid',
    borderRadius: '2px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    width: '100px',
    tag: 'button',
    textAlign: 'center',
  },
];
export const textList: CreateComponentType[] = textPropsList.map((prop) => {
  return {
    name: 'm-text',
    props: {
      ...textDefaultProps,
      ...(prop as any),
    },
  };
});

// image list
const imgSourceList = [
  'http://static-dev.mofong.cc/upload-files/default-image-template-0001.png',
  'http://static-dev.mofong.cc/upload-files/default-image-template-0002.png',
  'http://static-dev.mofong.cc/upload-files/default-image-template-0003.png',
  'http://static-dev.mofong.cc/upload-files/default-image-template-0004.png',
  'http://static-dev.mofong.cc/upload-files/default-image-template-0005.png',
  'http://static-dev.mofong.cc/upload-files/default-image-template-0006.png',
  'http://static-dev.mofong.cc/upload-files/default-image-template-0007.png',
  'http://static-dev.mofong.cc/upload-files/default-image-template-0008.png',
];
export const imageList: CreateComponentType[] = imgSourceList.map((url) => {
  return {
    name: 'm-image',
    props: {
      ...imageDefaultProps,
      imgSrc: url,
      width: '150px',
    },
  };
});

// shape list
const shapePropsList = [
  {
    backgroundColor: '#efefef',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    width: '100px',
    height: '50px',
  },
  {
    backgroundColor: '#efefef',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: '100px',
    width: '100px',
    height: '100px',
  },
  {
    backgroundColor: '#efefef',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    width: '100px',
    height: '100px',
  },
  {
    backgroundColor: '#36cfc9',
    width: '100px',
    height: '50px',
  },
  {
    backgroundColor: '#40a9ff',
    borderRadius: '100px',
    width: '100px',
    height: '100px',
  },
  {
    backgroundColor: '#9254de',
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    width: '100px',
    height: '100px',
  },
];
export const shapeList: CreateComponentType[] = shapePropsList.map((prop) => {
  return {
    name: 'm-shape',
    props: {
      ...shapeDefaultProps,
      ...(prop as any),
    },
  };
});

export const generateResetCss = (name: string) => {
  return {
    position: 'static',
    ...(name !== 'm-shape' && { height: '' }),
  };
};

export default defaultTextTemplates.map((template) => ({ ...textDefaultProps, ...template }));
