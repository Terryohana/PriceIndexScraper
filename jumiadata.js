const puppeteer = require('puppeteer');
const fs = require('fs');

const urls = [
{
url: 'https://www.jumia.co.ke/',
query: 'kabras sugar',
country: "Kenya"
},
{
url: 'https://www.jumia.ug/',
query: 'lugazi sugar',
country: "Uganda"
},
{
url: 'https://www.jumia.com.ng/',
query: 'dangote sugar',
country: "Nigeria"
}
];

(async () => {
    const browser = await puppeteer.launch({headless:false});
    let allData = []
    for(let i = 0; i < urls.length; i++) {
        const page = await browser.newPage();
        await page.goto(urls[i].url);
        await page.type('input[name="q"]', urls[i].query);
        await page.waitForTimeout(4000)
        await page.click('#search > button');
        await page.waitForTimeout(4000)
        await page.click('#search > button');
        await page.waitForTimeout(2000)
        await page.waitForSelector('.info .name');
        await page.waitForSelector('.prc');
        const productNames = await page.$$eval('.info .name', elements => elements.map(el => el.innerText));
        const productPrices = await page.$$eval('.prc', elements => elements.map(el => el.innerText));
        let products = [];
        for (let j = 0; j < productNames.length; j++) {
            products.push({
                "name": productNames[j],
                "price": productPrices[j]
            });
        }
        let data = {
            "country": urls[i].country,
            "sugar_name": urls[i].query,
            "products": products
        }
        allData.push(data);
    }
    fs.writeFileSync(`sugar_prices.json`, JSON.stringify(allData));
    await browser.close();
})()
