<template>
  <div class="template-list-component">
    <a-modal title="转赠作品" v-model:visible="sendModal" :footer="null">
      <a-form :model="form" :rules="rules" ref="publishForm" layout="vertical">
        <a-form-item label="用户名" required name="username">
          <a-input v-model:value="form.username" placeholder="填写要转赠人的用户名">
            <template v-slot:prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="sendGift" size="large" :loading="loading">
            {{ loading ? '加载中' : '转赠该作品' }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-skeleton v-if="loading" />
    <a-row :gutter="16" v-else>
      <a-col :span="6" v-for="item in listWithBarcode" :key="item.id" class="poster-item">
        <a-card hoverable @mouseenter="() => showBarcode(item.id, item.barcodeUrl)">
          <template v-slot:cover>
            <img :src="item.coverImg" v-if="item.coverImg" />
            <img src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png" v-else />
            <div class="hover-item">
              <canvas :id="`barcode-${item.id}`" class="barcode-container" v-if="item.status === '2'"></canvas>
              <router-link :to="`/editor/${item.id}`" v-else><a-button size="large" type="primary">继续编辑该作品</a-button></router-link>
            </div>
          </template>
          <template class="ant-card-actions" v-slot:actions>
            <router-link :to="`/editor/${item.id}`"><EditOutlined key="edit" /></router-link>
            <a href="javascript:;" @click.prevent="staticClicked(item.id)" v-if="item.status === '2'"><BarChartOutlined key="chart" /></a>
            <a-dropdown>
              <EllipsisOutlined key="ellipsis" />
              <template v-slot:overlay>
                <a-menu class="overlay-dropdown">
                  <a-menu-item>
                    <a href="javascript:;" @click.prevent="copyClicked(item.id)"><CopyOutlined /> 复制</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click.prevent="deleteClicked(item.id)"><DeleteOutlined /> 删除</a>
                  </a-menu-item>
                  <a-menu-item v-if="item.coverImg">
                    <a href="javascript:;" @click.prevent="saveImage(item.coverImg)"><DownloadOutlined /> 下载图片</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click.prevent="sendClicked(item.id)"><GiftOutlined /> 转赠</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <a-card-meta :title="item.title"> </a-card-meta>
        </a-card>
        <div class="tag-list">
          <a-tag color="red" v-if="item.status === '1'"> 未发布 </a-tag>
          <a-tag color="green" v-else> 已发布 </a-tag>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, nextTick, reactive, Ref, watch } from 'vue';
import { EditOutlined, BarChartOutlined, EllipsisOutlined, CopyOutlined, DeleteOutlined, GiftOutlined, UserOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { WorkProp } from '../store/works';
import { Modal } from 'ant-design-vue';
import { baseH5URL } from '../main';
import { downloadImage, generateQRCode } from '../helper';

export interface RuleFormInstance {
  validate: () => Promise<any>;
}

export default defineComponent({
  name: 'works-list',
  emits: ['on-copy', 'on-delete', 'on-static', 'on-send'],
  components: {
    EditOutlined,
    BarChartOutlined,
    EllipsisOutlined,
    CopyOutlined,
    DeleteOutlined,
    GiftOutlined,
    UserOutlined,
    DownloadOutlined,
  },
  props: {
    list: {
      type: Array as PropType<WorkProp[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    transferStatus: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const container = ref<null | HTMLElement>(null);
    const sendModal = ref(false);
    const currentItem = ref(0);
    const listWithBarcode = computed(() => {
      return props.list.map((item) => {
        item.barcodeUrl = `${baseH5URL}/p/${item.id}-${item.uuid}`;
        return item;
      });
    });
    watch(
      () => props.transferStatus,
      () => {
        if (props.transferStatus) {
          sendModal.value = false;
        }
      },
    );

    // ---- 二维码展示 ----
    const showBarcode = (id: number, url?: string) => {
      nextTick(() => {
        const container = document.getElementById(`barcode-${id}`);
        if (container && url && !container.hasChildNodes()) {
          generateQRCode(`barcode-${id}`, url);
        }
      });
    };

    const deleteClicked = (id: number) => {
      Modal.confirm({
        title: '确定要删除该作品吗？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          context.emit('on-delete', id);
        },
      });
    };
    const copyClicked = (id: number) => {
      context.emit('on-copy', id);
    };
    const staticClicked = (id: number) => {
      context.emit('on-static', id);
    };
    const saveImage = (url: string) => {
      downloadImage(url);
    };
    const sendClicked = (id: number) => {
      sendModal.value = true;
      currentItem.value = id;
    };

    // ----- 转赠作品 -------
    const publishForm = ref() as Ref<RuleFormInstance>;
    const form = reactive({
      username: '',
    });
    const rules = {
      username: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
    };
    const sendGift = () => {
      publishForm.value.validate().then(() => {
        context.emit('on-send', { id: currentItem.value, username: form.username });
      });
    };
    return {
      listWithBarcode,
      container,
      sendModal,
      publishForm,
      rules,
      form,
      staticClicked,
      sendClicked,
      showBarcode,
      deleteClicked,
      copyClicked,
      sendGift,
      saveImage,
    };
  },
});
</script>

<style>
.template-list-component {
  min-height: 505px;
}
.barcode-container {
  width: 80px;
  height: 80px;
}
.overlay-dropdown {
  border-radius: 2px !important;
}
</style>
