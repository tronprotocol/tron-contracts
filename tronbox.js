module.exports = {
    networks: {
        development: {
            from: '',
            privateKey: '',
            userFeePercentage: 30,
            feeLimit: 1e9,
            originEnergyLimit: 1e7,
            fullHost: "https://api.shasta.trongrid.io",
            network_id: "*" // Match any network id
        },
        production: {}
    }
};
