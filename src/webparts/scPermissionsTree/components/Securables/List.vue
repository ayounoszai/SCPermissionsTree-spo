<template>
  <div>
    <div v-popover:popover @contextmenu.prevent="displayContextMenu = !displayContextMenu">
      <template v-if="data.HasUniqueRoleAssignments">
        <el-tooltip class="item" effect="dark" content="List/Library has unique permissions" placement="top-end">
          <font-awesome-icon :icon="getIcon('broken-inheritance').icon" :style="getIcon('broken-inheritance').style"  alt="List/Library has unique permissions"/>
        </el-tooltip>
      </template>
      <template v-if="data.hasUniqueRoleAssignmentsCount > 0">
        <el-tooltip class="item" effect="dark" :content="getIcon('item-broken-inheritance').text" placement="top-end">
          <font-awesome-icon :icon="getIcon('item-broken-inheritance').icon" :style="getIcon('item-broken-inheritance').style"  :alt="getIcon('item-broken-inheritance').text"/>
        </el-tooltip>
      </template>
      <span>{{data.Title}}</span>
      <span> ({{data.ItemCount}} {{data.ItemCount == 1 ? "item" : "items"}}<template v-if="data.hasUniqueRoleAssignmentsCount > 0"> total, {{data.hasUniqueRoleAssignmentsCount}} with unique permissions</template>)</span>
      <span v-if="data.hasUniqueRoleAssignmentsCount == -1"><strong> Error accessing Items</strong></span>
      <span v-if="data.ItemCount > itemCountThreshold"><strong> Too many items; click list/library to display ones with unique permissions</strong></span>
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
  name:'List',
  props:['data'],
  components:{ContextMenu},
  computed:{
    ...mapGetters(['itemCountThreshold','getIcon'])
  },
  data(){
    return{
      displayContextMenu:false
    }
  }
}
</script>
