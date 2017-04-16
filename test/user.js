import test from 'ava';
import supertest from 'supertest';
import mongoose from 'mongoose';

import {app, config} from '../';

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

    t.is(res.status, 201);
    t.is(res.body.message, 'User created successfully.');
});

test.serial('signup:DuplicateUsername', async t => {
    t.plan(2);

    const res = await request.post('/user').send({
        username: 'ava',
        password: 'rocks'
    });

    t.is(res.status, 503);
    t.is(res.body.message, 'Please choose another username.');
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
