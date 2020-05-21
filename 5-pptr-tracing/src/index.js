/*
 * @Author: Tim.Huang 
 * @Date: 2020-03-30 10:45:53 
 * @Last Modified by: Tim.Huang
 * @Last Modified time: 2020-04-10 15:30:09
 */

// chrome://tracing
const puppeteer = require("puppeteer-core");
const executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const site = 'https://www.jd.com';

(async () => {
  const browser = await puppeteer.launch({ executablePath });
  const page = await browser.newPage();
  await page.tracing.start({ path: 'trace.json' });
  await page.goto(site);
  const data = await page.tracing.stop();
  await browser.close();
})();
