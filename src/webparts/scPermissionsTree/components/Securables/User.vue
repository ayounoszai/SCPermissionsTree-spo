<template>
  <div>
    <div v-popover:popover>
      <font-awesome-icon :icon="icon.icon" :style="icon.style"/>
      <span>{{data.Title}}</span>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name:'User',
  props:['data'],
  data(){
    return{
      visible:false
    }
  },
  computed:{
    ...mapGetters(['getIcon']),
    icon(){
      if(this.data.PrincipalType === 1){
        return this.getIcon('sp-user')
      }
      else if(this.data.PrincipalType === 4){
        return this.getIcon('ad-group')
      }
      else if(this.data.PrincipalType === 8){
        return this.getIcon('sp-group')
      }
      else{
        return this.getIcon('')
      }
    },
    domain(){
      if(this.data.PrincipalType === 1){
        let interstitial = this.data.LoginName.substring(this.data.LoginName.indexOf('|') + 1)
        interstitial = interstitial.substring(0, interstitial.indexOf('\\'))
        return interstitial.toUpperCase()
      }
      else if(this.data.PrincipalType === 4){
        return this.data.Title.substring(0, this.data.Title.indexOf('\\'))
      }
    }
  }
}
</script>