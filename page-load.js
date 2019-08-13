myList = document.querySelector('ul');



function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

function getHeadersAndValues() {
  fetch('./cache-headers-and-values.json')
  .then(status)
  .then(json)
  .then(function(data) {
    // console.log('my json', data);
  })
  .catch(function(error) {
    var p = document.createElement('p');
    p.appendChild(
      document.createTextNode('Error: ' + error.message)
    );
    document.body.insertBefore(p, myList);
  });
};


function updateHtmlWithValues() {
    fetch('./cache-headers-and-values.json')
    .then(status)
    .then(json)
    .then(function(data) {
      myExplainList = document.querySelector('#explain_area');
      for(var i = 0; i < data.Headers.length; i++) {
        var listItem = document.createElement('li');
        // listItem.innerHTML = '<strong>' + data.Headers[i].Name + '</strong>';
        // listItem.innerHTML +=' is known for doing <strong> ' + data.Headers[i].Details + '</strong>.';
        // listItem.innerHTML +=' Find more info here: <strong>' + data.Headers[i].URL + '</strong>';
        myExplainList.replaceWith(listItem, myExplainList);
      }
  });
};

function updateHtmlWithCacheExplained(){
  fetch('./cache-headers-and-values.json')
  .then(status)
  .then(json)
  .then(function(data) {
    // get the value input by the user
    inHeaders = document.getElementsByName('input_headers')[0].value;
    // console.log("some thing:  " + inHeaders);

    document.getElementById("demo").innerHTML = "YOU CLICKED ME with : " + inHeaders;
    setTimeout(function(){
      document.getElementById("demo").innerHTML = "Click me";
    }, 2000);

    for(var i = 0; i < data.Headers.length; i++) {
      // console.log(data.Headers[i].Name)
      var listItem = document.createElement('li');
      if (data.Headers[i].Name.includes(inHeaders)) {
        listItem.innerHTML = '<strong>' + data.Headers[i].Name + '</strong>';
        listItem.innerHTML +=' is known for doing <strong> ' + data.Headers[i].Details + '</strong>.';
        listItem.innerHTML +=' Find more info here: <strong>' + data.Headers[i].URL + '</strong>';
        myExplainList.replaceWith(listItem, myExplainList);
      }
    };
  });
};
