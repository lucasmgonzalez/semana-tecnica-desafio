window.App = {
  element: null,

  init: function() {
    this.element = document.getElementById("app");
  },

  on: function(selector) {
    return this.element.querySelector(selector);
  }
};

window.AnimeAPI = {
  endpoint: "https://kitsu.io/api/edge",

  getAnime: function(data) {
    return fetch(`${this.endpoint}/anime/${data}`).then(resp => resp.json());
  },

  searchAnime: function(str) {
    return fetch(this.endpoint + "/anime?filter[text]=" + str).then(res => res.json());
  }
};

window.SearchForm = {
  targetSelector: "#animesearch",
  debounce: null,
  handle: function() {
    let value = document.querySelector(this.targetSelector).value;
    if (this.debounce) clearTimeout(this.debounce);

    if (value.length > 2) {
      this.debounce = setTimeout(function() {
        AnimeAPI.searchAnime(value).then(resp => {
          SearchForm.buildResults(resp.data);
        });
      }, 500);
    }
  },

  buildResults: function(results) {
    App.on("#search-results").innerHTML = "";

    for (i = 0; i < results.length; i++) {
      let el = this.buildResultElement(results[i]);

      App.on("#search-results").appendChild(el);
    }
  },

  buildResultElement: function(result) {
    let el = document.createElement("div");
    el.classList.add("anime-item");

    let title = document.createElement("div");
    title.innerText = result.attributes.canonicalTitle;
    title.classList.add("anime-title");

    let image = document.createElement("img");
    image.classList.add("anime-poster");
    image.setAttribute("src", result.attributes.posterImage.small);

    let synopsis = document.createElement("p");
    synopsis.classList.add("anime-synopsis");
    synopsis.innerText = result.attributes.synopsis;

    el.appendChild(title);
    el.appendChild(image);
    /* el.appendChild(synopsis); */

    return el;
  }
};

document.addEventListener("DOMContentLoaded", function() {
  App.init();
});
