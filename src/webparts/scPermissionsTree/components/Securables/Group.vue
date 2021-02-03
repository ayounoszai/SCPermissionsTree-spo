<template>
  <div>
    <div v-popover:popover @contextmenu.prevent="displayContextMenu = !displayContextMenu">
      <!-- <i class='fas' :class="icon.icon" :style="icon.style" :alt="icon.text"></i> -->
      <span>{{data.Title}} ({{userCount}} {{userCount === 1 ? "user" : "users"}})</span>
    </div>

    <el-popover ref="popover" placement="left" trigger="manual" v-model="displayContextMenu">
      <context-menu  :title="data.Title" :links="data.contextMenuLinks" :displayContextMenu.sync="displayContextMenu"></context-menu>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ContextMenu from '../ContextMenu.vue'

export default {
  name:'Group',
  props:['data'],
  components:{ContextMenu},
  data(){
    return{
      displayContextMenu:false
    }
  },
  computed:{
    ...mapGetters(['getIcon']),
    icon(){
      if(this.data.PrincipalType == 1){
        return this.getIcon('sp-user')
      }
      else if(this.data.PrincipalType === 4){
        return this.getIcon('ad-group')
      }
      else if(this.data.PrincipalType == 8){
        return this.getIcon('sp-group')
      }
      else{
        return this.getIcon('')
      }
    },
    userCount(){
      return this.data.Users.results.length
    }
  }
}
</script>