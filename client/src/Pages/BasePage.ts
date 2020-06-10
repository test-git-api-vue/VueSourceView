

import { Route } from 'vue-router'
import { Component, Vue } from 'vue-property-decorator';
import WaitOverlay from '../components/WaitOverlay.vue';

@Component({ components: { WaitOverlay } })
export default class BasePage extends Vue {
    protected isLoading=false;

    updateTitle(route: Route) {
        document.title = `VueSourceView ${ route.meta.title ? " | " + (route.meta.title) : "" }`;
    }
}


