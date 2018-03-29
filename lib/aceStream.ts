class AceStream {
  private static readonly aceStreamsRegex: RegExp = /(.*)(acestream:\/\/([a-zA-Z0-9]+))(.*)/g;

  constructor(public uri: string, public title: string) {}

  static greedyRegexMatch(search: string, result: AceStream[]): void {
    let matches = this.aceStreamsRegex.exec(search);

    if (matches !== null) {
      let preText = matches[1].replace(/&gt;|\|/g, '').trim();
      let postText = matches[4].replace(/&gt;/g, '').trim();
      let streamId = matches[3];

      result.push(new AceStream(streamId, `${preText} ${postText}`));
      this.greedyRegexMatch(search, result);
    }
  }
}