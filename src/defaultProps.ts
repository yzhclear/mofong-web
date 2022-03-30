import { mapValues, without } from 'lodash-es';

export interface CommonComponentProps {
  // actions
  actionType: string;
  url: string;
  // size
  height: string;
  width: string;
  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  paddingBottom: string;
  // border type
  borderStyle: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  // shadow and opacity
  boxShadow: string;
  opacity: string;
  // position x,y
  position: string;
  left: string;
  top: string;
  right: string;
}

export const commonDefaultProps: CommonComponentProps = {
  // actions
  actionType: '',
  url: '',
  // size
  height: '',
  width: '',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',
  // shadow and opacity
  boxShadow: '0 0 0 #000',
  opacity: '1',
  // position x,y
  position: 'absolute',
  left: '0',
  top: '0',
  right: '0',
};

export interface TextComponentProps extends CommonComponentProps {
  // basic props - font styles
  text: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: string;
  textAlign: string;
  color: string;
  backgroundColor: string;
}

export interface ImageComponentProps extends CommonComponentProps {
  imgSrc: string;
}

export const textDefaultProps: TextComponentProps = {
  text: '正文内容',
  fontSize: '15px',
  fontFamily: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'left',
  color: '#000',
  backgroundColor: '',
  ...commonDefaultProps,
};

export const imageDefaultProps: ImageComponentProps = {
  imgSrc: 'test.url',
  ...commonDefaultProps,
};

export const textStyleProps = without(Object.keys(textDefaultProps), 'text', 'actionType', 'url');
export const imageStyleProps = without(Object.keys(imageDefaultProps), 'src');

export const transformToComponentProps = (props: { [key: string]: any }) => {
  return mapValues(props, (item) => {
    return {
      type: item.constructor as StringConstructor,
      default: item,
    };
  }) as { [key: string]: any };
};
