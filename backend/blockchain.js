var neon = require('@cityofzion/neon-js')
var Neon = neon.default
const util = require("./util.js")
const account = require("./config.js")

module.exports = {

  getBalace: (address) => {
    return neon.api.neoscan.getBalance(account.net, address).then((res) => {
      return res;
    });
  },

  getValue: (action) => {
    const props = {
      scriptHash: account.scriptHash,
      operation: action,
      args: []
    };
    const script = Neon.create.script(props);
    return neon.rpc.Query.invokeScript(script)
      .execute(account.endpoint)
      .then((res) => {
        if (res.result.stack[0].value != "") {
          return util.hex2str(res.result.stack[0].value);
        } else {
          return -1;
        }
      });
  },

  getValueByKey: (action, key) => {
    const props = {
      scriptHash: account.scriptHash,
      operation: action,
      args: [util.str2hex(key)]
    };
    const script = Neon.create.script(props);
    return neon.rpc.Query.invokeScript(script)
      .execute(account.endpoint)
      .then((res) => {
        return util.hex2str(res.result.stack[0].value);
      });
  },

  testInvokeContract: (action, args) => {
    let hexArgs = [];
    args.forEach((arg) => {
      hexArgs.push(util.str2hex(arg));
    });
    const props = {
      scriptHash: account.scriptHash,
      operation: action,
      args: hexArgs
    };
    const script = Neon.create.script(props);
    return neon.rpc.Query.invokeScript(script)
      .execute(account.endpoint)
      .then((res) => {
        return res.result.stack[0].value;
      });
  },

  invokeContract: (action, args) => {
    let hexArgs = [];
    args.forEach((arg) => {
      hexArgs.push(util.str2hex(arg));
    });
    const config = {
      net: account.net,
      script: Neon.create.script({
        scriptHash: account.scriptHash,
        operation: action,
        args: hexArgs
      }),
      address: account.address,
      privateKey: account.wif,
      gas: 1
    };
    return neon.rpc.Query.invokeScript(config.script)
      .execute(account.endpoint)
      .then((res) => {
        if (res.result.state == "HALT, BREAK") {
          return Neon.doInvoke(config).then((res) => {
            return res.response.result;
          })
        }
      });
  }

}
