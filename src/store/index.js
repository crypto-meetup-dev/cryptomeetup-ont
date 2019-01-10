import Vue from 'vue';
import Vuex from 'vuex';
import { client, ParameterType } from 'ontology-dapi';
import countryPointsJson from '@/util/countryPoints.json';
import ui from './ui';
import tronApi from '@/util/tronApi';

// console.log(countryPointsJson, 'countryPointsJson')
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
      const { result } = await client.api.smartContract.invoke({
        contract: '0e133e1e1f510933c309ada4f40bcd314b560fe9',
        gasLimit: 30000,
        gasPrice: 500,
        method: 'getAll',
        parameters: []
      })
      const langarr = []
      const data = result[0]
      for (let i = 0; i < data.length - 1; i++) {
        langarr.push([
          parseInt(reverseHex(`${data[i][0]}`), 16),
          parseInt(reverseHex(`${data[i][1]}`), 16),
          ab2str(hexstring2ab(`${data[i][2]}`)),
          countryPointsJson[i].code
        ])
      }
      commit('setLandArr', langarr)
      const results = await client.api.smartContract.invoke({
        contract: '0e133e1e1f510933c309ada4f40bcd314b560fe9',
        gasLimit: 30000,
        gasPrice: 500,
        method: 'getGlebal',
        parameters: []
      })
      const globals = [
        parseInt(reverseHex(`${results.result[0][0]}`), 16),
        ab2str(hexstring2ab(`${results.result[0][1]}`)),
        results.result[0][2] ? parseInt(reverseHex(`${results.result[0][2]}`), 16) : 0,
      ]
      commit('setNowGlobal', globals)
    },
    async getAddress ({ commit }) {
      userInfoaddress = await client.api.asset.getAccount()
      commit('setAddress', userInfoaddress)
    }
  },
});
