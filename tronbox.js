module.exports = {
  networks: {
    development: {
      privateKey: '7618709300993da5a4ce0bc87306a9cdf62eb72b2ec82d8a83d91eccc30218c7',
      consume_user_resource_percent: 30,
      fee_limit: 1000000000,
      fullHost: 'http://127.0.0.1:9090',
      network_id: '*'
    },
    mainnet: {
      privateKey: process.env.PK,
      userFeePercentage: 30,
      feeLimit: 100000000,
      fullHost: 'https://api.trongrid.io',
      network_id: '*'
    },
    shasta: {
      privateKey: process.env.PK,
      consume_user_resource_percent: 30,
      userFeePercentage: 30,
      fee_limit: 1000000000,
      fullHost: 'https://api.shasta.trongrid.io',
      network_id: '*'
    }
  }

}
