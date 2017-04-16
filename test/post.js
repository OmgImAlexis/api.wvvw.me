import test from 'ava';
import supertest from 'supertest';
import mongoose from 'mongoose';

import {app, config} from '../';

const request = supertest(app);

test.before(async () => {
    await new Promise((resolve, reject) => mongoose.connect('mongodb://localhost/post-test').then(resolve).catch(reject));
    config.set('signups:enabled', true);
    await request.post('/user').send({
        username: 'ava',
        password: 'rocks'
    });
});

test.serial('post:create:Success', async t => {
    t.plan(2);

    const users = await request.get('/user');
    const token = await request.post('/token').send({
        username: 'ava',
        password: 'rocks'
    });
    const res = await request.post('/post').set('Authorization', `Bearer ${token.body.token}`).send({
        title: 'ava',
        content: 'ava is the best',
        author: users.body[0]._id
    });

    t.is(res.status, 201);
    t.is(res.body.message, 'Post created successfully.');
});

test('get:All', async t => {
    t.plan(2);

    const res = await request.get('/post');

    t.is(res.status, 200);
    t.is(res.body.length, 1);
});

test('get:byId:Success', async t => {
    t.plan(3);

    const posts = await request.get('/post');
    const res = await request.get(`/post/${posts.body[0]._id}`);

    t.is(res.status, 200);
    t.is(res.body[0].title, 'ava');
    t.is(res.body[0].content, 'ava is the best');
});

test('get:byId:Failure', async t => {
    t.plan(2);

    const res = await request.get(`/post/---------------`);

    t.is(res.status, 422);
    t.is(res.body.message, `Not sure what you just sent me but it wasn't an ObjectId`);
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
