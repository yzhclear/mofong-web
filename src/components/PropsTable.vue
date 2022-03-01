<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="props-item">
      <span class="label" v-if="value.text">{{ value.text }}</span>
      <div class="prop-component">
        <component :is="value.component" :[value.valueProp]="value.value" v-bind="value.extraProps" v-on="value.events">
          <template v-if="value.options">
            <component :is="value.subComponent" v-for="(option, k) in value.options" :key="k" :value="option.value">
              <render-vnode :vNode="option.text"></render-vnode>
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { VNode } from 'vue';
import { reduce } from 'lodash';
import { computed, defineComponent, PropType } from 'vue';
import { TextComponentProps } from '../defaultProps';
import { mapPropsToForms } from '../propsMap';
import RenderVnode from './RenderVnode';

interface FormProps {
  component: string; // 渲染的组件名称
  subComponent?: string; // 渲染组件的子组件
  value: string; // 渲染的组件默认值
  extraProps?: { [key: string]: any }; // 一些组件的配置项属性
  text?: string; // 渲染的组件的说明文本
  options?: { text: string | VNode; value: string }[];
  initialTransform?: (v: any) => any;
  valueProp: string;
  eventName: string;
  events: { [key: string]: (e: any) => void };
}

export default defineComponent({
  name: 'props-table',
  components: { RenderVnode },
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps;
          const item = mapPropsToForms[newKey];
          if (item) {
            const { valueProp = 'value', eventName = 'change', initialTransform, afterTransform } = item;
            const newItem: FormProps = {
              ...item,
              value: initialTransform ? initialTransform(value) : value,
              valueProp,
              eventName,
              events: { [eventName]: (e: any) => context.emit('change', { key, value: afterTransform ? afterTransform(e) : e }) },
            };
            result[newKey] = newItem;
          }
          return result;
        },
        {} as { [key: string]: FormProps },
      );
    });
    return {
      finalProps,
    };
  },
});
</script>

<style scoped>
.props-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  width: 28%;
}
.prop-component {
  width: 70%;
}
</style>
