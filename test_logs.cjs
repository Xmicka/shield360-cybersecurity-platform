const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const errors = [];
  const logs = [];
  
  page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.toString()));

  try {
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0', timeout: 5000 });
  } catch(e) {
    console.log("Navigation error:", e.message);
  }

  console.log("--- BROWSER ERRORS ---");
  errors.forEach(e => console.log(e));
  console.log("--- BROWSER LOGS ---");
  logs.forEach(l => console.log(l));
  
  // Wait to let animation settle
  await new Promise(r => setTimeout(r, 2000));
  const content = await page.content();
  console.log("--- BODY PREVIEW ---");
  console.log(content.substring(0, 500));

  await browser.close();
})();
