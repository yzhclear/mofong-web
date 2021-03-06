import { mount, VueWrapper } from '@vue/test-utils';
import ColorPicker from '@/components/ColorPicker.vue';
const defaultColors = ['#ffffff', '#f5222d', '#fa541c', '#fadb14', '#52c41af', '#1890ff', '#722ed1', '#8c8c8c', '#000000', ''];
let wrapper: VueWrapper<any>;
describe('ColorPicker component', () => {
  beforeAll(() => {
    wrapper = mount(ColorPicker, {
      props: {
        value: '#ffffff',
      },
    });
  });

  it('should render the correct interface', () => {
    // <div><input /> </div>
    // <ul class="picked-color-list">
    // <li class="item-0" or class="transparent-back">
    // <div></div>
    // </li></ul>

    // 测试左侧是否为 input, 类型和值是否正确
    expect(wrapper.find('input').exists()).toBeTruthy();
    const input = wrapper.get('input').element;
    expect(input.type).toBe('color');
    expect(input.value).toBe('#ffffff');
    // 测试右侧是否有颜色的列表
    expect(wrapper.findAll('li').length).toBe(defaultColors.length);
    // 检查一个元素的 css backgroundColor属性是否相等对应的颜色
    const firstItem = wrapper.get('li:first-child div').element as HTMLElement;
    expect(firstItem.style.backgroundColor).toBe(defaultColors[0]);
    // 测试最后一个元素是否有特殊的类名
    const lastItem = wrapper.get('li:last-child div').element as HTMLElement;
    expect(lastItem.classList.contains('transparent-back')).toBeTruthy();
  });

  it.only('should send correct event when input change', async () => {
    // 测试 input 修改以后, 是否发送对应的事件和对应的值
    const blackHex = '#000000';
    const input = wrapper.find('input[type="color"]');
    await input.setValue(blackHex);
    // expect(wrapper.emitted()).toHaveProperty('change');
    // const event = wrapper.emitted();
    // expect(event[0]).toEqual([blackHex]);
  });

  it('should send correct event when click the right list', () => {
    // 测试点击右侧颜色列表时, 是否发送对应的值
    const firstItem = wrapper.get('li:first-child div');
    firstItem.trigger('click');
    const events = wrapper.emitted();
    expect(events.change[1]).toEqual([defaultColors[0]]);
  });
});
