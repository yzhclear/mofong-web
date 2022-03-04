import { VueWrapper, shallowMount } from '@vue/test-utils';
import Uploader from '@/components/Uploader.vue';
import flushPromises from 'flush-promises';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const testFile = new File(['xyz'], 'test.png', { type: 'image/png' });

let wrapper: VueWrapper<any>;

describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: 'https://jsonplaceholder.typicode.com/posts',
      },
    });
  });

  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy();
    expect(wrapper.get('button span').text()).toBe('点击上传');
    expect(wrapper.get('input').isVisible()).toBeFalsy();
  });

  it('upload process should work fine', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 'success' });
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    const files = [testFile] as any;
    Object.defineProperty(fileInput, 'files', {
      value: files,
      writable: false,
    });
    await wrapper.find('input').trigger('change');
    console.log(wrapper.html());
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.get('button span').text()).toBe('正在上传');
    await flushPromises();
    expect(wrapper.get('button span').text()).toBe('上传成功');
  });

  it('should return error text when post is rejected', async () => {
    mockedAxios.post.mockRejectedValueOnce({ error: 'error' });
    await wrapper.get('input').trigger('change');
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    // expect(wrapper.get('button span').text()).toBe('正在上传');
    await flushPromises();
    expect(wrapper.get('button span').text()).toBe('上传失败');
  });
});
