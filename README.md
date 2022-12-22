# Sbanken API secret extractor
This script obtains Sbanken API secret using a headaless programmatic web browser with [Playwright](https://playwright.dev/).

## Setup
1. Ensure that you have [installed the browser binaries](https://playwright.dev/docs/browsers#managing-browser-binaries).
2. Run `npm install`
3. Copy file `.env.example` to `.env` and fill in values
4. Run `node index.js`
5. Inspect your glorious API secret which you can use for your projects!

## The why?
Idk, I wanted to see if it was possible to do a programmatic login that will handle BankID. I also wanted an automattic renewal of my Sbanken API tokens since I'm lazy...