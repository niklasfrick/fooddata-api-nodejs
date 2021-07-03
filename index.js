'use strict'
const fetch = require('isomorphic-unfetch')
const querystring = require('querystring')

class FoodDataCentral {
  constructor (apiKey = 'DEMO_KEY') {
    this.api_key = apiKey
    this.basePath = 'https://api.nal.usda.gov/fdc'
  }

  request (endpoint = '', options = {}) {
    const url = this.basePath + endpoint

    const headers = {
      'Content-type': 'application/json'
    }

    const config = {
      ...options,
      ...headers
    }

    return fetch(url, config).then(r => {
      if (r.ok) {
        return r.json()
      }
      throw new Error(r.statusText)
    })
  }

  search (searchTerm, searchOptions = '') {
    if (searchTerm === undefined) {
      throw new Error("Error. Search Term can't be empty. (Retrieve all foods by searching with '*')")
    }

    const options = {
      query: searchTerm
    }

    if (searchOptions !== undefined) {
      Object.assign(options, searchOptions)
    }

    const qs = options ? '&' + querystring.stringify(options) : ''

    const url = '/v1/foods/search?api_key=' + this.api_key + qs
    const config = {
      method: 'GET'
    }
    return this.request(url, config)
  }

  details (fdcid, detailOptions = '') {
    if (fdcid === undefined) {
      throw new Error("Error. FDC ID can't be empty.")
    } else if (isNaN(fdcid) || String((Math.abs(fdcid))).length < 6) {
      throw new Error('Error. Wrong FDC ID format.')
    }

    const url = '/v1/food/' + fdcid + '?api_key=' + this.api_key

    const config = {
      method: 'GET'
    }
    return this.request(url, config)
  }
}

module.exports = FoodDataCentral
