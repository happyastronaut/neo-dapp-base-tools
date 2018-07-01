var neon = require('@cityofzion/neon-js')
var Neon = neon.default
const util = require("./util.js")
const account = require("./config.js")

module.exports = {

  //get simple cintract value like name, balanceOf etc
  getSmartContractValue: (action) => {
    const props = {
      scriptHash: account.scriptHash,
      operation: action,
      args: []
    }
    const script = Neon.create.script(props)
    return neon.rpc.Query.invokeScript(script)
      .execute(account.endpoint)
      .then(function (res) {
        return util.hex2str(res.result.stack[0].value)
      })
  },

  //get value useing key
  getStorageValue: (action, key) => {
    const props = {
        scriptHash: account.scriptHash,
        operation: action,
        args: [util.str2hex(key)]
      }
    const script = Neon.create.script(props)
    return neon.rpc.Query.invokeScript(script)
      .execute(account.endpoint)
      .then(function (res) {
        return util.hex2str(res.result.stack[0].value)
      })
  },

  //put key => value to storage. not using gas and returns '1' if good
  testInvokeContract: (action, key, value) =>  {
    const props = {
        scriptHash: account.scriptHash,
        operation: action,
        args: [util.str2hex(key), util.str2hex(value)]
      }
    const script = Neon.create.script(props)
    return neon.rpc.Query.invokeScript(script)
      .execute(account.endpoint)
      .then(function(res) {
        return res.result.stack[0].value
      })
  },

  //put key => value to storage
  invokeContract: (action, key, value) => {
    const config = {
          net: account.net,
          script: Neon.create.script({
            scriptHash: account.scriptHash,
            operation: action,
            args: [util.str2hex(key), util.str2hex(value)]
          }),
          address: account.address,
          privateKey: account.wif,
          gas: 1
        }
    return Neon.doInvoke(config).then(function(res) {
      return res.response.result
    })
  }

}
