const fetch = require("isomorphic-unfetch")
const querystring = require("querystring")

class FoodDataCentral {
    constructor(apiKey = "DEMO_KEY") {
        this.api_key = apiKey
        this.basePath = "https://api.nal.usda.gov/fdc"
    } 

    request(endpoint = "", options = {}) {
        let url = this.basePath + endpoint

        let headers = {
            'Content-type': 'application/json'
        }

        let config = {
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

    search(search_term, searchOptions = "") {
        if (search_term === undefined) {
            throw new Error("Error. Search Term can't be empty. (Retrieve all foods by searching with '*')")
        }

        let options = {
            "query": search_term
        }

        if (searchOptions != undefined) {
            Object.assign(options, searchOptions)
        }
        

        let qs = options ? "&" + querystring.stringify(options) : ""

        let url = "/v1/foods/search?api_key=" + this.api_key + qs
        let config = {
            method: 'GET'
        }
        return this.request(url, config)
    }

    details(fdcid, detailOptions = "") {
        if (fdcid === undefined) {
            throw new Error("Error. FDC ID can't be empty.")
        } else if (String((Math.abs(fdcid))).length < 6) {
            throw new Error("Error. Wrong FDC ID format.")
        }

        let url = "/v1/food/" + fdcid + "?api_key=" + this.api_key

        let config = {
            method: 'GET'
        }
        return this.request(url, config)
    }
}

module.exports = FoodDataCentral