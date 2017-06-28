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

const cleanupServer = () => MongoDBServer.tearDown();

const setupTest = async t => {
    const db = await getMongooseMock();
    const app = require('../../../src/server/main').default;

    // Setup any fixtures you need here. This is a placeholder code
    await setupFixtures();

    // Pass app and mongoose into your tests
    t.context.app = app;
    t.context.db = db;
};

const cleanupTest = async t => {
    const {db} = t.context;
    // Note: removeFixtures is a placeholder. Write your own
    await removeFixtures();
    await db.connection.close();
};

export {
    cleanupServer,
    setupTest,
    cleanupTest,
    getMongooseMock,
    setupFixtures,
    removeFixtures
};
