export default class ApiKeyValidateHandler {
    page;

    constructor(page) {
        this.page = page;
    }

    getPassword() {
        return process.argv?.[3];
    }

    async handle() {

        const password = this.getPassword();
        if (!password) {
            throw new Error('Password not specified');
        }

        const passwordField = await this.page.$('input[name="validatePasswordModel.Password"]');
        await passwordField.fill(password);

        const button = await this.page.$('input[type="submit"][value="Valider passord"]');
        await button.click();
        await this.page.waitForLoadState('domcontentloaded');

        if (await this.isValid()) {
            console.log('API-key valid!');
        } else {
            console.error('API-key not valid!');
        }
    }

    isValid() {
        return Promise.any([
            this.page.getByText('Passordet er gyldig').waitFor().then(() => true),
            this.page.getByText('Passordet ditt er ikke gyldig').waitFor().then(() => false),
        ]).catch(() => {
            throw 'Missing button';
        });
    }
}