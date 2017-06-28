import test from 'ava';
import request from 'supertest';
import {MongoDBServer} from 'mongomem';

import {setupFixtures, removeFixtures, getMongooseMock} from './utils';

test.before('start server', async () => {
    await MongoDBServer.start();
});

test.beforeEach(async t => {
    const db = await getMongooseMock();
    const app = require('../main').default;

    // Setup any fixtures you need here. This is a placeholder code
    await setupFixtures();

    // Pass app and mongoose into your tests
    t.context.app = app;
    t.context.db = db;
});

test.afterEach.always(async t => {
    const {db} = t.context;
    // Note: removeFixtures is a placeholder. Write your own
    await removeFixtures();
    await db.connection.close();
});

// Note the serial tests
test.serial('create', async t => {
    const {app} = t.context;
    const res = await request(app).post('/user').send({
        username: 'ava',
        password: 'avarocks',
        email: 'ava@example.com'
    });
    t.is(res.status, 201);
    t.is(res.body.user.username, 'ava');
});

test.after.always('cleanup', () => MongoDBServer.tearDown());
