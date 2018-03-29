class HttpClient {

  getJson(url: string, successCallback: (result: any) => void, errorCallback: (statusCode: number) => void): void {
    let request = new XMLHttpRequest();
  
    request.onreadystatechange = () =>
    {
      if (request.readyState == 4)
      {
        if (request.status == 200) {
          successCallback(JSON.parse(request.responseText));
        } else {
          errorCallback(request.status);
        }
      }
    };
    
    request.open('GET', url + '.json');
    request.send();
  }

}