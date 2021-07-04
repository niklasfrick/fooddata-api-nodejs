const FoodDataCentral = require('./../')

require('dotenv').config()

const API_KEY = process.env.FOODDATACENTRAL_API_KEY

async function run() {
    const client = new FoodDataCentral(API_KEY)
    const searchresult1 = await client.list([123456], {format: 2, nutrients: [203, 204]})
    console.log(searchresult1)
}


run()