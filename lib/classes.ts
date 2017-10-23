/// <reference path="./constants.ts" />

class Match {
  id: string;
  title: string;
  url: string;
  kickOffTime: Date;
  kickOffTimeFormatted: string;
  leagueIcon: string;
}

class Stream {
  author: string;
  commentUrl: string;
  urls: string[];
  aceStreams: string[];
  sopCastStreams: string[];
}

class ThreadInfo {
  constructor(public titleHtml: string, public url: string) {}
}

class App {

  backToMatches(): void {
    DomHelper.hideMessage();
  
    let streamsWrap = document.getElementById('streams-wrap');
    DomHelper.hideElement(streamsWrap);
  
    let streamsTable = document.getElementById('streams');
    streamsTable.innerHTML = '';
  
    let matchesTable = document.getElementById('matches');
    DomHelper.showElement(matchesTable);
  
    let clipboardTextarea = <HTMLTextAreaElement>document.getElementById('clipboard');
    clipboardTextarea.value = '';

    let clipboardWrap = document.querySelectorAll('.clipboard-wrap')[0];
    DomHelper.hideElement(clipboardWrap);
  }
  
  populateMatchesTable(matches: Match[]): void {
    let matchesTable = document.getElementById('matches');
  
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
            this.populateStreamsTable(streams);
          } else {
            DomHelper.showMessage('There are currently no available streams for this match.', 'info');
          }
      
          let searchInput = <HTMLInputElement>document.getElementById('search');
          searchInput.dataset.visible = 'false';
          DomHelper.hideElement(searchInput);
          this.resetMatchesFilter();
      
          let matchesTable = document.getElementById('matches');
          DomHelper.hideElement(matchesTable);
      
          let streamsWrap = document.getElementById('streams-wrap');
          DomHelper.showElement(streamsWrap);
      
