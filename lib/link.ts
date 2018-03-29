class Link {
  private static readonly linksRegex: RegExp = /\[(.+?)\]\s*?\(\s*(https?:\/\/.+?)\s*\)/g;

  constructor(public uri: string, public title: string) {}

  static greedyRegexMatch(search: string, result: Link[]): void {
    let matches = this.linksRegex.exec(search);

    if (matches !== null) {
      let title = matches[1].trim();
      let uri = matches[2];

      result.push(new Link(uri, title.trim()));
      this.greedyRegexMatch(search, result);
    }
  }
}