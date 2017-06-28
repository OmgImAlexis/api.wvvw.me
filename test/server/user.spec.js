import test from 'ava';
import request from 'supertest';
import {MongoDBServer} from 'mongomem';

import {cleanupServer, setupTest, cleanupTest} from './utils';

test.before('start server', async () => {
    await MongoDBServer.start();
});
test.beforeEach('setup test', setupTest);
test.afterEach.always('cleanup test', cleanupTest);
test.after.always('cleanup server', cleanupServer);

// Note the serial tests
test.serial('create with signup disabled', async t => {
    const {app} = t.context;
    const res = await request(app).post('/user').send({
        username: 'ava',
        password: 'avarocks',
        email: 'ava@example.com'
    });
    t.is(res.status, 405);
    t.is(res.body.error, 'Signups are currently disabled.');
});
