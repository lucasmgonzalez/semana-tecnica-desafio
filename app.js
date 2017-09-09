window.App = {
  element: null,

  /* sets App.element to .app */
  /* runs SearchForm.init() */
  init() {
    this.element = document.getElementsByClassName('app')[0];
    SearchForm.init();
  },

  /* shortcut for .app.querySelector() */
  on(selector) {
    return this.element.querySelector(selector);
  },

  /* handy create element function, works with recursion */
  
};

window.AnimeAPI = {
  endpoint: 'https://kitsu.io/api/edge',

  getAnime(data) {
    return fetch(`${this.endpoint}/anime/${data}`).then(resp => resp.json());
  },

  searchAnime(str) {
    return fetch(`${this.endpoint  }/anime?filter[text]=${  str}`).then(res => res.json());
  },
};

window.SearchForm = {
  targetSelector: '.animesearch',
  debounce: null,
  loadingSpinner: document.getElementsByClassName("loading-spinner")[0],
  element: null,

  /* sets SearchForm.element to .animesearch */
  /* adds an EventListener to keyup on the search box,
      which runs SearchForm.handle() on key up */
  init() {
    this.element = App.on(this.targetSelector);

    /* if this.element, set the eventListener */
    this.element && this.element.addEventListener('keyup', this.handle);
  },

  /* search box logic */
  handle() {
    const value = SearchForm.element.value;
    if (this.debounce) clearTimeout(this.debounce);    

    if (value.length > 2) {
      this.debounce = setTimeout(() => {
        /* runs AnimeAPI.searchAnime(), getting results
            from the API */
        AnimeAPI.searchAnime(value).then(resp => {
          SearchForm.buildResults(resp.data);
        });
        /* shows the loading spinner */
        SearchForm.loadingSpinner.classList.add("opacityone");
      }, 500);
    }
  },

  buildNoResultsFound(){
    let result = App.on('.search-results');
    let el = Helper.crel({ tag: 'h2', text: "No results found!" });
    result.appendChild(el);
  },

  /* renders the search result elements,
      but first removes any results that might be there */
  buildResults(results) {
    let result = App.on('.search-results');
    result.innerHTML = '';

    let logo = document.getElementsByClassName('body-logo')[0];

    if (logo) logo.remove();

    for (i = 0; i < results.length; i++) {
      const el = this.buildResultElement(results[i]);

      result.appendChild(el);
    }
    if(results.length === 0){
      this.buildNoResultsFound();
    }

    /* hides the loading spinner */
    SearchForm.loadingSpinner.classList.remove("opacityone");
  },

  /* uses crel to create the result elements themselves */
  buildResultElement(result) {
    const el = Helper.crel({ tag: 'a' });
    el.setAttribute('href', `anime.html?id=${result.id}`);
    el.classList.add('anime-item');
    el.style.backgroundImage = `url(${result.attributes.posterImage.large})`;

    const title = Helper.crel({ tag: 'div' });
    title.innerText = result.attributes.canonicalTitle;
    title.classList.add('anime-title');

    el.appendChild(title);

    return el;
  },
};

window.AnimePage = {
  /* uses AnimeAPI.getAnime to get info about an anime by ID */
  getAnimeDetails: () => {
    AnimeAPI.getAnime(window.location.search.split('?')[1].split('id=')[1]).then((res) => {
      AnimePage.buildAnimePage(res);
    });
  },

  show() {
    const el = document.getElementsByClassName('anime-page')[0];
    el.classList.add('active');
  },

  /* renders the elements on the anime page using
      the info retrieved from the API */
  buildAnimePage: (obj) => {
    const aninfo = obj.data.attributes;
    const relationships = obj.data.relationships;

    const el = document.getElementsByClassName('anime-page')[0];

    const img = Helper.crel({ tag: 'img' });
    img.setAttribute('src', aninfo.coverImage ? aninfo.coverImage.original : aninfo.posterImage.original);
    img.addEventListener('load', () => {
      AnimePage.show();
    });

    App.on('.anime-page').appendChild(
      Helper.crel({
        tag: 'img',
        className: 'anime-poster',
        attributes: {
          src: aninfo.posterImage.medium,
        },
      }),
    );

    /* good example on how to use crel */
    App.on('.anime-page').appendChild(
      Helper.crel({
        tag: 'div',
        className: 'anime-info-container',
        attributes: {
          id: 'idzin',
          'data-truc': 'datazin',
        },
        children: [
          {
            tag: 'h2',
            className: 'anime-info-title',
            text: aninfo.canonicalTitle,
          },
          {
            tag: 'h3',
            className: 'anime-info-releasedate',
            text: 'Released in: ',
            children: [
              {
                tag: 'span',
                className: 'anime-info-releasedateyear',
                text: aninfo.startDate.substring(0, 4),
              },
            ],
          },
          {
            tag: 'h4',
            className: 'anime-info-synopsis',
            text: aninfo.synopsis,
          },
          {
            tag: 'h4',
            className: 'anime-info-popularity',
            text: `Popularity: #${  aninfo.popularityRank}`,
          },
        ],
      }),
    );

    const imageLoad = document.createElement('img');

    /* waits for imageLoad to load, then sets the background */
    aninfo.coverImage ? imageLoad.src = aninfo.coverImage.original : imageLoad.src =  aninfo.posterImage.original;

    if(aninfo.coverImage){
    imageLoad.addEventListener('load', function (element) {
      el.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9) ), url(${aninfo.coverImage.original})`;
      delete this;
    });  
    }
    else{
      el.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9) ), url(${aninfo.posterImage.original})`;
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
