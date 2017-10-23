namespace Constants {
  export const urlsRegex = /\(\s*(https?:\/\/.+?)\s*\)/g;
  export const aceStreamsRegex = /acestream:\/\/([a-zA-Z0-9]+)/g;
  export const sopCastStreamsRegex = /sop:\/\/(\S+)/g;
  export const cleanUpTitleRegex = /([^a-zA-Z]*?)(?=[a-zA-Z])/;
  export const typingRegex = /^[a-zA-Z]$/;
}