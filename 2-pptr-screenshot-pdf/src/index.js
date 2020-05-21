/*
 * @Author: Tim.Huang 
 * @Date: 2020-03-27 18:05:21 
 * @Last Modified by:   Tim.Huang 
 * @Last Modified time: 2020-03-27 18:05:21 
 */


const puppeteer = require("puppeteer-core")
const executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const site = 'https://www.jd.com'

;(async () => {
  const browser = await puppeteer.launch({ executablePath });
  const page = await browser.newPage();
  await page.goto(site);
  // 截图
  await page.screenshot({ path: 'screenshot.png' });
  // 生成pdf
  await page.emulateMedia('screen');
  await page.pdf({ path: 'page.pdf' });
  await browser.close();
})();