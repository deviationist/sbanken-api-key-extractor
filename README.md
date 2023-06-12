# Sbanken API key extractor
This script obtains/deletes/validates Sbanken API key using a headaless programmatic web browser with [Playwright](https://playwright.dev/).

Please read through the code as blindly trusting it would be stupid! It will log into your Sbanken account and you should ensure that there is not funny business being done!

Note that this code will log in with "BankID with app", so "BankID on mobile" is not yet implemented. Feel free to make a PR!

## Setup
1. Ensure that you've [enrolled in the Beta-program](https://secure.sbanken.no/Home/Settings/BetaProgram) to access the API service.
2. Ensure that you've [installed the browser binaries](https://playwright.dev/docs/browsers#managing-browser-binaries).
3. Run `npm install`
4. Copy file `.env.example` to `.env` and fill in values
5. Ready to go!

### Commands

`npm run create`<br>
Creates a new API-key.

`npm run clear-all`<br>
Deletes all existing API-keys.

`npm run validate [api-key]`<br>
Validate the API-key.


## Debugging
To see what's going on you can set `BROWSER_HEADLESS` to `false` to make Playwright display the Chromium with a GUI.

## The why?
Idk, I wanted to see if it was possible to do a programmatic login that would handle BankID. I also wanted an automattic renewal of my Sbanken API tokens since I'm lazy...
