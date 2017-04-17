import test from 'ava';
import supertest from 'supertest';
import mongoose from 'mongoose';

import {app, config} from '../';
import {USER} from '../utils/consts';

const request = supertest(app);

test.before(async () => {
    await new Promise((resolve, reject) => mongoose.connect('mongodb://localhost/user-test').then(resolve).catch(reject));
    config.set('signups:enabled', true);
});

test.serial('signup:Success', async t => {
    t.plan(2);

    const res = await request.post('/user').send({
        username: 'ava',
        password: 'rocks'
    });

    t.is(res.status, USER.CREATED.SUCCESS.status);
    t.is(res.body.message, USER.CREATED.SUCCESS.message);
});

test.serial('signup:DuplicateUsername', async t => {
    t.plan(2);

    const res = await request.post('/user').send({
        username: 'ava',
        password: 'rocks'
    });

    t.is(res.status, USER.CREATED.FAILURE.DUPLICATE.status);
    t.is(res.body.message, USER.CREATED.FAILURE.DUPLICATE.message);
});

test.serial('signup:Disabled', async t => {
    t.plan(2);

    config.set('signups:enabled', false);

    const res = await request.post('/user').send({
        username: 'xo',
        password: 'rocks'
    });

    t.is(res.status, USER.CREATED.FAILURE.DISABLED.status);
    t.is(res.body.message, USER.CREATED.FAILURE.DISABLED.message);
    config.set('signups:enabled', true);
});

test('get:All', async t => {
    t.plan(2);

    const res = await request.get('/user');

    t.is(res.status, 200);
    t.is(res.body.length, 1);
});

test('get:byId', async t => {
    t.plan(2);

    const users = await request.get('/user');
    const res = await request.get(`/user/${users.body[0]._id}`);

    t.is(res.status, 200);
    t.is(res.body[0].username, 'ava');
});

test.after.always('guaranteed cleanup', () => {
    return new Promise((resolve, reject) => {
        mongoose.connection.dropDatabase(err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
});
