window.Helper = {
	toQueryString: function (params) {
		let esc = encodeURIComponent;
		return Object.keys(params)
			.map(k => esc(k) + "=" + esc(params[k]))
			.join("&");
    },
    
    crel: (params) => {
        let el,
          a;
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
                : Helper.crel(params.children[i]),
            );
          }
        }
    
        return el;
      },
};