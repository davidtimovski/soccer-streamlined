/// <reference path="match.ts" />
/// <reference path="stream.ts" />

class Parser {
  private static readonly kickOffTimeRegex: RegExp = /\[.+\]/;

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
      match.url = 'https://www.reddit.com' + post.data.permalink;
      match.kickOffTime = kickOffTime;
      match.kickOffTimeFormatted = this.formatKickOffTime(kickOffTime);
      match.leagueIcon = post.data.link_flair_css_class;

      matches.push(match);
    }

    let kickOffTimeAscending = (a: Match, b: Match): number => {
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

  private greedyRegexMatch(search: string, regex: RegExp, matchingGroup: number, result: any[]): void {
    let matches = regex.exec(search);

    if (matches !== null) {
      result.push(matches[matchingGroup]);
      this.greedyRegexMatch(search, regex, matchingGroup, result);
    }
  }

  private getKickOffTimeFromTitle(title: string): Date {
    let requestPart = title.match(/\[request\]/i);
    let kickOffTimePart = title.match(Parser.kickOffTimeRegex);

    // Skip match requests and match posts where the title is malformed
    if (requestPart || !kickOffTimePart) {
      return null;
    }

    let hoursAndMinutesText: string = kickOffTimePart[0].trim().substring(1, kickOffTimePart[0].length - 1);
    let hoursAndMinutesArray: string[] = hoursAndMinutesText.trim().split(/\D+/);
  
    let now = new Date();
    let utc: number = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 
      parseInt(hoursAndMinutesArray[0], 10), parseInt(hoursAndMinutesArray[1], 10), 0, 0);
  
    if (isNaN(utc)) {
      return null;
    }
  
    return new Date(utc);
  }

  private getTitleWithoutTime(title: string): string {
    let kickOffTimePart = title.match(Parser.kickOffTimeRegex);
    return title.replace(kickOffTimePart[0], '');
  }

  private formatKickOffTime(date: Date): string {
    let hours: string = '0' + date.getHours();
    hours = hours.substr(hours.length - 2);
  
    let minutes: string = '0' + date.getMinutes();
    minutes = minutes.substr(minutes.length - 2);
  
    return `${hours}:${minutes}`;
  }

}