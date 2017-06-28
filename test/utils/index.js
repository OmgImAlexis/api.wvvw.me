import mongoose from 'mongoose';
import {MongoDBServer} from 'mongomem';

// MongoDBServer.debug = true;
mongoose.Promise = Promise;

const setupFixtures = () => {};
const removeFixtures = () => {};
const getMongooseMock = async () => {
    await mongoose.connect(await MongoDBServer.getConnectionString());
    return mongoose;
};

export {
    getMongooseMock,
    setupFixtures,
    removeFixtures
};
