<template>
  <div>
    <div v-popover:popover @contextmenu.prevent="displayContextMenu = !displayContextMenu">
      {{data.Title}} - {{data.Url}}
    </div>
    <el-popover ref="popover" placement="left" trigger="manual" v-model="displayContextMenu">
      <context-menu  :title="data.Title" :links="data.contextMenuLinks" :displayContextMenu.sync="displayContextMenu"></context-menu>
    </el-popover>

  </div>
</template>

<script>
import ContextMenu from '../ContextMenu.vue'

export default {
  name:'RootWeb',
  components:{ContextMenu},
  props:['data'],
  data(){
    return{
      displayContextMenu:false
    }
  }
}
</script>