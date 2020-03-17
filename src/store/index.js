import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from './modules/tagsView'
import errorLog from './modules/errorLog'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    tagsView,
    errorLog
  },
  getters
})
