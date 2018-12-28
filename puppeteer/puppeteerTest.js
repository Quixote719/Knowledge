const puppeteer = require('puppeteer');
const account = `719511478@qq.com`;
const password = `Faramita1990`;
(async () => {
  const browser = await puppeteer.launch({
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    // executablePath: '/Users/huqiyang/Documents/project/z/chromium/Chromium.app/Contents/MacOS/Chromium',
    //设置超时时间
    // timeout: 15000,
    //如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 关闭headless模式, 不会打开浏览器
    headless: false
  });//打开浏览器
  const page = await browser.newPage();//打开一个空白页
  await page.goto('https://www.douban.com/');//打开豆瓣网站
  await page.type('#form_email', account);
  await page.type('#form_password', password);
  await page.click('.bn-submit');
  await page.waitForNavigation({
    waitUntil: 'load'
  });//等待页面加载出来，等同于window.onload
  await page.screenshot({path: 'example.png'});//截个图
  await browser.close();//关掉浏览器
})();
