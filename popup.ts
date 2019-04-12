/// <reference path="./lib/app.ts" />

let httpClient = new HttpClient();

httpClient.getJson('https://www.reddit.com/r/redditsoccercity', result => {

  let posts = result.data.children;

  let app = new App();
  let parser = new Parser();
  let matches = parser.getMatchesFromPosts(posts);
  
  if (matches.length > 0) {
    app.populateMatchesTable(matches);
  } else {
    DomHelper.showInfoMessage('There are currently no available matches.');
  }

  DomHelper.hideElement(DomHelper.loadingGif);

  DomHelper.showElement(DomHelper.matchesTable);

  DomHelper.soccerStreamsLink.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.reddit.com/r/redditsoccercity', active: true });
  }, false);
  DomHelper.showElement(DomHelper.soccerStreamsLinkWrap);

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
    if (typingRegex.exec(event.key) !== null && DomHelper.matchesTable.style.display === 'block') {
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
  DomHelper.hideElement(DomHelper.loadingGif);

  DomHelper.showElement(DomHelper.soccerStreamsNote);

  DomHelper.showErrorMessage('An error occurred while loading the matches.');
});