var neon = require('@cityofzion/neon-js')
var Neon = neon.default
const neo = require("./backend/blockchain.js")

neo.getSmartContractValue("name").then((res) => {
  console.log(res)
})

neo.getStorageValue("readtask", "newkey").then((res) => {
  console.log(res);
})

neo.testInvokeContract("registertask", "key", "value").then((res) => {
  console.log(res);
})

// neo.invokeContract("registertask", "newkey", "newvalue").then((res) =>{
//   console.log(res);
// })
