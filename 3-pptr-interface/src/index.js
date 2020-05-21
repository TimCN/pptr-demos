/*
 * @Author: Tim.Huang 
 * @Date: 2020-03-27 18:12:27 
 * @Last Modified by: Tim.Huang
 * @Last Modified time: 2020-05-21 17:01:59
 */


const puppeteer = require("puppeteer-core")
const chalk = require('chalk');
const executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const headless = false
const devtools = true
const ssoUrl = 'https://github.com/login'
const userName = process.env.GH_LOGIN_USERNAME.trim()
const passWord = process.env.GH_LOGIN_PWD.trim()
// const userName= "userName"     // github账号
// const passWord= "***********"  // github密码

let browser;


const main = async () => {
  // 创建一个页面对象（含数据拦截监听）
  const page = await getPage()
  // 进入 erp login 页面
  await page.goto(ssoUrl)
  // 填写表单信息
  await page.type('#login_field', userName)
  await page.type('#password', passWord)
  // 提交表单
  await page.$eval('input[type="submit"]', el => el.click())
}

main();

async function getPage() {

  browser = browser || await puppeteer.launch({ executablePath, headless, devtools })
  const page = await browser.newPage()

  // 监听接口请求
  await page.setRequestInterception(true)
  page.on("request", onRequestHandler)
  // 监听接口响应
  page.on("response", onResponseHandler)
  return page

}

async function onRequestHandler(req) {
  // 网络请求处理器
  const method = req.method()
  if (/post/i.test(method)) {
    let data = req.postData()
    console.log(chalk.green(">>>>>>>>"), method, " ", req.url())
    console.log(chalk.green(">>> data:"), data)
  }
  await req.continue()
}

async function onResponseHandler(res) {
  // 网络响应处理器
  const method = res._request.method()
  const headers = res.headers()

  // 忽略动态表单提交
  if (/post/i.test(method) && res.status() === 200) {

    try {
      const data = await res.json()
      console.log("headers.accept====================", headers.accept)
      console.log(chalk.blue("<<<<<<<<"), method, " ", res._request._url)
      console.log(chalk.blue("<<< data:"), JSON.stringify(data))
    } catch (error) {
      // UN HANDLE
    }

  }
  return res
}