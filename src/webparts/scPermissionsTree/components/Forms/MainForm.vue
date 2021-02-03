<template>
  <div>
    <el-tree :props="props" lazy :load="loadNode" empty-text="">
      <template slot-scope="scope">
        <root-web         :data="scope.data" v-if="scope.data.type == 'rootWeb'"/>
        <user             :data="scope.data" v-else-if="scope.data.type == 'user'"/>
        <list             :data="scope.data" v-else-if="scope.data.type == 'list'"/>
        <group            :data="scope.data" v-else-if="scope.data.type == 'group'"/>
        <web              :data="scope.data" v-else-if="scope.data.type == 'web'"/>
        <list-item        :data="scope.data" v-else-if="scope.data.type == 'list-item'"/>
        <role-assignment  :data="scope.data" v-else-if="scope.data.type == 'role-assignment'"/>
        <error            :data="scope.data" v-else-if="scope.data.type == 'error'"/>        
        <template v-else>{{scope.data.label}}</template>
      </template>
    </el-tree>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import RootWeb from '../Securables/RootWeb.vue'
import User from '../Securables/User.vue'
import List from '../Securables/List.vue'
import Group from '../Securables/Group.vue'
import Web from '../Securables/Web.vue'
import ListItem from '../Securables/ListItem.vue'
import RoleAssignment from '../Securables/RoleAssignment.vue'
import Error from '../Error.vue'

