import test from 'ava';
import supertest from 'supertest';
import mongoose from 'mongoose';

import {app, config} from '../';
import {TOKEN} from '../utils/consts';

const request = supertest(app);

test.before(async () => {
    await new Promise((resolve, reject) => mongoose.connect('mongodb://localhost/token-test').then(resolve).catch(reject));
    config.set('signups:enabled', true);
    await request.post('/user').send({
        username: 'ava',
        password: 'rocks'
    });
});

test.serial('token:Success', async t => {
    t.plan(3);

    const res = await request.post('/token').send({
        username: 'ava',
        password: 'rocks'
    });

    t.is(res.status, 201);
    t.is(res.body.data.token.length, 172);
    t.is(res.body.data.expiresIn, 3600);
});

test.serial('token:Failure:password', async t => {
    t.plan(2);

    const res = await request.post('/token').send({
        username: 'ava',
        password: 'sucks'
    });

    t.is(res.status, TOKEN.INVALID_DETAILS.status);
    t.is(res.body.message, TOKEN.INVALID_DETAILS.message);
});

test.serial('token:Failure:username', async t => {
    t.plan(2);

    const res = await request.post('/token').send({
        username: 'eve',
        password: 'rocks'
    });

    t.is(res.status, TOKEN.INVALID_DETAILS.status);
    t.is(res.body.message, TOKEN.INVALID_DETAILS.message);
});

test.serial('token:Failure:no-body', async t => {
    t.plan(2);

    const res = await request.post('/token').send({});

    t.is(res.status, TOKEN.INVALID_DETAILS.status);
    t.is(res.body.message, TOKEN.INVALID_DETAILS.message);
});

test.serial('token:Failure:no-password-field', async t => {
    t.plan(2);

    const res = await request.post('/token').send({
        username: 'ava'
    });

    t.is(res.status, TOKEN.MISSING_PARAM.status);
    t.is(res.body.message, TOKEN.MISSING_PARAM.message);
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
