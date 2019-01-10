import Vue from 'vue';
import Vuex from 'vuex';
import { client, ParameterType } from 'ontology-dapi';
import { client as clientApp } from 'cyanobridge'
import countryPointsJson from '@/util/countryPoints.json';
import ui from './ui';

// console.log(countryPointsJson, 'countryPointsJson')
const isAPP = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
Vue.use(Vuex);

let userInfoaddress = ''

function ab2str (buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf))
}

function hexstring2ab (str) {
  const result = [];

  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }

  return result;
}

const reverseHex = (hex) => {
  if (hex.length % 2 !== 0) {
    throw new Error(`Incorrect Length: ${hex}`);
  }
  let out = '';
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    out += hex.substr(i, 2);
  }
  return out;
}

export default new Vuex.Store({
  modules: {
    ui,
  },
  state: {
    tronWeb: {
      installed: false,
      loggedIn: false
    },
    landArr: [],
    nowGlobal: null,
    address: ''
  },
  mutations: {
    setTronWeb(state, tronWebInfo) {
      state.tronWeb = tronWebInfo;
    },
    setAddress(state, address) {
      state.address = address;
    },
    setLandArr(state, landArr) {
      state.landArr = landArr
      state.landInfoUpdateAt = new Date();
    },
    setNowGlobal(state, nowGlobal) {
      state.nowGlobal = nowGlobal
    },
  },
  actions: {
    async getLangArr ({ commit }) {
      let result = null
      if (isAPP) {
        result = await clientApp.api.smartContract.invokeRead({
          scriptHash: '0e133e1e1f510933c309ada4f40bcd314b560fe9',
          gasLimit: 30000,
          gasPrice: 500,
          operation: 'getAll',
          args: []
        })
      } else {
        result = await client.api.smartContract.invokeRead({
          contract: '0e133e1e1f510933c309ada4f40bcd314b560fe9',
          gasLimit: 30000,
          gasPrice: 500,
          method: 'getAll',
          parameters: []
        })
      }

      console.log(result, 'result')

      const langarr = []

      for (let i = 0; i < result.length - 1; i++) {
        langarr.push([
          parseInt(reverseHex(`${result[i][0]}`), 16),
          parseInt(reverseHex(`${result[i][1]}`), 16),
          ab2str(hexstring2ab(`${result[i][2]}`)),
          countryPointsJson[i].code
        ])
      }
      commit('setLandArr', langarr)
      let results = null
      if (isAPP) {
        results = await clientApp.api.smartContract.invokeRead({
          scriptHash: '0e133e1e1f510933c309ada4f40bcd314b560fe9',
          gasLimit: 30000,
          gasPrice: 500,
          operation: 'getGlebal',
          args: []
        })
      } else {
        results = await client.api.smartContract.invokeRead({
          contract: '0e133e1e1f510933c309ada4f40bcd314b560fe9',
          gasLimit: 30000,
          gasPrice: 500,
          method: 'getGlebal',
          parameters: []
        })
      }
      const globals = [
        parseInt(reverseHex(`${results[0]}`), 16),
        ab2str(hexstring2ab(`${results[1]}`)),
        results[2] ? parseInt(`${results[2]}`, 16) : 0,
      ]

      commit('setNowGlobal', globals)
    },
    async getAddress ({ commit }) {
      userInfoaddress = await client.api.asset.getAccount()
      commit('setAddress', userInfoaddress)
    }
  },
});
