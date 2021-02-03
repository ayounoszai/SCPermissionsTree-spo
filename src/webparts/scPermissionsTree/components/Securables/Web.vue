<template>
  <div>
    <div v-popover:popover @contextmenu.prevent="displayContextMenu = !displayContextMenu">
      <template v-if="data.HasUniqueRoleAssignments">
        <el-tooltip class="item" effect="dark" content="Subsite has unique permissions" placement="top-start">
          <font-awesome-icon :icon="getIcon('broken-inheritance').icon" :style="getIcon('broken-inheritance').style" alt="Subsite has unique permissions"/>
        </el-tooltip>
      </template>
      <span>{{data.Title}} ({{data.Url}})</span>
    </div>
    <el-popover ref="popover" placement="left" trigger="manual" v-model="displayContextMenu">
      <context-menu  :title="data.Title" :links="data.contextMenuLinks" :displayContextMenu.sync="displayContextMenu"></context-menu>
    </el-popover>
  </div>
</template>

<script>
import ContextMenu from '../ContextMenu.vue'
import { mapGetters } from 'vuex'

export default {
  name:'Web',
  props:['data'],
  components:{ContextMenu},
  data(){
    return{
      displayContextMenu:false
    }
  },
  computed:{
    ...mapGetters(['getIcon'])
  }
}
</script>