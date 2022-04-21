import { message } from 'ant-design-vue';
import axios from 'axios';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import { map } from 'lodash-es';

interface CheckCondition {
  format: string[];
  size: number;
}

export interface UploadImgProps {
  data: {
    urls: string[];
  };
  errno: number;
  file: File;
}

export const objToQueryString = (queryObj: { ['string']: any }) => {
  return map(queryObj, (value: any, key: string) => `${key}=${value}`).join('&');
};

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

export const insertArr = (arr: any[], index: number, insertItem: any) => {
  return [...arr.slice(0, index), insertItem, ...arr.slice(index)];
};

export function clickInsideElement(e: Event, className: string) {
  let el = e.target as HTMLElement;
  if (el.classList.contains(className)) {
    return el;
  } else {
    while (el) {
      if (el.classList && el.classList.contains(className)) {
        return el;
      } else {
        el = el.parentNode as HTMLElement;
      }
    }
  }
  return false;
}

export function isMobile(mobile: string) {
  return /^1[3-9]\d{9}$/.test(mobile);
}

export const takeScreenshotAndUpload = (id: string) => {
  const el = document.getElementById(id) as HTMLElement;
  return html2canvas(el, { width: 375, useCORS: true, scale: 1 }).then((canvas) => {
    return new Promise<UploadImgProps>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], 'screenshot.png');
          const formData = new FormData();
          formData.append('file', newFile);

          axios
            .post('/utils/upload-img', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              timeout: 5000,
            })
            .then((res) => {
              resolve(res.data);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(new Error('blob data error'));
        }
      }, 'image/png');
    });
  });
};

export const generateQRCode = (id: string, url: string) => {
  const ele = document.getElementById(id) as HTMLCanvasElement;
  return QRCode.toCanvas(ele, url, { width: 100 });
};

export const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    try {
      navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('copy failed', error);
    }
  } else {
    const textarea = document.createElement('textarea');

    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand('copy');
    } catch (error) {
      console.warn('copy failed', error);
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

export const downloadFile = (src: string, fileName: string) => {
  const link = document.createElement('a');
  link.download = fileName;
  link.rel = 'noopener';

  // 跨域资源, 使用axios请求
  if (link.origin !== location.origin) {
    axios
      .get(src, { responseType: 'blob' })
      .then((data) => {
        link.href = URL.createObjectURL(data);
        setTimeout(() => {
          link.dispatchEvent(new MouseEvent('click'));
        });
        setTimeout(() => {
          URL.revokeObjectURL(link.href);
        }, 10000);
      })
      .catch((e) => {
        console.error(e);
        link.target = '_blank';
        link.href = src;
        link.dispatchEvent(new MouseEvent('click'));
      });
  } else {
    link.href = src;
    link.dispatchEvent(new MouseEvent('click'));
  }
};
export const downloadImage = (url: string) => {
  const fileName = url.substring(url.lastIndexOf('/') + 1);
  saveAs(url, fileName);
};

export { commonUploadCheck };
