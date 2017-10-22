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
  network,
  format,
  encoding,
} = config;
const { MasterCardAPI } = blockchain;
const keyStorePath = path.join(__dirname, '..', '..', config.keyFileName);
let msgClassDef;

// Loads .proto file
const loadProtoFile = file => new Promise((resolve, reject) => {
  const protoFile = fs.statSync(path.join(__dirname, file));
  if (protoFile) {
    protobuf.load(file, (err, root) => {
      if (err) reject(err);
      resolve(root);
    });
  }
});

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

// Get current status of chain
const getBlockChainStatus = () => {
  const requestData = {};
  blockchain.Status.query(requestData, (error, data) => {
    if (error) {
      throw new Error(error);
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
    network, // Don't change this. Use Z0NE
    application: {
      name: appId,
      description: '', // Description of your Blockchain application
      version: 0,
      definition: {
        format, // Don't change this. Use proto3
        encoding,
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

// Decode data from retrieved transaction
const decodeMessage = (data) => {
  const message = msgClassDef.decode(Buffer.from(data.value, 'hex'));
  return msgClassDef.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  });
};

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
    console.log('[Get Transaction] Decoded:', { result, decodedMessage });
    resolve({ result, decodedMessage });
  });
});

// Retrieve Block
const getBlock = id => new Promise((resolve, reject) => {
  const requestData = {};
  blockchain.Block.read(id, requestData, (error, result) => {
    if (error) reject(error);
    // console.log(`Result for block ${id}`, result);
    resolve(result);
  });
});

// Get last n blocks
const getLastNBlocks = async (startHash, remainingHashes = 5, foundHashes = []) => {
  if (remainingHashes < 1) {
    return foundHashes;
  }
  const currentBlock = await getBlock(startHash);
  foundHashes.push(currentBlock);
  remainingHashes--;
  return getLastNBlocks(currentBlock.previous_block, remainingHashes, foundHashes);
};

// Get list of transactions

// Retrieve last confirmed block
const getLastConfirmedBlock = () => new Promise((resolve, reject) => {
  console.time('getLastConfirmedBlock');
  const requestData = {};
  blockchain.Block.list(requestData, (error, result) => {
    if (error) reject(error);
    console.log('Last Confirmed Block', result);
    console.timeEnd('getLastConfirmedBlock');
    resolve(result);
  });
});

initApi()
  // .then(() => {
  //   const date = new Date().toLocaleString();
  //   createEntry(`Hello ${date}`)
  //     .then((result) => {
  //       console.log('New Entry:', result);
  //       // getLastNEntries(result.hash).then((results) => {
  //       //   console.log('All found hashes', results);
  //       // });
  //     });
  // })
  .then(() => {
    getLastConfirmedBlock().then((result) => { console.time('getLastNBlocks'); getLastNBlocks(result['0'].hash).then((data) => { console.timeEnd('getLastNBlocks'); console.log(data); }); });
  })
  .catch((e) => { console.error(e); });
