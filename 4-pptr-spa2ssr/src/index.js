/*
 * @Author: Tim.Huang 
 * @Date: 2020-03-30 17:42:14 
 * @Last Modified by: Tim.Huang
 * @Last Modified time: 2020-05-21 18:14:39
 */



const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const puppeteer = require('puppeteer-core');

const executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const PORT = 3080;
const urlPrefix = "http://localhost:3000"
// 缓存
const RENDER_CACHE = new Map();


const app = express();
app.get('/', async (req, res, next) => {
  const {html, ttRenderMs} = await ssr(`${urlPrefix}/`);
  res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
  return res.status(200).send(html); 
});

// 资源转发
// app.use('/js', async (req, res,next) => {
//   return res.status(200).send("done")
// });
app.use('/static', createProxyMiddleware({ target: urlPrefix, changeOrigin: true }));
app.use('/manifest.json', createProxyMiddleware({ target: urlPrefix, changeOrigin: true }));
app.use('/logo192.png', createProxyMiddleware({ target: urlPrefix, changeOrigin: true }));
app.use('/logo512.png', createProxyMiddleware({ target: urlPrefix, changeOrigin: true }));
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));


async function ssr(url) {
  if (RENDER_CACHE.has(url)) {
    return { html: RENDER_CACHE.get(url), ttRenderMs: 0 };
  }

  const start = Date.now();

  const browser = await puppeteer.launch({executablePath});
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
  } catch (err) {
    console.error(err);
    throw new Error('page.goto/waitForSelector timed out.');
  }
  const html = await page.content(); 
  await browser.close();

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

  RENDER_CACHE.set(url, html);

  return { html, ttRenderMs };
}