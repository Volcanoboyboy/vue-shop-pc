<template>
  <div class="not_found">
    <img src="../../assets/404.gif" alt />
  </div>
</template>

<script>
export default {
  name: "page404",
}
</script>

<style lang="less" scoped>
.not_found {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 500px;
  }
}
</style>