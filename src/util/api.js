import { client } from 'ontology-dapi';
import { client as clientApp } from 'cyanobridge'

const isApp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

if (isApp) {
  clientApp.registerClient();
} else {
  client.registerClient({})
}


function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf))
}

function hexstring2ab(str) {
  const result = [];

  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }

  return result;
}

const API = {
  account: '',
  getAccount () {
    if (isApp) {
      clientApp.api.asset.getAccount().then(resp => {
        this.account = resp
      })
    } else {
      client.api.asset.getAccount().then(resp => {
        this.account = resp
      })
    }
  },
  async buy(id, address) {
    let result
    if (isApp) {
      result = await clientApp.api.smartContract.invoke({
        scriptHash: '0e133e1e1f510933c309ada4f40bcd314b560fe9',
        gasLimit: 31344500,
        gasPrice: 500,
        operation: 'buy',
        payer: this.account,
        args: [{ type: 'Integer', value: id }, { type: 'String', value: address }]
      })
    } else {
      result = await client.api.smartContract.invoke({
        contract: '0e133e1e1f510933c309ada4f40bcd314b560fe9',
        gasLimit: 31344500,
        gasPrice: 500,
        method: 'buy',
        parameters: [{ type: 'Integer', value: id }, { type: 'String', value: address }]
      })
    }

    return ab2str(hexstring2ab(`${result.result[0]}`))
  }
};

export default API;
