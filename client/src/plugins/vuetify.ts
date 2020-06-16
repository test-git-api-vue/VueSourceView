import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import ruLocale from 'vuetify/src/locale/ru'
import enLocale from 'vuetify/src/locale/en'

Vue.use(Vuetify);

export default new Vuetify({
    lang:{
        locales:{ruLocale, enLocale},
        current: 'ruLocale'
    }
})
