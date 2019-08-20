/// <reference path="./lib/app.ts" />

let httpClient = new HttpClient();

let httpError = () => { 
  DomHelper.hideElement(DomHelper.loadingGif);

  DomHelper.showElement(DomHelper.soccerStreamsNote);

  DomHelper.showErrorMessage('Couldn\'t load the matches');
};

httpClient.get('https://soccerorigin.davidtimovski.com', streamsOrigin => {
  
  httpClient.get(streamsOrigin.origin + '.json', result => {

    let posts = result.data.children;
  
    let app = new App();
    let parser = new Parser();
    let matches = parser.getMatchesFromPosts(posts);
    
    if (matches.length > 0) {
      app.populateMatchesTable(matches);
    } else {
      DomHelper.showInfoMessage('There are currently no available matches');
    }
  
    DomHelper.hideElement(DomHelper.loadingGif);
  
    DomHelper.showElement(DomHelper.matchesTable);
  
    DomHelper.soccerStreamsLink.innerText = streamsOrigin.origin;
    DomHelper.soccerStreamsLink.addEventListener('click', () => {
      chrome.tabs.create({ url: streamsOrigin.origin, active: true });
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
  
  }, httpError);

}, httpError);