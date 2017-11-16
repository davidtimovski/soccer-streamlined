/// <reference path="./lib/classes.ts" />

let httpClient = new HttpClient();
let domHelper = new DomHelper();

httpClient.getJson('https://www.reddit.com/r/soccerstreams', result => {

  let app = new App(domHelper);
  let parser = new Parser();

  let posts = result.data.children;
  let matches = parser.getMatchesFromPosts(posts);
  
  if (matches.length > 0) {
    app.populateMatchesTable(matches);
  } else {
    domHelper.showInfoMessage('There are currently no available matches.');
  }

  DomHelper.hideElement(domHelper.loadingGif);

  DomHelper.showElement(domHelper.matchesTable);

  let searchInput = <HTMLInputElement>document.getElementById('search');
  searchInput.addEventListener('keyup', () => {
    app.filterMatches(searchInput.value);
  });
  searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      app.openFirstMatch();
    }
  });

  let body = document.getElementsByTagName('body')[0];
  body.addEventListener('keyup', event => {
    // If a letter was typed
    let typingRegex: RegExp = /^[a-zA-Z]$/;
    if (typingRegex.exec(event.key) !== null && domHelper.matchesTable.style.display === 'block') {
      if (searchInput.dataset.visible === 'false') {
        searchInput.dataset.visible = 'true';
        DomHelper.showElement(searchInput);
        searchInput.focus();
        searchInput.value = event.key;
        app.filterMatches(searchInput.value);
      }
    } else if (event.key === 'Backspace') {
      app.backToMatches();
    }
  });

}, () => { 
  DomHelper.hideElement(domHelper.loadingGif);

  domHelper.showErrorMessage('An error occurred while loading the matches.'); 
});