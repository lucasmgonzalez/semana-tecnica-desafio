window.App = {
  element: null,

  init: function() {
    this.element = document.getElementById("app");
  },

  on: function(selector) {
    return this.element.querySelector(selector);
  },

  crel: params => {
    let el, a;
    el = document.createElement(params.tag);

    params.className ? (el.className = params.className) : null;

    if (params.attributes) {
      for (a in params.attributes) {
        el.setAttribute(a, params.attributes[a]);
      }
    }

    params.text && el.appendChild(document.createTextNode(params.text));

    if (params.children && params.children.length) {
      for (i = 0; i < params.children.length; i++) {
        el.appendChild(
          params.children[i] instanceof window.HTMLElement
            ? params.children[i]
            : App.crel(params.children[i])
        );
      }
    }

    return el;
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
    let el = document.createElement("a");
    el.setAttribute("href", `anime.html?id=${result.id}`);
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

window.AnimePage = {
  getAnimeDetails: () => {
    console.log("working");
    AnimeAPI.getAnime(window.location.search.split("?")[1].split("id=")[1]).then(res => {
      AnimePage.buildAnimePage(res);
    });
  },

  buildAnimePage: obj => {
    console.log(obj.data.attributes);

    let aninfo = obj.data.attributes;
    let relationships = obj.data.relationships;

    document.getElementById(
      "anime-results"
    ).style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9) ), url(${aninfo
      .coverImage.original})`;
    document.getElementById("anime-results").style.backgroundRepeat = "no-repeat";
    document.getElementById("anime-results").style.backgroundSize = "cover";

    App.on("#anime-results").appendChild(
      App.crel({
        tag: "img",
        className: "hellomoto",
        attributes: {
          src: aninfo.posterImage.medium
        }
      })
    );

    App.on("#anime-results").appendChild(
      App.crel({
        tag: "div",
        className: "anime-info-container",
        attributes: {
          id: "idzin",
          "data-truc": "datazin"
        },
        children: [
          {
            tag: "h2",
            className: "anime-info-title",
            text: aninfo.canonicalTitle
          },
          {
            tag: "h3",
            className: "anime-info-releasedate",
            text: "Released in: ",
            children: [
              {
                tag: "span",
                className: "anime-info-releasedateyear",
                text: aninfo.startDate.substring(0, 4)
              }
            ]
          },
          {
            tag: "h4",
            className: "anime-info-synopsis",
            text: aninfo.synopsis
          },
          {
            tag: "h4",
            className: "anime-info-popularity",
            text: "Popularity: #" + aninfo.popularityRank
          }
        ]
      })
    );
  }
};

document.addEventListener("DOMContentLoaded", function() {
  App.init();
});
