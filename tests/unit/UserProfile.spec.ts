import { mount, VueWrapper } from '@vue/test-utils';
import { message } from 'ant-design-vue';
import store from '@/store/index';
import UserProfile from '@/components/UserProfile.vue';

let wrapper: VueWrapper<any>;
jest.mock('ant-design-vue', () => ({
  message: {
    success: jest.fn(),
  },
}));

// jest.mock('vuex');

const mockRoutes: string[] = [];
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: (url: string) => mockRoutes.push(url),
  }),
}));

const mockComponent = {
  template: '<div><slot></slot></div>',
};
const mockComponent2 = {
  template: '<div><slot></slot><slot name="overlay"></slot></div>',
};
const globalComponents = {
  'a-button': mockComponent,
  'a-dropdown-button': mockComponent2,
  'router-link': mockComponent,
  'a-menu': mockComponent,
  'a-menu-item': mockComponent,
};

describe('UserProfile component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    wrapper = mount(UserProfile, {
      props: {
        user: {
          isLogin: false,
        },
      },
      global: {
        components: globalComponents,
        provide: {
          store,
        },
      },
    });
  });
  it('should render login button when login is false', async () => {
    expect(wrapper.get('div').text()).toBe('登录');
    await wrapper.get('div').trigger('click');
    expect(message.success).toHaveBeenCalled();
    expect(store.state.user.userName).toBe('yzh');
  });

  it('should render username when login is true', async () => {
    await wrapper.setProps({
      user: {
        isLogin: true,
        userName: 'yzh',
      },
    });
    expect(wrapper.get('.user-profile-component').html()).toContain('yzh');
    expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy();
  });

  it('should call logout and show message call router push after setTimeout', async () => {
    await wrapper.get('.user-profile-dropdown').trigger('click');
    expect(store.state.user.isLogin).toBeFalsy();
    expect(message.success).toHaveBeenCalledTimes(1);

    // 测试 setTimeout
    jest.runAllTimers();
    expect(mockRoutes).toEqual(['/']);
  });

  afterEach(() => {
    (message as jest.Mocked<typeof message>).success.mockReset();
  });
});
