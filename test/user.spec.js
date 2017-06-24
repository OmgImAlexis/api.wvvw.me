import test from 'ava';
import supertest from 'supertest';
import mongoose from 'mongoose';

import {app, config} from '../';
import {USER} from '../utils/consts';

const request = supertest('http://localhost:4040');

test.before(async () => {
    await new Promise((resolve, reject) => mongoose.connect('mongodb://localhost/user-test').then(resolve).catch(reject));
    config.set('signups:enabled', true);
});

test('signup:Success', async t => {
    console.log('started signup:Success');
    await request.get('/user').then(users => console.log(users.body)).catch(err => console.log(err));
    await request.post('/user').then(users => console.log(users.body)).catch(err => console.log(err));
    const res = await request.post('/user').send({
        username: 'ava',
        password: 'rocks'
    }).then(users => console.log(users.body)).catch(err => console.log(err));
    await request.get('/user').then(users => console.log(users.body)).catch(err => console.log(err));

    t.is(res.status, USER.CREATED.SUCCESS.status);
    t.is(res.body.message, USER.CREATED.SUCCESS.message);
    console.log('finished signup:Success');
});

test.after.always('guaranteed cleanup', () => {
    return new Promise((resolve, reject) => {
        mongoose.connection.dropDatabase().then(resolve).catch(reject);
    });
});
