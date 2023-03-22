import playwright from 'playwright';

export class Browser {
    #userAgent;
    #browserLocale;
    user;
    browser;
    context;
    page;

    constructor({ userAgent, browserLocale }) {
        this.#userAgent = userAgent;
        this.#browserLocale = browserLocale;
    }

    static async init({ userAgent, browserLocale }) {
        const instance = new Browser({ userAgent, browserLocale });
        instance.browser = await playwright.chromium.launch({
            headless: process.env.BROWSER_HEADLESS == 'true',
        });
        instance.context = await instance.browser.newContext({
            locale: this.browserLocale,
            userAgent: this.userAgent,
        });
        return instance;
    }

    async newPage() {
        this.page = await this.context.newPage();
        return this.page;
    }
}