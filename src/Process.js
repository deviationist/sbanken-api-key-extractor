import { Browser } from './Browser.js';
import AuthHandler from './Handlers/AuthHandler.js';
import ApiKeyCreateHandler from './Handlers/ApiKeyCreateHandler.js';
import ApiKeyClearAllHandler from './Handlers/ApiKeyClearAllHandler.js';
import ApiKeyValidateHandler from './Handlers/ApiKeyValidateHandler.js';

export default class Process {
    action;
    browser;
    tab;
    constructor() {
        this.action = this.getAction();
    }

    async initiateBrowser() {
        this.browser = await Browser.init({
            userAgent: process.env.BROWSER_USER_AGENT,
            browserLocale: process.env.BROWSER_LOCALE,
            user: this.user,
        });
        this.tab = await this.browser.newPage();
    }

    getAction() {
        const action = process.argv?.[2];
        switch (action) {
            case 'create':
            case 'clear-all':
            case 'validate':
                return action;
            default:
                throw new Error('Invalid action');
        }
    }

    static async start() {
        const instance = new Process();
        await instance.initiateBrowser();

        const authHandler = new AuthHandler(instance.tab);
        await authHandler.authenticate(instance.tab);

        switch (instance.action) {
            case 'create':
                await ApiKeyCreateHandler.handle(instance.tab);
                break;
            case 'clear-all':
                const clearAllHandler = new ApiKeyClearAllHandler(instance.tab);
                await clearAllHandler.handle();
                break;
            case 'validate':
                const validateHandler = new ApiKeyValidateHandler(instance.tab);
                await validateHandler.handle();
                break;
            default:
                throw new Error('Could not resolve handler for action');
        }
        await Process.end(instance);
    }

    static async end(instance) {
        await instance.browser.browser.close();
        process.exit(0);
    }
}