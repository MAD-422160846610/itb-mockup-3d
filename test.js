const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('requestfailed', request => console.log('FAILED:', request.url(), request.failure().errorText));
  await page.goto('https://mad-422160846610.github.io/itb-mockup-3d/', { waitUntil: 'networkidle2' });
  await browser.close();
})();
