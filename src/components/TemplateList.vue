<template>
  <div class="template-list-component">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in list" :key="item.id" class="poster-item">
        <router-link :to="{ name: 'template', params: { id: item.id } }">
          <a-card hoverable>
            <template v-slot:cover>
              <img :src="item.coverImg" />
              <div class="hover-item">
                <a-button size="large" type="primary">使用该模版创建</a-button>
              </div>
            </template>
            <a-card-meta :title="item.title">
              <template v-slot:description>
                <div class="description-detail">
                  <span>作者:{{ item.author }}</span>
                  <span class="user-number">{{ item.copiedCount }}</span>
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TemplateProps } from '../store/templates';

export default defineComponent({
  name: 'TemplateList',
  props: {
    list: {
      type: Array as PropType<TemplateProps[]>,
      required: true,
    },
    type: {
      type: String,
      default: 'work',
    },
  },
});
</script>

<style scoped>
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.poster-item .ant-card {
  border-radius: 12px;
}
.poster-item .ant-card-cover {
  position: relative;
  overflow: hidden;
  height: 390px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.poster-item .ant-card-cover img {
  transition: all 0.2s ease-in;
}
.poster-item .ant-card-cover > img {
  width: 100%;
}
.poster-item .ant-card-hoverable {
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
}
.hover-item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: none;
  background: rgba(0, 0, 0, 0.8);
  align-items: center;
  justify-content: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
</style>
