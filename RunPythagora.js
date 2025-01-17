#!/usr/bin/env node
let { checkDependencies } = require('./src/helpers/starting.js');
try {
    checkDependencies();
} catch (e) {
    console.error(e.message);
}

let { mode, initScript } = require('./src/utils/argumentsCheck.js');
const Pythagora = require('./src/Pythagora.js');

const path = require('path');

global.Pythagora = new Pythagora(mode);

process.on('uncaughtException', (error) => {
    console.error('The app has crashed!');
    console.error('This is likely not related to Pythagora, but the app itself.');
    console.error(error);
    process.exit(1);
});

(async () => {
    await global.Pythagora.runRedisInterceptor();
    require(path.join(process.cwd(), initScript));

    if (mode === 'test') {
        console.log('Running tests in 3 seconds...');
        setTimeout(() => {
            require('./RunPythagoraTests.js');
        }, 3000);
    }
})();

