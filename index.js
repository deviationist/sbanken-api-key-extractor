import playwright from 'playwright';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async';
import { rmSync } from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const takeScreenshots = true;
let screenshotInterval;
const filePath = process.cwd() + '/screenshots';
rmSync(filePath, { recursive: true, force: true });

const browser = await playwright.chromium.launch();
const context = await browser.newContext({
    headless: false,
});
const page = await context.newPage();

if (takeScreenshots) {
    let count = 0;
    screenshotInterval = setIntervalAsync(async () => {
        await page.screenshot({ path: `screenshots/${count}.png` });
        count++;
    }, 500);
}

await page.goto('https://secure.sbanken.no/Authentication');
await page.click('.list.list--description > *:nth-child(2)'); // Click "BankID"

// Fill social security number and submit
await page.type('input[name="Ssn.Value"]', process.env.SOCIAL_SECURITY_NUMBER);
await page.click('input[type="submit"]');

// Wait for BankID-frame to appear
await page.waitForSelector('iframe[title="BankID"]');

// Locate frame
const frame = page.frameLocator('[title="BankID"]');

// Input password and submit
const passwordField = frame.getByLabel('Ditt BankID-passord');
await passwordField.fill(process.env.BANKID_PASSWORD);
await frame.getByRole('button', { name: 'Neste' }).click();

// Wait until we're logged in
await page.waitForSelector('a.c-header-button[href="/Home/Logout"]');

// Create new API secret/password
await page.goto('https://secure.sbanken.no/Personal/ApiBeta/Info');
await page.click('input[type="submit"][value="Bestill nytt passord"]');
await page.waitForSelector('#newApiBetaUserPassword');
const apiSecret = (await page.locator('#newApiBetaUserPassword').textContent()).trim();

if (takeScreenshots) {
    clearIntervalAsync(screenshotInterval);
    await page.screenshot({ path: `screenshots/final.png` });
}

await browser.close();

console.log('API secret:', apiSecret);
