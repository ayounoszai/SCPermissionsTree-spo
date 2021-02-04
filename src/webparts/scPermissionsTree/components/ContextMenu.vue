<template>
  <div class='popper'>
      <div>
        <span style='float:right;margin-right:-5px;margin-top:-15px'>
          <el-button type='text' @click="$emit('update:displayContextMenu', false);">
            <i class="el-icon-close"></i>
          </el-button>
        </span>
        <strong>{{title}}</strong>
        
      </div>
       <el-divider class='divider'></el-divider>
      <div v-for="link in links" :key="link.url" class='popper'>
        <el-link  target="_blank" :href="link.url" :underline="false" data-interception="off">{{link.title}}</el-link>
      </div>      
  </div>
</template>

<script>
export default {
  name:'ContextMenu',
  props:['title','links','displayContextMenu'],
}
</script>

<style scoped>
.popper {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.divider{
  margin-top: 10px;
  margin-bottom:10px
}
</style>