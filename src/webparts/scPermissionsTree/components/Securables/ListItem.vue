<template>
  <div>
    <div v-popover:popover @contextmenu.prevent="displayContextMenu = !displayContextMenu">
      <template v-if="data.HasUniqueRoleAssignments">
        <el-tooltip class="item" effect="dark" content="Item has unique permissions" placement="top-end">
          <!-- <i class='fas' :class="getIcon('broken-inheritance').icon" :style="getIcon('broken-inheritance').style" alt="Item has unique permissions"></i> -->
          <font-awesome-icon :icon="getIcon('broken-inheritance').icon" :style="getIcon('broken-inheritance').style"  alt="Item has unique permissions"/>
        </el-tooltip>
      </template>
      <!-- <span>{{data.Id}} - {{data.Title}}</span> -->
      <span>{{data.Id}}: {{label}}</span>
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
  name:'ListItem',
  props:['data'],
  components:{ContextMenu},
  data(){
    return{
      displayContextMenu:false
    }
  },
  computed:{
    ...mapGetters(['getIcon']),
    label(){
      // console.log("-----------------------------------")
      // console.log(`ID:                      ${this.data.Id}`)
      // console.log(`Item.ServerUrl:          ${this.data.ServerUrl}`)
      // console.log(`Item.Title:              ${this.data.Title}`)
      // console.log(`List.RootFolder.Title:   ${this.data.ListNodeData.RootFolder.Name}`)
      
        let itemName = this.data.ServerUrl.substring(this.data.ServerUrl.indexOf(`${this.data.ListNodeData.RootFolder.Name}/`)  + this.data.ListNodeData.RootFolder.Name.length + 1)
        if(itemName.endsWith(`${this.data.Id}_.000`)){
          return itemName.replace(`${this.data.Id}_.000`,this.data.Title)
        }
        return itemName
    },
    listItemIcon(){
      // BaseType enum:
      // Generic List: 0
      // Document Library: 1
      // Discussion Board: 3
      // Survey: 4
      // Issue: 5
    }
  }
}
</script>