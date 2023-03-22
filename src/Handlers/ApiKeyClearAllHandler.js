export default class ApiKeyClearAllHandler {
    static elementQuery = '';
    page;

    constructor(page) {
        this.page = page;
    }

    async handle() {
        const apiKeyCount = (await this.page.$$('form[name*="passRemove"]')).length;
        console.log(`Found ${apiKeyCount} API-keys.`);

        let deleteButton = await this.getFirstDeleteButton();
        while (deleteButton) {
            await deleteButton.click();
            await this.page.waitForLoadState('domcontentloaded');
            deleteButton = await this.getFirstDeleteButton();
            if (!deleteButton) {
                break;
            }
        }
        if (apiKeyCount > 0) {
            console.log('All API-keys are now deleted.');
        }
    }

    async getFirstDeleteButton() {
        return await this.page.$('a[data-remove-password*="passRemove"]:first-of-type');
    }
}