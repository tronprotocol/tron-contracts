# tron-contracts
Solidity smart contracts for the [TRON](https://tron.network) blockchain.

This repository contains a library of sample smart contracts for the TRON network.

Configured with [TronBox](https://github.com/tronprotocol/tron-box).

Contracts include but not limited to implementations of standard-compliant tokens, library kits, and common utilities.

## Usage

### Install tronbox:

```npm install -g tronbox```

### Clone repo:

```git clone https://github.com/tronprotocol/tron-contracts.git```

### Import Private Key:

Import a private key of an account into the "privateKey" field inside the index.js file. Make sure it has test TRX to deploy the contracts. You cab request some [here](https://www.trongrid.io/shasta/#request).

### Compile:

```tronbox compile```

### Migrate:

```tronbox migrate```

## Security

This repository is maintained by the TRON community and is aimed to provide sample contracts with quality and security in mind. Please use common sense when using contracts associated with real money! These contracts are provided as-is; TRON Foundation takes no responsibility for any decisions made with these contracts.

## Contribute

Pull requests and suggestions are welcome.

Feel free to consult the [Ethereum Conversion Guide](https://developers.tron.network/docs/converting-ethereum-contracts-to-tron) to port Ethereum smart contracts over to TRON.

## License

Released under the [MIT License](LICENSE).
