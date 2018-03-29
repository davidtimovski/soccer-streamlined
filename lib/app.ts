/// <reference path="threadInfo.ts" />
/// <reference path="domHelper.ts" />
/// <reference path="httpClient.ts" />
/// <reference path="parser.ts" />

class App {

  constructor() {}

  backToMatches(): void {
    DomHelper.hideMessage();
  
    DomHelper.hideElement(DomHelper.streamsWrap);
  
    DomHelper.streamsTable.innerHTML = '';
  
    DomHelper.showElement(DomHelper.matchesTable);

    DomHelper.hideElement(DomHelper.streamTypeDiv);
  
    DomHelper.clipboardTextarea.value = 'Pick a stream';
    DomHelper.clipboardTextarea.disabled = true;

    let threadButton = document.getElementById('thread-button');
    DomHelper.removeEventHandlers(threadButton);
  }
  
  populateMatchesTable(matches: Match[]): void {
    for (let match of matches) {
      let matchLoadingDiv = document.createElement('div');
      DomHelper.addClass(matchLoadingDiv, 'loading');
  
      let firstTd = document.createElement('td');
      let kickOffTimeDiv = document.createElement('div');
      DomHelper.addClass(kickOffTimeDiv, 'kickoff-time');
      kickOffTimeDiv.innerText = match.kickOffTimeFormatted;
  
      firstTd.appendChild(kickOffTimeDiv);
      firstTd.appendChild(matchLoadingDiv);
  
      let gameTd = document.createElement('td');
  
      let matchButton = document.createElement('button');
      if (match.leagueIcon !== null) {
        let leagueIconSpan = document.createElement('span');
        DomHelper.addClass(leagueIconSpan, 'league-icon');
        DomHelper.addClass(leagueIconSpan, match.leagueIcon);
        matchButton.appendChild(leagueIconSpan);
      }
      let matchTitleSpan = document.createElement('span');
      matchTitleSpan.innerHTML = match.title;
      matchButton.appendChild(matchTitleSpan);

      matchButton.addEventListener('click', () => {

        matchButton.disabled = true;

        let kickOffTimeDiv = document.querySelectorAll(`#matches tr[data-id="${match.id}"] .kickoff-time`)[0];
        let loadingDiv = document.querySelectorAll(`#matches tr[data-id="${match.id}"] .loading`)[0];
    
        DomHelper.hideElement(kickOffTimeDiv);
        DomHelper.showElement(loadingDiv);
      
        let httpClient = new HttpClient();
        httpClient.getJson(match.url, result => {
      
          let threadInfo = new ThreadInfo(matchButton.innerHTML, match.url);
          let comments = result[1].data.children;
    
          let parser = new Parser();
          let streams = parser.getStreamsFromComments(comments, match.url);
      
          this.populateStreamDetails(threadInfo);
      
          if (streams.length > 0) {
            DomHelper.showElement(DomHelper.legendDiv);
            DomHelper.showElement(DomHelper.clipboardWrap, 'flex');

            this.populateStreamsTable(streams);
          } else {
            DomHelper.hideElement(DomHelper.legendDiv);
            DomHelper.hideElement(DomHelper.clipboardWrap);
            
            DomHelper.showInfoMessage('There are currently no available streams for this match.');
          }
      
          DomHelper.searchInput.dataset.visible = 'false';
          DomHelper.hideElement(DomHelper.searchInput);
          this.resetMatchesFilter();
      
          DomHelper.hideElement(DomHelper.matchesTable);
      
          DomHelper.showElement(DomHelper.streamsWrap);
      
          DomHelper.hideElement(loadingDiv);
          DomHelper.showElement(kickOffTimeDiv);

          matchButton.disabled = false;

        }, () => { 
          matchButton.disabled = false;
          
          DomHelper.hideElement(DomHelper.clipboardWrap);

          DomHelper.hideElement(DomHelper.matchesTable);
        
          DomHelper.showErrorMessage('An error occurred while loading the streams.'); 
        });

      }, false);
  
      gameTd.appendChild(matchButton);
  
      let tr = document.createElement('tr');
      tr.dataset.id = match.id;

      tr.appendChild(firstTd);
      tr.appendChild(gameTd);

      DomHelper.matchesTable.appendChild(tr);
    }
  }

  populateStreamDetails(threadInfo: ThreadInfo): void {
    DomHelper.backButton.addEventListener('click', this.backToMatches, false);
  
    DomHelper.threadInfoDiv.innerHTML = threadInfo.titleHtml;
  
    let threadButton = document.getElementById('thread-button');
    threadButton.addEventListener('click', () => {
      chrome.tabs.create({ url: threadInfo.url, active: false });
    }, false);
  }
  
