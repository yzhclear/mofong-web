<template>
  <div class="file-upload">
    <div class="upload-area" :class="{ 'is-dragover': drag && isDragOver }" v-on="events">
      <slot v-if="isUploading" name="loading">
        <button :disabled="isUploading">正在上传</button>
      </slot>
      <slot name="uploaded" v-else-if="lastFileData && lastFileData.loaded" :uploadedData="lastFileData.data">
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input ref="fileInput" type="file" :style="{ display: 'none' }" @change="handleChange" />
    <div v-if="showUploadList">
      <ul>
        <li v-for="file in filesList" :key="file.uid" :class="`uploaded-file upload-${file.status}`">
          <img v-if="file.url && listType === 'picture'" :src="file.url" :alt="file.name" />
          <span v-if="file.status === 'loading'" class="file-icon"><LoadingOutlined /></span>
          <span v-else class="file-icon"><FileOutlined /></span>
          <span class="filename">{{ file.name }}</span>
          <button class="delete-icon" @click="removeFile(file.uid)"><DeleteOutlined /></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from 'vue';
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { last } from 'lodash-es';

type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
type CheckFunction = (file: File) => boolean | Promise<File>;
type FileListType = 'picture' | 'text';

interface UploadFile {
  uid: string;
  name: string;
  size: number;
  status: UploadStatus;
  raw: File;
  resp?: any;
  url?: string;
}

export default defineComponent({
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined,
  },
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>,
    },
    drag: {
      type: Boolean,
      default: false,
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String as PropType<FileListType>,
      default: 'picture',
    },
    showUploadList: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['success'],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const filesList = ref<UploadFile[]>([]);
    const isDragOver = ref(false);
    const isUploading = computed(() => filesList.value.some((file) => file.status === 'loading'));
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    let events: { [key: string]: (e: any) => void } = {
      click: triggerUpload,
    };

    const lastFileData = computed(() => {
      const lastFile = last(filesList.value);
      if (lastFile) {
        return {
          loaded: lastFile?.status === 'success',
          data: lastFile?.resp,
        };
      }
      return false;
    });

    const beforeUploadCheck = (files: null | FileList) => {
      if (files) {
        const uploadFile = files[0];
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadFile);
          if (result && result instanceof Promise) {
            result
              .then((res) => {
                if (res instanceof File) {
                  addFileToList(res);
                } else {
                  throw new Error('beforeUpload should return File Object');
                }
              })
              .catch((err) => {
                console.error(err);
              });
          } else if (result) {
            addFileToList(uploadFile);
          }
        } else {
          addFileToList(uploadFile);
        }
      }
    };
    const addFileToList = (file: File) => {
      const fileObj: UploadFile = reactive({
        uid: uuidv4(),
        name: file.name,
        size: file.size,
        status: 'ready',
        raw: file,
      });

      if (props.listType === 'picture') {
        // try {
        //   fileObj.url = URL.createObjectURL(file);
        // } catch (error) {
        //   console.error('upload File error', error);
        // }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener('load', () => {
          fileObj.url = fileReader.result as string;
        });
      }

      filesList.value.push(fileObj);
      if (props.autoUpload) {
        postFile(fileObj);
      }
    };
    const postFile = (readyFile: UploadFile) => {
      const formData = new FormData();
      formData.append(readyFile.name, readyFile.raw);
      readyFile.status = 'loading';
      axios
        .post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          readyFile.status = 'success';
          readyFile.resp = res.data;
          context.emit('success', res.data);
        })
        .catch((err) => {
          readyFile.status = 'error';
        })
        .finally(() => {
          if (fileInput.value) {
            fileInput.value.value = '';
          }
        });
    };
    const removeFile = (id: string) => {
      filesList.value = filesList.value.filter((file) => file.uid !== id);
    };
    const uploadFiles = () => {
      filesList.value.filter((file) => file.status === 'ready').forEach((readyFile) => postFile(readyFile));
    };

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      beforeUploadCheck(target.files);
    };
    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault();
      isDragOver.value = over;
    };
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      isDragOver.value = false;
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files);
      }
    };
    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => {
          handleDrag(e, true);
        },
        dragleave: (e: DragEvent) => {
          handleDrag(e, false);
        },
        drop: handleDragOver,
      };
    }
    return {
      fileInput,
      isUploading,
      filesList,
      lastFileData,
      isDragOver,
      events,
      handleChange,
      removeFile,
      uploadFiles,
    };
  },
});
</script>
<style scoped>
.page-tile {
  color: #fff;
}
.file-upload .upload-area {
  background: #efefef;
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  padding: 20px;
  text-align: center;
}

.file-upload .upload-area:hover {
  border: 1px dashed #1890ff;
}
.file-upload .upload-area.is-dragover {
  border: 2px dashed #1890ff;
  background: #1890ff;
}
.file-upload .uploaded-file img {
  width: 200px;
  height: 200px;
}
</style>
