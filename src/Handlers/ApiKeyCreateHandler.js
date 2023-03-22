export default class ApiKeyCreateHandler {
    static async handle(page) {
        // Create new API key
        await page.click('input[type="submit"][value="Bestill nytt passord"]');
        await page.waitForSelector('#newApiBetaUserPassword');
        const apiKey= (await page.locator('#newApiBetaUserPassword').textContent()).trim();
        console.log('API key:', apiKey);
    }
}