// 利用vue单例充当 全站 事件 有必要的话可以把数据也接进来
import Vue from 'vue'

// 关于Portal用的数据
const globalPortal = {
  scatterAccount: null,
  portalInfoList: [],
}

// 关于地球用的数据
const globalLangd = {
  myLangd: []
}

export default new Vue({
  data () {
    return {
      ...globalPortal,
      ...globalLangd,
    }
  },
  methods: {
    setScatterAccount(scatterAccount) {
      this.scatterAccount = scatterAccount
    },
    setPortalInfoList(portalInfoList) {
      this.portalInfoList = portalInfoList
    },
    setGlobalLangd(myLangd) {
      this.myLangd = myLangd
    }
  },
  beforeDestroy() {
    this.$off()
  }
})
