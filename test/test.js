require('jest-extended')
require('jest-chain')
const FoodDataCentral = require('./../')

jest.setTimeout(10000)

require('dotenv').config()

const API_KEY = process.env.FOODDATACENTRAL_API_KEY

test('should be defined', () => {
    expect(FoodDataCentral).toBeDefined()
})

test('should return new FoodDataCentral client', () => {
    const client = new FoodDataCentral(API_KEY)
    expect(client.search).toBeDefined()
    expect(client.details).toBeDefined()
})

test('can search for foods with and without additional parameters.', async () => {
    const client = new FoodDataCentral(API_KEY)
    const searchresult1 = await client.search("banana")
    const searchresult2 = await client.search("cheese", {pageSize: 4})

    expect(typeof searchresult1).toBe('object')
    expect(typeof searchresult2).toBe('object')
    expect(Object.keys(searchresult2.foods).length).toBe(4)
})

test('must pass search term to get results', async () => {
    const client = new FoodDataCentral(API_KEY)
    expect(() => client.search()).toThrow(Error)
})

test('can pass in id to get food details', async () => {
    const client = new FoodDataCentral(API_KEY)
    const detailresult = await client.details(1103063)
    expect(typeof detailresult).toBe('object')
})

test('must pass in id food details', async () => {
    const client = new FoodDataCentral(API_KEY)
    expect(() => client.details()).toThrow(Error)
})

test('fdcid must have at least 6 digits', async () => {
    const client = new FoodDataCentral(API_KEY)
    expect(() => client.details(12345)).toThrow(Error)
})

test('fdcid must be a number', async () => {
    const client = new FoodDataCentral(API_KEY)
    expect(() => client.details("number")).toThrow(Error)
})

test('FDC API returns errors.', async () => {
    const client = new FoodDataCentral(API_KEY)
    expect(() => client.details(100000)).rejects.toThrow()
})