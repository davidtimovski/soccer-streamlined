class SopCast {
  private static readonly sopCastStreamsRegex: RegExp = /(.*)(sop:\/\/(\S+))(.*)/g;

  constructor(public uri: string, public title: string) {}

  static greedyRegexMatch(search: string, result: SopCast[]): void {
    let matches = this.sopCastStreamsRegex.exec(search);

    if (matches !== null) {
      let preText = matches[1].replace(/&gt;|\|/g, '').trim();
      let postText = matches[4].replace(/&gt;/g, '').trim();
      let uri = matches[3];

      result.push(new SopCast(uri, `${preText} ${postText}`));
      this.greedyRegexMatch(search, result);
    }
  }
}