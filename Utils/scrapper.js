const pup = require('puppeteer');

// const URL=  'https://msamb.com/ApmcDetail/ArrivalPriceInfo';

// const Commodity = '08035';

( async (URL, Commodity) =>{
    const browser = await pup.launch({
        headless: true
    });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1200,
        height: 800
    });

    await page.setDefaultNavigationTimeout(10000)

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

        // const json = JSON.stringify(data)
        // console.log(json)

        await browser.close()

        return data
    }, 3000)
})();