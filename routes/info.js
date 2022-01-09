const express = require('express')
const pup = require('puppeteer');
// const Scrapper = require('../Utils/scrapper')
// const { route } = require('express/lib/application')

const router = express.Router()

router.route('/:commodityID')
    .get(async(req,res) => {
        const URL = process.env.SCRAPING_URL;
        const Commodity = req.params.commodityID;

        (async () =>{
            const browser = await pup.launch({
                headless: true
            });
            const page = await browser.newPage();
        
            await page.setViewport({
                width: 1200,
                height: 800
            });
        
            // await page.setDefaultNavigationTimeout(10000)
        
            await page.goto(URL,{
                waitUntil: 'networkidle0'
            })
        
            await page.waitForSelector('select#CommoditiesId');
            await page.select('select#CommoditiesId', Commodity);
        
            setTimeout(async () => {
                const contant = await page.$$eval('tbody > tr', rows => {
                    return Array.from(rows, row => {
                        const col = row.querySelectorAll('td');
                        return Array.from(col, c => c.textContent)
                    })
                })
        
                const data = []
                let date = ''
        
                for(let i = 0; i < contant.length; i++){
        
                    if(contant[i][0].includes('\n')){
                        const newString = contant[i][0].replace('\n'," ")
                        date = newString.trim()
                    }else{
                        const details = {
                            APMC: contant[i][0],
                            Variety: contant[i][1],
                            Unit: contant[i][2],
                            Quantity: contant[i][3],
                            Lrate: contant[i][4],
                            Hrate: contant[i][5],
                            Modal: contant[i][6],
                            date: date
                        }
                        data.push(details);
                    }
                }
                await browser.close()
        
                await res.status(200).json(data)
            }, 3000)
        })();
       
    })

module.exports = router