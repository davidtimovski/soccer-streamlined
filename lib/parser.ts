/// <reference path="match.ts" />
/// <reference path="stream.ts" />

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

    var kickOffTimeAscending = (a: Match, b: Match): number => {
      if (a.kickOffTime < b.kickOffTime) {
        return -1;
      }
      if (a.kickOffTime > b.kickOffTime) {
        return 1;
      }
      return 0;
    };

    return matches.sort(kickOffTimeAscending);
  }

  greedyRegexMatch(search: string, regex: RegExp, matchingGroup: number, result: any[]): void {
    let matches = regex.exec(search);

    if (matches !== null) {
      result.push(matches[matchingGroup]);
      this.greedyRegexMatch(search, regex, matchingGroup, result);
    }
  }

  getStreamsFromComments(comments: any[], postUrl: string): Stream[] {
    let streams = new Array<Stream>();
  
    for (let comment of comments) {
      let linksInBody: Link[] = [];
      let aceStreamsInBody: AceStream[] = [];
      let sopCastStreamsInBody: SopCast[] = [];

      Link.greedyRegexMatch(comment.data.body, linksInBody);
      AceStream.greedyRegexMatch(comment.data.body, aceStreamsInBody);
      SopCast.greedyRegexMatch(comment.data.body, sopCastStreamsInBody);
  
      if ((linksInBody.length + aceStreamsInBody.length + sopCastStreamsInBody.length) > 0) {
        let stream = new Stream();

        stream.author = comment.data.author;
        stream.commentUrl = postUrl + comment.data.id;
        stream.links = linksInBody;
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
    let cleanUpTitleRegex: RegExp = /([^a-zA-Z]*?)(?=[a-zA-Z])/;
    return titleWithoutTime.replace(cleanUpTitleRegex, '');
  }

  formatKickOffTime(date: Date): string {
    let hours: string = '0' + date.getHours();
    hours = hours.substr(hours.length - 2);
  
    let minutes: string = '0' + date.getMinutes();
    minutes = minutes.substr(minutes.length - 2);
  
    return `${hours}:${minutes}`;
  }

}