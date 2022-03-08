import { message } from 'ant-design-vue';

interface CheckCondition {
  format: string[];
  size: number;
}

type ErrorType = 'format' | 'size' | null;

const beforeUploadCheck = (file: File, condition: CheckCondition) => {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;

  let error: ErrorType = null;
  if (!isValidFormat) {
    error = 'format';
  }
  if (!isValidSize) {
    error = 'size';
  }

  return {
    passed: isValidFormat && isValidSize,
    error,
  };
};

const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 });
  const { passed, error } = result;
  if (error === 'format') {
    message.error('上传图片只能是 JPG/PNG 格式!');
  }

  if (error === 'size') {
    message.error('上传图片大小不能超过 1Mb');
  }

  return passed;
};

export const getImageDimensions = (url: string | File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.src = typeof url === 'string' ? url : URL.createObjectURL(url);
    img.addEventListener('load', () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      resolve({ width, height });
    });
    img.addEventListener('error', () => {
      reject(new Error('there is an error on image'));
    });
  });
};

export { commonUploadCheck };
