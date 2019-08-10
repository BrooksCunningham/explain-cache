myList = document.querySelector('ul');

function getHeadersAndValues() {
  fetch('./cache-headers-and-values.json')
  .then(function(response) {
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    }
    return response.json();
  })
  .then(function(json) {
    console.log('my json',json);
    return json;
  })
  .catch(function(error) {
    var p = document.createElement('p');
    p.appendChild(
      document.createTextNode('Error: ' + error.message)
    );
    document.body.insertBefore(p, myList);
  });
  //return 'cat'
};

headersandValues = getHeadersAndValues();

function updateHtmlWithValues(headersJson) {
  for(var i = 0; i < headersJson.Headers.length; i++) {
    var listItem = document.createElement('li');
    listItem.innerHTML = '<strong>' + headersJson.Headers[i].Name + '</strong>';
    listItem.innerHTML +=' is known for doing <strong> ' + headersJson.Headers[i].Details + '</strong>.';
    listItem.innerHTML +=' Find more info here: <strong>' + headersJson.Headers[i].URL + '</strong>';
    myList.appendChild(listItem);
  }
}

updateHtmlWithValues(headersandValues)

function myFunction(){
  document.getElementById("demo").innerHTML = "YOU CLICKED ME!";
  setTimeout(function(){
    document.getElementById("demo").innerHTML = "Click me";
  }, 2000);
  inHeaders = document.getElementsByName('input_headers')[0].value;
  console.log("some thing:  " + inHeaders);

  if (inHeaders.includes('pragma')) {
    console.log(inHeaders, inHeaders.includes('pragma'));
  }

};
