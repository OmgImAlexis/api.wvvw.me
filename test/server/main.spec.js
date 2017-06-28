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
test.serial('healthcheck', async t => {
    const {app} = t.context;
    const res = await request(app).get('/healthcheck');
    t.is(res.status, 200);
});
