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
      throw new Error("Search Term can't be empty. (Retrieve all foods by searching with '*')")
    }

    const options = {
      query: searchTerm
    }

    if (searchOptions !== undefined) {
      Object.assign(options, searchOptions)
    }

    const qs = options ? '&' + querystring.stringify(options) : ''

    const url = `/v1/foods/search?api_key=${this.api_key}${qs}`
    const config = {
      method: 'GET'
    }
    return this.request(url, config)
  }

  details (fdcid, { format, nutrients } = { }) {
    if (fdcid === undefined) {
      throw new Error("FDC ID can't be empty.")
    } else if (isNaN(fdcid) || String((Math.abs(fdcid))).length < 6) {
      throw new Error('Wrong FDC ID format.')
    }

    const options = {}

    if (format !== undefined) {
      switch (format) {
        case 1:
          options.format = 'abridged'
          break
        case 2:
          options.format = 'full'
          break
        default:
          throw new Error("Possible Formats: '1' = abridged, '2' = full")
      }
    }

    if (nutrients !== undefined) {
      options.nutrients = nutrients
    }

    const qs = options ? '&' + querystring.stringify(options) : ''

    const url = `/v1/food/${fdcid}?api_key=${this.api_key}${qs}`

    const config = {
      method: 'GET'
    }
    return this.request(url, config)
  }

  list (fdcIds, { format, nutrients } = { }) {
    const isArrayValid = (currentValue) => {
      if (typeof currentValue !== 'number' || String(Math.abs(currentValue)).length < 6) {
        return false
      } else {
        return true
      }
    }

    if (fdcIds === undefined) {
      throw new Error("FDC IDs can't be empty. At least one FDC ID required.")
    } else if (!Array.isArray(fdcIds) || fdcIds.length === 0 || !fdcIds.every(isArrayValid)) {
      throw new Error('FDC IDs must be an array of at least one number.')
    }

    const options = {
      fdcIds: fdcIds
    }

    if (format !== undefined) {
      switch (format) {
        case 1:
          options.format = 'abridged'
          break
        case 2:
          options.format = 'full'
          break
        default:
          throw new Error("Possible Formats: '1' = abridged, '2' = full")
      }
    }

    if (nutrients !== undefined) {
      options.nutrients = nutrients
    }

    const qs = options ? '&' + querystring.stringify(options) : ''

    const url = `/v1/foods/?api_key=${this.api_key}${qs}`

    const config = {
      method: 'GET'
    }
    return this.request(url, config)
  }
}

module.exports = FoodDataCentral
