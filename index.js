import mongoose from 'mongoose';

import app from './main';
import config from './config';
import log from './log';
import {version} from './package';

if (config.get('database.enabled')) {
    mongoose.connect(process.env.MONGO_URL || config.get('database.url'));
} else {
    log.info('Starting without database');
}

app.listen(config.get('app.port'), () => {
    const name = config.get('app.name') || `Your personal API`;
    log.info(`${name} ${version} is running on port ${config.get('app.port')}.`);
});