          DomHelper.hideElement(loadingDiv);
          DomHelper.showElement(kickOffTimeDiv);
      
        }, 'An error occurred while loading the streams.');
      
      }, false);
  
      gameTd.appendChild(matchButton);
  
      let tr = document.createElement('tr');
      tr.dataset.id = match.id;

      tr.appendChild(firstTd);
      tr.appendChild(gameTd);

      matchesTable.appendChild(tr);
    }
  }

  populateStreamDetails(threadInfo: ThreadInfo): void {
    let backButton = document.getElementById('back-button');
    backButton.addEventListener('click', this.backToMatches, false);
  
    let threadInfoDiv = document.getElementById('thread-info');
    threadInfoDiv.innerHTML = threadInfo.titleHtml;
  
    let threadButton = document.getElementById('thread-button');
    threadButton.addEventListener('click', () => {
      chrome.tabs.create({ url: threadInfo.url, active: false });
    }, false);
  }
  
  populateStreamsTable(streams: Stream[]): void {
    let streamsTable = document.getElementById('streams');

    for (let stream of streams) {
      let linksTd = document.createElement('td');
      DomHelper.addClass(linksTd, 'links');
  
      // Urls
      for (let j = 0; j < stream.urls.length; j++) {
        let urlButton = document.createElement('button');
        urlButton.innerText = (j + 1).toString();
        DomHelper.addClass(urlButton, 'url-button');
        urlButton.addEventListener('click', () => {
          chrome.tabs.create({ url: stream.urls[j], active: false });
        }, false);

        let rowDiv = document.createElement('div');
        rowDiv.appendChild(linksTd);
  
        linksTd.appendChild(urlButton);
      }
  
      // Ace Streams
      for (let j = 0; j < stream.aceStreams.length; j++) {
        let aceStreamButton = document.createElement('button');
        aceStreamButton.innerText = (j + 1).toString();
        DomHelper.addClass(aceStreamButton, 'ace-stream-button');
        aceStreamButton.dataset.title = 'Copy acestream link';
        aceStreamButton.addEventListener('click', () => {
  
          let clipboardTextarea = <HTMLTextAreaElement>document.getElementById('clipboard');
          clipboardTextarea.value = stream.aceStreams[j];
          let streamTypeDiv = <HTMLDivElement>document.querySelectorAll('.clipboard-wrap .stream-type')[0];
          streamTypeDiv.innerText = 'acestream';
          let clipboardWrap = document.querySelectorAll('.clipboard-wrap')[0];
          DomHelper.showElement(clipboardWrap, 'flex');
  
          clipboardTextarea.select();
          document.execCommand('copy');
  
        }, false);
  
        linksTd.appendChild(aceStreamButton);
      }
  
      // SopCast Streams
      for (let j = 0; j < stream.sopCastStreams.length; j++) {
        let sopCastStreamButton = document.createElement('button');
        sopCastStreamButton.innerText = (j + 1).toString();
        DomHelper.addClass(sopCastStreamButton, 'sopcast-stream-button');
        sopCastStreamButton.dataset.title = 'Copy sopcast link';
        sopCastStreamButton.addEventListener('click', () => {

          let clipboardTextarea = <HTMLTextAreaElement>document.getElementById('clipboard');
          clipboardTextarea.value = stream.sopCastStreams[j];
          let streamTypeDiv = <HTMLDivElement>document.querySelectorAll('.clipboard-wrap .stream-type')[0];
          streamTypeDiv.innerText = 'sopcast';
          let clipboardWrap = document.querySelectorAll('.clipboard-wrap')[0];
          DomHelper.showElement(clipboardWrap, 'flex');
  
          clipboardTextarea.select();
          document.execCommand('copy');
  
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
  
      streamsTable.appendChild(tr);
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
    let searchInput = <HTMLInputElement>document.getElementById('search');
    searchInput.value = '';
  
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

class HttpClient {

  getJson(url: string, callback: any, errorMessage: string): void {

    try {
      let request = new XMLHttpRequest();
    
      request.onreadystatechange = () =>
      {
        if (request.readyState == 4)
        {
          if (request.status == 200) {
            callback(JSON.parse(request.responseText));
          } else {
            DomHelper.showMessage(errorMessage, 'error');
          }        
        }
      };
      
      request.open('GET', url + '.json');
      request.send();
    }
    catch (error) {
      DomHelper.showMessage(errorMessage, 'error');
    }
  }

}

class DomHelper {
  static addClass(element: any, className: string): void {
    if (element.className.trim() === '') {
      element.className = className;
    } else {
      let classList = element.className.trim().replace(/ +/g, ' ').split(' ');
      
      if (classList.indexOf(className) === -1) {
        classList.push(className);
        element.className = classList.join(' ');
      }
    }
  }

  static hideElement(element: any): void {
    element.style.display = 'none';
  }

  static showElement(element: any, display?: string): void {
    element.style.display = display || 'block';
  }

  static showMessage(message: string, type: string): void {
    let messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    DomHelper.addClass(messageDiv, type);
    DomHelper.showElement(messageDiv);
  }

  static hideMessage(): void {
    let messageDiv = document.getElementById('message');
    messageDiv.innerText = '';
    messageDiv.className = '';
    DomHelper.hideElement(messageDiv);
  }
}

class Parser {

  getMatchesFromPosts(posts: any[]): Match[] {
    let matches = new Array<Match>();
    
    for (let post of posts) {
      let kickOffTime = this.getKickOffTimeFromTitle(post.data.title);

      // Skip non-match posts
      if (post.data.locked || post.data.stickied || !kickOffTime) {
        continue;
      }

      let match = new Match();
      match.id = post.data.id;
      match.title = this.getTitleWithoutTime(post.data.title);
      match.url = post.data.url;
      match.kickOffTime = kickOffTime;
      match.kickOffTimeFormatted = this.formatKickOffTime(kickOffTime);
      match.leagueIcon = post.data.link_flair_css_class;

      matches.push(match);
    }
  
    return matches;
  }

  greedyRegexMatch(search: string, regex: RegExp, result: string[]): void {
    let matches = regex.exec(search);

    if (matches !== null) {
      result.push(matches[1]);
      this.greedyRegexMatch(search, regex, result);
    }
  }

  getStreamsFromComments(comments: any[], postUrl: string): Stream[] {
    let streams = new Array<Stream>();
  
    for (let comment of comments) {
      let urlsInBody: string[] = [];
      let aceStreamsInBody: string[] = [];
      let sopCastStreamsInBody: string[] = [];

      this.greedyRegexMatch(comment.data.body, Constants.urlsRegex, urlsInBody);
      this.greedyRegexMatch(comment.data.body, Constants.aceStreamsRegex, aceStreamsInBody);
      this.greedyRegexMatch(comment.data.body, Constants.sopCastStreamsRegex, sopCastStreamsInBody);
  
      if ((urlsInBody.length + aceStreamsInBody.length + sopCastStreamsInBody.length) > 0) {
        let stream = new Stream();

        stream.author = comment.data.author;
        stream.commentUrl = postUrl + comment.data.id;
        stream.urls = urlsInBody;
        stream.aceStreams = aceStreamsInBody;
        stream.sopCastStreams = sopCastStreamsInBody;

        streams.push(stream);
      }
    }
  
    return streams;
  }

  getKickOffTimeFromTitle(title: string): any {
    if (title.indexOf('[') === -1) {
      return false;
    }
  
    let startingPosition: number = title.indexOf('[') + 1;
    let endPosition: number = title.indexOf(']', startingPosition);
    let hoursAndMinutesText: string = title.substring(startingPosition, endPosition);
    let hoursAndMinutesArray: string[] = hoursAndMinutesText.trim().split(/\D+/);
  
    let now = new Date();
    let utc: number = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 
      parseInt(hoursAndMinutesArray[0], 10), parseInt(hoursAndMinutesArray[1], 10), 0, 0);
  
    if (isNaN(utc)) {
      return false;
    }
  
    return new Date(utc);
  }

  getTitleWithoutTime(title: string): string {
    let startingPosition: number = title.indexOf(']');
    let titleWithoutTime: string = title.substring(startingPosition + 1, title.length).trim();
    return titleWithoutTime.replace(Constants.cleanUpTitleRegex, '');
  }

  formatKickOffTime(date: Date): string {
    let hours: string = '0' + date.getHours();
    hours = hours.substr(hours.length - 2);
  
    let minutes: string = '0' + date.getMinutes();
    minutes = minutes.substr(minutes.length - 2);
  
    return `${hours}:${minutes}`;
  }

}