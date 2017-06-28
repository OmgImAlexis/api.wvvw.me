import os from 'os';
import cluster from 'cluster';

import mongoose from 'mongoose';

import {version} from '../../package';
import app from './main';
import config from './config';
import log from './log';

const numCPUs = os.cpus().length;
const port = process.env.PORT || config.get('app.port');
const db = process.env.MONGO_URL || config.get('database.url');

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // https://stackoverflow.com/a/34873180/2311366
    // If a worker dies, log it to the console and start another worker.
    cluster.on('exit', ({process}) => {
        log.error(`Worker ${process.pid} died.`);
        cluster.fork();
    });

    // Log when a worker starts listening
    cluster.on('listening', ({process}) => {
        log.info(`Worker started with PID ${process.pid}.`);
    });
} else {
    if (config.get('database.enabled')) {
        mongoose.connect(db).then(() => {
            log.info(`Connected to ${db}`);
        }).catch(err => {
            log.error(err);
            process.exit(1);
        });
    } else {
        log.info('Starting without database');
    }

    app.listen(port, () => {
        const name = config.get('app.name') || `Your personal API`;
        log.info(`${name} ${version} is running on port ${port}.`);
    });
}
