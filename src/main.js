import Vue from 'vue';
import '@/util/prototypeExtend';
import '@/theme/icon.scss'
import Buefy from 'buefy';
import VueMoment from 'vue-moment';
import Transitions from 'vue2-transitions';
import VueClipboard from 'vue-clipboard2';
import router from '@/router';
import store from '@/store';
import i18n from '@/i18n';
import API from '@/util/api';
import PriceFormatter from '@/util/priceFormatter';
import App from '@/App.vue';

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(VueMoment);
Vue.use(Transitions);
Vue.use(VueClipboard);
Vue.use(PriceFormatter);
Vue.use(API);

const renderHTml = new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
})

const waitForGlobal = async () => {
  if (window.tronWeb) {
    const tronWeb = window.tronWeb
    const nodes = await tronWeb.isConnected()
    const connected = !Object.entries(nodes).map(([key, value]) => {
      if (!value) {
        console.error(`Error: ${key} is not connected`)
      }
      return value
    }).includes(false)
    if (connected) {
      renderHTml.$mount('#app');
      document.querySelector('#load').remove();
    } else {
      console.error('Error: TRON node is not connected')
      console.error('wait for tronLink')
      setTimeout(async () => {
        await waitForGlobal()
      }, 100)
    }
  } else {
    console.error('wait for tronLink')
    setTimeout(async () => {
      await waitForGlobal()
    }, 100)
  }
}

waitForGlobal().then()

