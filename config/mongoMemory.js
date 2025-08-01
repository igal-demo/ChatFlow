const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

const startMongo = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connected to in-memory MongoDB');
};

const stopMongo = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports = { startMongo, stopMongo };
