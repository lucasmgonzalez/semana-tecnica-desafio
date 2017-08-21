window.App = {};

window.BeerAPI = {
    endpoint: "https://api.punkapi.com/v2",

    getBeers: function(data = {}) {
        return fetch(`${this.endpoint}/beers?${Helper.toQueryString(data)}`,)
        .then(resp => resp.json());
    },
};