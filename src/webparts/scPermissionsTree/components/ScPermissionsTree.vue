<template>

  <div id="app" v-loading="formAction == 'initializing'">
    <initializing-form v-if="formAction == 'initializing'"></initializing-form>
    <access-denied-form v-if="currentForm == 'accessDenied' && formAction != 'initializing'"></access-denied-form>
    <main-form v-if="currentForm == 'main' && formAction != 'initializing'"></main-form>
  </div>
</template>

<script>
import store from '../store';
import {mapGetters} from 'vuex';

import InitializingForm from './Forms/InitializingForm.vue';
import AccessDeniedForm from './Forms/AccessDeniedForm.vue';
import MainForm from './Forms/MainForm.vue';


export default {
  
  name:"ScPermissionsTree",
  components:{MainForm,InitializingForm, AccessDeniedForm},
  computed:{
    ...mapGetters(['currentForm','formAction'])
  },
  mounted(){
    store.dispatch('GET_IS_ADMIN')
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
 
.fas{
  margin-right: 5px
}
</style>