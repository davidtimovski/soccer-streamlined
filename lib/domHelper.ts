class DomHelper {
  private static messageDiv = document.getElementById('message');

  static loadingGif: HTMLElement = document.getElementById('loading');
  static searchInput: HTMLInputElement = <HTMLInputElement>document.getElementById('search');
  static matchesTable: HTMLElement = document.getElementById('matches');
  static soccerStreamsLink: HTMLElement = document.getElementById('soccer-streams-link');
  static soccerStreamsLinkWrap: HTMLElement = document.getElementById('soccer-streams-link-wrap');
  static streamsWrap: HTMLElement = document.getElementById('streams-wrap');
  static backButton: HTMLElement = document.getElementById('back-button');
  static threadInfoDiv: HTMLElement = document.getElementById('thread-info');
  static legendDiv: HTMLElement = document.getElementById('legend');
  static clipboardWrap: HTMLElement = document.getElementById('clipboard-wrap');
  static streamTypeDiv: HTMLElement = document.getElementById('stream-type');
  static clipboardTextarea: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById('clipboard');
  static streamsTable: HTMLElement = document.getElementById('streams');

  static showInfoMessage(message: string): void {
    DomHelper.showMessage(message, 'info');
  }

  static showErrorMessage(message: string): void {
    DomHelper.showMessage(message, 'error');
  }

  static hideMessage(): void {
    DomHelper.messageDiv.innerText = '';
    DomHelper.messageDiv.className = '';
    DomHelper.hideElement(DomHelper.messageDiv);
  }

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

  static showStreamTitle(title: string): void {
    DomHelper.hideElement(DomHelper.streamTypeDiv);

    DomHelper.clipboardTextarea.value = title;
    DomHelper.clipboardTextarea.disabled = true;
  }

  static removeEventHandlers(element: Element): void {
    let clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
  }

  private static showMessage(message: string, type: string): void {
    this.messageDiv.innerText = message;
    DomHelper.addClass(this.messageDiv, type);
    DomHelper.showElement(this.messageDiv);
  }
}