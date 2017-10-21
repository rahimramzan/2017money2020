// eslint-disable-next-line
const path = require('path');
const blockchain = require('mastercard-blockchain');
const config = require('../../config');

const { MasterCardAPI } = blockchain;
const keyStorePath = path.join(__dirname, '..', '..', config.keyFileName);
const { keyAlias, consumerKey, keyPassword, appId } = config;
const authentication = new MasterCardAPI.OAuth(consumerKey, keyStorePath, keyAlias, keyPassword);

MasterCardAPI.init({
  sandbox: true,
  debug: true,
  authentication,
});

// Get current status of chain
// eslint-disable-next-line no-unused-vars
const getBlockChainStatus = () => {
  const requestData = {};
  blockchain.Status.query(requestData, (error, data) => {
    if (error) {
      console.error({
        Status: error.getHttpStatus(),
        Message: error.getMessage(),
        ReasonCode: error.getReasonCode(),
        Source: error.getSource(),
        error,
      });
    } else {
      console.log('Node AppId:', data.applications[0]); // Application identifier for this node
      console.log('Last Confirmed Block Hash:', data.current.ref);
      console.log('Last Confirmed Block Slot:', data.current.slot); // The slot number of the last confirmed block
      console.log('Genesis Hash:', data.genesis.ref);
      console.log('Genesis Slot:', data.genesis.slot);
      console.log('[Network] Should be 1513115205:', data.network);
      console.log('Data Version:', data.version);
    }
  });
};

// Provisions a Blockchain node
const createBlockchainInstance = () => {
  const requestData = {
    network: 'Z0NE', // Don't change this. Use Z0NE
    application: {
      name: appId,
      description: '', // Description of your Blockchain application
      version: 0,
      definition: {
        format: 'proto3', // Don't change this. Use proto3
        encoding: 'base64',
        messages: 'Ly8gU2ltcGxlIG5vdGFyeSBhcHBsaWNhdGlvbg0KDQpzeW50YXggPSAicHJvdG8zIjsNCg0KcGFja2FnZSBFMTAyOw0KDQptZXNzYWdlIE1lc3NhZ2Ugew0KCWJ5dGVzIGFydGlmYWN0UmVmZXJlbmNlID0gMTsNCn0\u003d',
      },
    },
    // invitations: [
    //   'archcorsair@gmail.com',
    //   'autumn07@gmail.com',
    //   'rahimkr76@gmail.com',
    // ],
  };
  blockchain.Node.provision(requestData, (error, data) => {
    if (error) {
      console.error({
        Status: error.getHttpStatus(),
        Message: error.getMessage(),
        ReasonCode: error.getReasonCode(),
        Source: error.getSource(),
        error,
      });
    } else {
      console.log('Success! Created New Blockchain Node');
      console.log('Node Type:', data.type);
      console.log('Node Address:', data.address);

      // The signing identity from the audit nodes,
      // either as a blockchain address, or as the raw public key
      console.log('Authority:', data.authority);
    }
  });
};

createBlockchainInstance();
