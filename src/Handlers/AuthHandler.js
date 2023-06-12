import { naturalDelay } from '../Helpers.js';

export default class AuthHandler {
    page;
    constructor(page) {
        this.page = page;
    }

    async authenticate(page) {
        await page.goto('https://secure.sbanken.no/Authentication');
        await this.ensureCookiesAreAccepted();
        await this.ensureLoggedIn();
        await this.page.goto('https://secure.sbanken.no/Personal/ApiBeta/Info');
    }

    async ensureCookiesAreAccepted() {
        const text = 'Godta alle cookies';
        const button = await this.page.getByRole('button', { name: text, exact: true });
        if (await button.isVisible()) {
            await button.click();
        }
    }

    async ensureLoggedIn() {
        if (await this.isLoggedIn()) {
            return;
        } else {

            // Click "BankID"
            await this.page.click('.list.list--description > *:nth-child(2)');

            // Fill social security number and submit
            await this.page.type('input[name="Ssn.Value"]', process.env.SOCIAL_SECURITY_NUMBER);
            await this.page.click('input[type="submit"]');

            // Wait for BankID-page to load
            await this.page.waitForURL('https://login.bankid.no/');

            // Click "BankID with app"
            await this.page.getByRole('button', { name: 'BankID with app' }).click();
    
            // Wait for BankID-frame to appear
            await this.page.waitForSelector('iframe[title="BankID"]');

            // Fill password
            await this.page.frameLocator('[title="BankID"]').getByLabel('Your BankID password').fill(process.env.BANKID_PASSWORD);

            // Submit
            await this.page.frameLocator('[title="BankID"]').getByRole('button', { name: 'Next' }).click();
        }
        if (!await this.wasLoggedIn()) {
            throw new Error('Login failed!');
        }
    }

    async wasLoggedIn() {
        await this.page.waitForNavigation();
        return this.isLoggedIn();
    }

    isLoggedIn() {
        return Promise.any([
            this.page.locator('a[href="/Authentication"]').waitFor().then(() => false),
            this.page.locator('a[href="/Home/Logout"]').waitFor().then(() => true),
        ]).catch(() => {
            throw 'Missing button';
        });
    }
}