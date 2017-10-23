/// <reference path="./lib/constants.ts" />
/// <reference path="./lib/classes.ts" />

let httpClient = new HttpClient();

httpClient.getJson('https://www.reddit.com/r/soccerstreams', result => {

  let app = new App();
  let parser = new Parser();

  let posts = result.data.children;
  let matches = parser.getMatchesFromPosts(posts);
  
  if (matches.length > 0) {
    app.populateMatchesTable(matches);
  } else {
    DomHelper.showMessage('There are currently no available matches.', 'info');
  }

  let loadingGif = document.getElementById('loading');
  DomHelper.hideElement(loadingGif);

  let matchesTable = document.getElementById('matches');
  DomHelper.showElement(matchesTable);

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
    if (Constants.typingRegex.exec(event.key) !== null && matchesTable.style.display === 'block') {
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

}, 'An error occurred while loading the matches.');