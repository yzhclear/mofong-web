<template>
  <div>
    <a-button type="primary">primary</a-button>
    <h1>魔方标准模版</h1>
    <ul>
      <li>开箱即用</li>
      <li>typescript</li>
      <li>vue3</li>
      <li>支持 tsx</li>
      <li>eslint</li>
      <li>简单易用可扩展</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