export default {
  name:"MainForm",
  components:{RootWeb, User, List, Group, Web, ListItem, RoleAssignment, Error},
  data(){
    return{
      props:{
        label:'label',
        children:'children',
        isLeaf:'isLeaf'
      }
    }
  },
  computed:{
    ...mapGetters(['pageContext','itemCountThreshold'])
  },
  methods:{
    loadNode(node, resolve){
      // console.log(this.pageContext.site.absoluteUrl)
      if(node.level === 0){
        this.loadRootWeb(node, resolve)
      }
      else{
        switch(node.data.type){
          case 'rootWeb':
            this.loadRootWebContainers(node, resolve)
            break;
          case 'scasContainer':
            this.loadScasContainer(node, resolve)
            break;  
          case 'listsContainer':
            this.loadListsContainer(node, resolve)
            break;            
          case 'groupsContainer':
            this.loadGroupsContainer(node, resolve)
            break;
          case 'group':
          case 'role-assignment':
            this.loadGroupMembers(node, resolve)
            break;
          case 'websContainer':
            this.loadWebsContainer(node, resolve)
            break;
          case 'web':
            this.loadWebContainers(node, resolve)
            break;
          case 'list':
            this.loadListItems(node, resolve)
            break;
          case 'list-item':
          case 'permissionsContainer':
            this.loadRoleAssignments(node, resolve)
            break;            
          default:
            return resolve([])
            break;
        }
      }
    },
    
    loadRootWeb(node, resolve){
      axios.get(`_api/site?$select=RootWeb/Title,RootWeb/Url&$expand=RootWeb`)
      .then(response => {
        let rootNode = {
          type:'rootWeb',
          contextMenuLinks:[
            {title:"Homepage", url:`${response.data.d.RootWeb.Url}`},
            {title:"Site Settings", url:`${response.data.d.RootWeb.Url}/_layouts/15/settings.aspx`}],
          }
        Object.keys(response.data.d.RootWeb).filter(_key => !_key.startsWith("__") ).forEach(_key => rootNode[_key] = response.data.d.RootWeb[_key])
        return resolve([rootNode])
      })
      .catch(err => {
        return resolve([{label: err.response.statusText}])
      })
    },
    loadRootWebContainers(node, resolve){
      let rootContainers = [
        {label:'Site Collection Admins', type:'scasContainer', Url:node.data.Url},
        {label:'Permissions', type:'permissionsContainer', Url:`${node.data.Url}/_api/web`},
        {label:'SharePoint Groups', type:'groupsContainer', Url: node.data.Url},
        {label:'Lists/Libraries', type:'listsContainer', Url: node.data.Url},
        {label:'Subsites', type:'websContainer', Url: node.data.Url},
      ]
      return resolve(rootContainers)
    },
    loadWebContainers(node, resolve){
      let containers = [
        {label:'Permissions', type:'permissionsContainer', Url:`${node.data.Url}/_api/web`},
        {label:'Lists/Libraries', type:'listsContainer', Url: node.data.Url},
        {label:'Subsites', type:'websContainer', Url: node.data.Url},
      ]
      return resolve(containers)
    },
    loadScasContainer(node, resolve){
      axios.get(`${node.data.Url}/_api/web/siteusers?$filter=IsSiteAdmin eq true&$select=PrincipalType,Title,Email,LoginName`)
      .then(response => {
        let nodes = []
        response.data.d.results.map(sca => {
          let scaNode = {
            type:'user',
            contextMenuLinks:[{title:'Email',url:`mailto:${sca.Email}`}],
            isLeaf: true}
          Object.keys(sca).filter(_key => !_key.startsWith("__") ).forEach(_key => scaNode[_key] = sca[_key])
          nodes.push(scaNode)
        })
        return resolve(nodes)
      })
      .catch(err => {
        console.log(err)
        return resolve([{label:'error', isError:true, isLeaf:true}])
      })
    },
    loadListsContainer(node, resolve){
      axios.get(`${node.data.Url}/_api/web/lists?$filter=Hidden eq false&$select=Id,BaseType,DefaultView/ServerRelativeUrl,Title,ItemCount,HasUniqueRoleAssignments,RootFolder/Name&$expand=DefaultView,RootFolder`)
      .then(response => {
        let nodes = []
        response.data.d.results.map(list => {
          let listNode = {
            type:'list',
            contextMenuLinks:[
              {title:'Default View', url:`${list.DefaultView.ServerRelativeUrl}`},
              {title:'List Settings', url:`${node.data.Url}/_layouts/15/listedit.aspx?List={${list.Id}}`},
              {title:"List Permissions", url:`${node.data.Url}/_layouts/15/User.aspx?List={${list.Id}}`}],
            listId:list.Id,
            Url: node.data.Url,
            hasUniqueRoleAssignmentsCount:-1,
          }
          Object.keys(list).filter(_key => !_key.startsWith("__") ).forEach(_key => listNode[_key] = list[_key])

          // 12/21/2020 - if itemcount > our threshold, we'll just display a message saying list is too large so you need to expand the list/lib to see if any items have unique permissions
          // so query query for a single item (because you can't use 0 for $top) but still set the has unique count to 0
          // HACK: can't filter on HasUniqueRoleAssignments, so need to get all items, then filter on that property
          let threshold = this.itemCountThreshold
          if(list.ItemCount > threshold){
            threshold = 1
          }
          axios.get(`${node.data.Url}/_api/web/lists(guid'${list.Id}')/Items?$select=HasUniqueRoleAssignments&$top=${threshold}`)
          .then(itemsResponse => {
            if(list.ItemCount > this.itemCountThreshold){
              listNode.hasUniqueRoleAssignmentsCount = 0
            }
            else{
              listNode.hasUniqueRoleAssignmentsCount = itemsResponse.data.d.results.filter(i => i.HasUniqueRoleAssignments == true).length
            }
            nodes.push(listNode)
          })
          .catch(err => {
            let error = {
              type:'error',
              label:list.Title,
              isLeaf:true,
              response:err.response
            }
            nodes.push(error)
          })
          .finally(() => {
            if(nodes.length == response.data.d.results.length){
              return resolve(nodes)
            }
          })
        })
      })
      .catch(err => {
        console.log(err)
        return resolve([{label:'error', isError:true, isLeaf:true}])
      })
    },
    loadGroupsContainer(node, resolve){
      axios.get(`_api/web/siteGroups?$select=PrincipalType,Id,Title,Users/Id&$expand=Users`)
      .then(response => {
        let nodes = []
        response.data.d.results.map(group => {
          let groupNode = {
            type:'group',
            isLeaf: group.Users.results.length === 0,
            Url:node.data.Url,
            contextMenuLinks:[{title:`View group members`, url:`${node.data.Url}/_layouts/15/people.aspx?MembershipGroupId=${group.Id}`}]
          }
          Object.keys(group).filter(_key => !_key.startsWith("__") ).forEach(_key => groupNode[_key] = group[_key])
          nodes.push(groupNode)
        })
        return resolve(nodes)
      })
    },
    loadGroupMembers(node, resolve){
      axios.get(`_api/web/siteGroups(${node.data.Id})/users?$select=PrincipalType,Title,Email,LoginName`)
      .then(response => {
        let nodes = []
        response.data.d.results.map(user => {
          let userNode = {
            type:'user',
            contextMenu:{
              header:'',
              links:[]
            },
            isLeaf: true
          }
          Object.keys(user).filter(_key => !_key.startsWith("__") ).forEach(_key => userNode[_key] = user[_key])
          nodes.push(userNode)
        })
        return resolve(nodes)
      })
    },
    loadWebsContainer(node, resolve){
      axios.get(`${node.data.Url}/_api/web/webs?$select=Id,Title,Url,HasUniqueRoleAssignments`)
      .then(response => {
        let nodes = []
        response.data.d.results.map(web => {
          let webNode = {
            type:'web',
            contextMenuLinks:[
            {title:"Homepage", url:`${web.Url}`},
            {title:"Site Settings", url:`${web.Url}/_layouts/15/settings.aspx`},
            {title:'Site Contents', url:`${web.Url}/_layouts/15/viewlsts.aspx`}],
          }
          Object.keys(web).filter(_key => !_key.startsWith("__") ).forEach(_key => webNode[_key] = web[_key])
          nodes.push(webNode)
        })
        return resolve(nodes)
      })
      .catch(err => {
        console.log(err.response)
      })
    },
    loadListItems(node, resolve){
      // console.log('l')
      axios.get(`${node.data.Url}/_api/web/lists(guid'${node.data.Id}')/Items?$select=Title,ID,HasUniqueRoleAssignments,FileRef,FileLeafRef,ContentType/Name,ContentTypeId,DocIcon,ServerUrl&$expand=ContentType&$top=${node.data.ItemCount+1}`)
      .then(response => {
        let nodes = []
        // Add permissions container first
        nodes.push({label:'Permissions', type:'permissionsContainer', Url:`${node.data.Url}/_api/web/lists/getbytitle('${node.data.Title}')`})

        // Then add the items
        response.data.d.results.filter(item => item.HasUniqueRoleAssignments).map(item => {
          let itemNode = {
            type:'list-item',
            ListNodeData: node.data,
            Url:item.__metadata.uri,
            contextMenuLinks:[
              {title:'View Item', url:`${node.data.Url}/_layouts/15/listform.aspx?PageType=4&ListId={${node.data.Id}}&ID=${item.Id}&ContentTypeID=${item.ContentTypeId}`},
              {title:'Item Permissions', url:`${node.data.Url}/_layouts/15/User.aspx?List={${node.data.Id}}&obj={${node.data.Id}},${item.Id},LISTITEM`}
            ],
          }
          Object.keys(item).filter(_key => !_key.startsWith("__") ).forEach(_key => itemNode[_key] = item[_key])

          nodes.push(itemNode)
        })
        return resolve (nodes)
      })
      .catch(err => {
        let error = {
          type:'error',
          isLeaf:true,
          response:err.response
        }
        return resolve ([error])
      })
    },
    loadRoleAssignments(node, resolve){
      axios.get(`${node.data.Url}/roleassignments?$select=PrincipalId,Member/Title,Member/PrincipalType,Member/Users/Id,RoleDefinitionBindings/Name&$expand=Member,Member/Users,RoleDefinitionBindings`)
      .then(response => {
        let nodes = []
        response.data.d.results.map(roleAssignment => {
          let ra = {
            type:'role-assignment',
            Id: roleAssignment.PrincipalId,
            contextMenuLinks:[{title:'Group Members',url:`${this.pageContext.site.absoluteUrl}/_layouts/15/people.aspx?MembershipGroupId=${roleAssignment.PrincipalId}`}],
            // contextMenuLinks:[{title:'Group Members',url:`${_spPageContextInfo.webAbsoluteUrl}/_layouts/15/people.aspx?MembershipGroupId=${roleAssignment.PrincipalId}`}],
            isLeaf: roleAssignment.Member.PrincipalType === 8 ? false : true,
            PrincipalType: roleAssignment.Member.PrincipalType,
            Title: roleAssignment.Member.Title,
            UserCount: roleAssignment.Member.Users != undefined ? roleAssignment.Member.Users.results.length : 0,
            RoleDefinitionBindings:[]
          }
          roleAssignment.RoleDefinitionBindings.results.filter(roleDefBinding => roleDefBinding.Name != 'Limited Access').map(roleDefBinding => {
            ra.RoleDefinitionBindings.push(roleDefBinding.Name)
          })

          // If only role Definition Binding is "Limited Access"
          if(ra.RoleDefinitionBindings.length > 0){
            nodes.push(ra)
          }          
        })
        return resolve(nodes)
      })
      .catch(err => {
        console.log(err.response)
      })
      return resolve([])
    },





  }
}
</script>

<style scoped>

h2{
  font-weight: 400;
  color:#1f2f3d;
  font-size:18px;
  margin:0;
  margin-top:10px;
}

.divider{
  margin-top: 2px;
  margin-bottom:0px;
}

li.instruction-step{
  word-break: break-word;
  margin:10px 0
}

</style>

<style>
.el-dialog__body{
  margin-top:0;
  padding-top:0 !important;
}
</style>