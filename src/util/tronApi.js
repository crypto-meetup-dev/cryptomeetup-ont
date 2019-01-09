import contracts from './abi.json';

const contract = contracts['Crtyptomeetup']

console.log(contract, 'contract')

const utils = {
  tronWeb: false,
  contract: false,

  async setTronWeb(tronWeb) {
    this.tronWeb = tronWeb;
    this.contract = tronWeb.contract(contract.abi, contract.address)
    // this.contract = await tronWeb.contract().at(contract.address)
  },
  async getTotalSupply () {
    const resp = await this.contract.totalSupply().call()
    return resp
  },
  async getAllOf (i) {
    const resp = await this.contract.allOf(i).call()
    return resp
  }
};

export default utils;
