import * as dotenv from 'dotenv';
import Process from './Process.js';
dotenv.config();

Process.start();

process.on('SIGINT', () => {
    process.exit(0);
});