  populateStreamsTable(streams: Stream[]): void {
    for (let stream of streams) {
      let linksTd = document.createElement('td');
      DomHelper.addClass(linksTd, 'links');
  
      // Links
      for (let i = 0; i < stream.links.length; i++) {
        let linkButton = document.createElement('button');
        linkButton.innerText = (i + 1).toString();
        DomHelper.addClass(linkButton, 'link-button');
        linkButton.addEventListener('click', () => {
          chrome.tabs.create({ url: stream.links[i].uri, active: false });
        }, false);
        linkButton.addEventListener('mouseover', () => {
          DomHelper.showStreamTitle(stream.links[i].title);
        }, false);
        linkButton.addEventListener('mouseout', () => {
          DomHelper.showStreamTitle('');
        }, false);

        let rowDiv = document.createElement('div');
        rowDiv.appendChild(linksTd);
  
        linksTd.appendChild(linkButton);
      }
  
      // Ace Streams
      for (let i = 0; i < stream.aceStreams.length; i++) {
        let aceStreamButton = document.createElement('button');
        aceStreamButton.innerText = (i + 1).toString();
        DomHelper.addClass(aceStreamButton, 'ace-stream-button');
        aceStreamButton.dataset.title = 'Copy acestream link';
        aceStreamButton.addEventListener('click', () => {
  
          DomHelper.clipboardTextarea.value = stream.aceStreams[i].uri;
          DomHelper.clipboardTextarea.disabled = false;

          DomHelper.streamTypeDiv.innerText = 'acestream';
          DomHelper.showElement(DomHelper.streamTypeDiv);

          DomHelper.showElement(DomHelper.clipboardWrap, 'flex');
  
          DomHelper.clipboardTextarea.select();
          document.execCommand('copy');
  
        }, false);
        aceStreamButton.addEventListener('mouseover', () => {
          DomHelper.showStreamTitle(stream.aceStreams[i].title);
        }, false);
        aceStreamButton.addEventListener('mouseout', () => {
          if (DomHelper.clipboardTextarea.disabled) {
            DomHelper.showStreamTitle('');
          }
        }, false);
  
        linksTd.appendChild(aceStreamButton);
      }
  
      // SopCast Streams
      for (let i = 0; i < stream.sopCastStreams.length; i++) {
        let sopCastStreamButton = document.createElement('button');
        sopCastStreamButton.innerText = (i + 1).toString();
        DomHelper.addClass(sopCastStreamButton, 'sopcast-stream-button');
        sopCastStreamButton.dataset.title = 'Copy sopcast link';
        sopCastStreamButton.addEventListener('click', () => {

          DomHelper.clipboardTextarea.value = stream.sopCastStreams[i].uri;
          DomHelper.clipboardTextarea.disabled = false;

          DomHelper.streamTypeDiv.innerText = 'sopcast';
          DomHelper.showElement(DomHelper.streamTypeDiv);

          DomHelper.showElement(DomHelper.clipboardWrap, 'flex');
  
          DomHelper.clipboardTextarea.select();
          document.execCommand('copy');
  
        }, false);
        sopCastStreamButton.addEventListener('mouseover', () => {
          DomHelper.showStreamTitle(stream.sopCastStreams[i].title);
        }, false);
        sopCastStreamButton.addEventListener('mouseout', () => {
          if (DomHelper.clipboardTextarea.disabled) {
            DomHelper.showStreamTitle('');
          }
        }, false);
  
        linksTd.appendChild(sopCastStreamButton);
      }

      let authorTd = document.createElement('td');
      DomHelper.addClass(authorTd, 'author');
  
      let authorButton = document.createElement('button');
      authorButton.innerText = stream.author;
      authorButton.addEventListener('click', () => {
        chrome.tabs.create({ url: stream.commentUrl, active: false });
      }, false);
  
      authorTd.appendChild(authorButton);
  
      let tr = document.createElement('tr');
      tr.appendChild(linksTd);
      tr.appendChild(authorTd);
  
      DomHelper.streamsTable.appendChild(tr);
    }
  }

  filterMatches(searchText: string): void {
    let matchesTr = document.querySelectorAll('#matches tr');
  
    for (let i = 0; i < matchesTr.length; i++) {
      let matchTitle: string = (<HTMLTableCellElement>matchesTr[i].children[1]).innerText;
  
      if (matchTitle.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
        DomHelper.hideElement(matchesTr[i]);
      } else {
        DomHelper.showElement(matchesTr[i]);
      }
    }
  }
  
  resetMatchesFilter(): void {
    DomHelper.searchInput.value = '';
  
    let matchesTr = document.querySelectorAll('#matches tr');
    for (let i = 0; i < matchesTr.length; i++) {
      DomHelper.showElement(matchesTr[i]);
    }
  }
  
  openFirstMatch(): void {
    let matchesTr = document.querySelectorAll('#matches tr');
    let matchButtonToOpen;
  
    for (let i = 0; i < matchesTr.length; i++) {
      if ((<HTMLTableRowElement>matchesTr[i]).style.display === 'block') {
        matchButtonToOpen = matchesTr[i].querySelectorAll('td button')[0];
        break;
      }
    }
  
    if (matchButtonToOpen) {
      matchButtonToOpen.click();
    }
  }
}