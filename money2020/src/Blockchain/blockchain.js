// eslint-disable-next-line
const path = require('path');
const fs = require('fs');
const blockchain = require('mastercard-blockchain');
const protobuf = require('protobufjs');
const config = require('../../config');

const {
  keyAlias,
  consumerKey,
  keyPassword,
  appId,
} = config;
const { MasterCardAPI } = blockchain;
const keyStorePath = path.join(__dirname, '..', '..', config.keyFileName);
const encoding = 'base64';
let msgClassDef;

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

// Provisions a Blockchain node (already done)
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

const loadProtoFile = file => new Promise((resolve, reject) => {
  const protoFile = fs.statSync(path.join(__dirname, file));
  if (protoFile) {
    protobuf.load(file, (err, root) => {
      if (err) reject(err);
      resolve(root);
    });
  }
});

const decodeMessage = (data) => {
  const message = msgClassDef.decode(Buffer.from(data.value, 'hex'));
  return msgClassDef.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  });
};

const initApi = () => new Promise((resolve) => {
  const authentication = new MasterCardAPI.OAuth(consumerKey, keyStorePath, keyAlias, keyPassword);
  loadProtoFile('message.proto').then((root) => {
    msgClassDef = root.lookupType('TM19.Message');
    console.info('[Protocol Buffer] Successfully loaded .proto file');
    MasterCardAPI.init({
      sandbox: true,
      // debug: true,
      authentication,
    });
    resolve();
  });
});

// Create a transaction entry
const createEntry = text => new Promise((resolve, reject) => {
  const payload = { text };
  const errorMsg = msgClassDef.verify(payload);
  if (errorMsg) {
    reject(Error(errorMsg));
  } else {
    const message = msgClassDef.create(payload);
    blockchain.TransactionEntry.create({
      app: appId,
      encoding,
      value: msgClassDef.encode(message).finish().toString(encoding),
    }, (error, result) => {
      if (error) reject(error);
      console.log('[Create Transaction] Success');
      resolve(result);
    });
  }
});

// Retrieve a transaction entry
const getEntry = hash => new Promise((resolve, reject) => {
  blockchain.TransactionEntry.read('', { hash }, (error, result) => {
    if (error) reject(error);
    const decodedMessage = decodeMessage(result);
    console.log('[Get Transaction] Decoded:', decodeMessage(result));
    resolve({ result, decodedMessage });
  });
});

initApi()
  .then(() => {
    const date = new Date().toLocaleString();
    createEntry(`Hello ${date}`)
      .then((result) => {
        getEntry(result.hash);
      });
  })
  .catch((e) => { console.error(e); });
