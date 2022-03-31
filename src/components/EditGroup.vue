<template>
  <a-collapse v-model:activeKey="currentKey">
    <a-collapse-panel v-for="(item, index) in editGroups" :key="`item-${index}`" :header="item.text">
      <prop-table :props="item.props" @change="handleChange"></prop-table>
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts">
import { difference } from 'lodash';
import { computed, defineComponent, PropType, ref } from 'vue';
import PropTable from '../components/PropsTable.vue';

interface GroupProps {
  text: string;
  items: string[];
}

const defaultEditGroups: GroupProps[] = [
  {
    text: '尺寸',
    items: ['height', 'width', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'],
  },
  {
    text: '边框',
    items: ['borderStyle', 'borderColor', 'borderWidth', 'borderRadius'],
  },
  {
    text: '阴影与透明度',
    items: ['opacity', 'boxShadow'],
  },
  {
    text: '位置',
    items: ['left', 'top'],
  },
  {
    text: '事件功能',
    items: ['actionType', 'url'],
  },
];

export default defineComponent({
  props: {
    props: {
      type: Object,
      required: true,
    },
    groups: {
      type: Array as PropType<GroupProps[]>,
      default: defaultEditGroups,
    },
  },
  components: { PropTable },
  emits: ['change'],
  setup(props, context) {
    const currentKey = ref('item-0');
    const newGroups = computed(() => {
      const allNormalProps = props.groups.reduce((prev, current) => {
        return [...prev, ...current.items];
      }, [] as string[]);

      // tag 不能编辑，把它过滤掉
      allNormalProps.push('tag');
      allNormalProps.push('right');
      allNormalProps.push('position');

      const specialProps = difference(Object.keys(props.props), allNormalProps);
      // 计算每一个组件的独特属性，也就是把通用属性都去掉以后的属性
      return [{ text: '基本属性', items: specialProps }, ...props.groups];
    });

    const editGroups = computed(() => {
      return newGroups.value.map((group) => {
        let propsMap = {} as { [key: string]: any };
        group.items.forEach((item) => {
          propsMap[item] = props.props[item];
        });
        return {
          ...group,
          props: propsMap,
        };
      });
    });

    const handleChange = (e: any) => {
      context.emit('change', e);
    };

    return {
      currentKey,
      editGroups,
      handleChange,
    };
  },
});
</script>
