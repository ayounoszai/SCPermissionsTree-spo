<template>
  <div><i class='fas' :class="getIcon('error').icon" :style="getIcon('error').style" alt="There was an error"></i>{{data.label}} - <strong>ERROR: {{message}}</strong></div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name:'Error',
  props:['data'],
  computed:{
    ...mapGetters(['getIcon']),
    message(){
      console.log(this.data)
      // if(this.data?.response?.data?.error?.message != undefined){
      //   return this.data.response.data.error.message.value
      // }
      // else if(this.data?.response?.statusText != undefined){
      //   return this.data.response.statusText
      // }

      return "Unknown error"

    }
  }
}
</script>

<style scoped>

</style>