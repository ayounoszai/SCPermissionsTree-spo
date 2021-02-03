import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageContext: null,
    isSiteAdmin:false,
    formAction:'initializing',
    itemCountThreshold:1000, 
    icons:[
      {id:'sp-user', icon:'user', text:'SharePoint User', style:{color:'darkviolet'}},
      {id:'sp-group', icon:'user-friends', text:'SharePoint Group', style:{color:'darkblue'}},
      {id:'ad-group', icon:'users', text:'Active Directory Group', style:{color:'tomato'}},
      {id:'broken-inheritance', icon:'unlink', text:"Object has unique permissions", style:{color:'red'}},
      {id:'item-broken-inheritance', icon:'project-diagram', text:"List/Library contains items with unique permissions", style:{color:'rgb(16, 185, 16)'}},
      {id:'error', icon:'exclamation-circle', text:"There was an error accessing data for the object", style:{color:'#B73239'}},
    ]
  },
  getters:{
    currentForm(state){
      if(state.isSiteAdmin){
        return "main"
      }
      else{
        return "accessDenied"
      }
    },
    pageContext(state){
      return state.pageContext
    },
    formAction(state){
      return state.formAction
    },
    itemCountThreshold(state){
      return state.itemCountThreshold
    },
    icons(state){
      return state.icons
    },
    getIcon(state){
      return(id) => {
        let matches = state.icons.filter(item => item.id === id)
        if(matches.length === 1){
          return matches[0]
        }
        return {id:'',icon:'fa-question', text:'unknown icon id', style:{color:'black'}}
      }
    }
  },
  mutations: {
    SET_PAGE_CONTEXT(state, pageContext){
      state.pageContext = pageContext
    },
    SET_FORM_ACTION(state, action){
      state.formAction = action
    },
    SET_IS_ADMIN(state, response){
      state.isSiteAdmin = response.data.d.IsSiteAdmin
    }
  },
  actions:{
    GET_IS_ADMIN({dispatch, commit, getters, rootGetters}){
      axios.get(`_api/web/currentuser`,null)
      .then(response => {
        commit('SET_IS_ADMIN', response)
      })
      .then(() => {
        commit('SET_FORM_ACTION', 'resting')
      })
      .catch(err => {
        commit('SET_FORM_ACTION', 'resting')
      })
    }
  }
})