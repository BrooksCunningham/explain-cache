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
      // myExplainList = document.querySelector('#explain_area');
      for(var i = 0; i < data.Headers.length; i++) {
        var listItem = document.createElement('li');
        // listItem.innerHTML = '<strong>' + data.Headers[i].Name + '</strong>';
        // listItem.innerHTML +=' is known for doing <strong> ' + data.Headers[i].Details + '</strong>.';
        // listItem.innerHTML +=' Find more info here: <strong>' + data.Headers[i].URL + '</strong>';
        // myExplainList.replaceWith(listItem, myExplainList);
      }
  });
};

function updateHtmlWithCacheExplained(headers_input){
  fetch('./cache-headers-and-values.json')
  .then(status)
  .then(json)
  .then(function(data) {
    // get the value input by the user
    if (document.getElementsByName('input_headers')[0].value.length > 2) {
      headers_input = document.getElementsByName('input_headers')[0].value;
    };
    var parsed_headers = parse_headers(headers_input)
    console.log("Parsed headers:  " + JSON.stringify(parsed_headers));
    console.log("Header input:  " + headers_input);


    document.getElementById("demo").innerHTML = "YOU CLICKED ME with : " + headers_input;
    setTimeout(function(){
      document.getElementById("demo").innerHTML = "Click me";
    }, 2000);

    myExplainList = document.querySelector('#explain_area');
    myExplainList.innerHTML = '<ul>'
    for(var i = 0; i < data.Headers.length; i++) {
      // console.log(data.Headers[i].Name)
      // var listItem = document.createElement('li');
      for(h in parsed_headers){
        // console.log('header:', h, 'data_header:',data.Headers[i].Name);
        if (data.Headers[i].Name.includes(h)) {
          console.log('header:', h, 'parsed_headers:', parsed_headers[h]);
        };

        if (data.Headers[i].Name.includes(h)) {
          console.log('hit1')
          // listItem.innerHTML = '<ul id="explain_area">'
          // listItem.innerHTML
          myExplainList.innerHTML += '<li><strong>' + data.Headers[i].Name + ': </strong>' + data.Headers[i].Details + '. Find more info here: <strong> '
          myExplainList.innerHTML += '<a href="' + data.Headers[i].URL + '">' + data.Headers[i].URL + '</a></strong></li>';

          // listItem.innerHTML += '</ul>'
          // myExplainList.innerHTML = listItem;
          // myExplainList.innerHTML
          // myExplainList.replaceChild(listItem, myExplainList.innerHTML);
        };
      }
    };
    myExplainList.innerHTML += '</ul>'
  });
  //TODO remove this after testing.
  build_explain_cache_html()
};

function parse_headers(http_response) {
  var trim = function(string) {
    // console.log('trim')
    return string.replace(/^\s+|\s+$/g, '');
  }
    , isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      }

  var export_headers = function (http_response) {
    if (!http_response)
      return {}

    var result = {}

    var headersArr = trim(http_response).split('\n')

    for (var i = 0; i < headersArr.length; i++) {
      var row = headersArr[i]
      var index = row.indexOf(':')
      , key = trim(row.slice(0, index)).toLowerCase()
      , value = trim(row.slice(index + 1))

      if (typeof(result[key]) === 'undefined') {
        result[key] = value
      } else if (isArray(result[key])) {
        result[key].push(value)
      } else {
        result[key] = [ result[key], value ]
      }
    }
    // console.log(result)
    return result
  }
  return export_headers(http_response)
};

function public_cache_check() {
  headers_input = document.getElementsByName('input_headers')[0].value;
  // check for cache-control: no-store, no-cache
  var parsed_headers = parse_headers(headers_input)

  var cache_control_busting = ['no-store', 'no-cache']

  for (h in parsed_headers) {
    for (ccb in cache_control_busting) {
      // console.log('hit1:', h, parsed_headers[h], ', ccb:', cache_control_busting[ccb])
      if (parsed_headers[h].includes(cache_control_busting[ccb])) {
        // console.log('cache is busted:', h, cache_control_busting[ccb])
        return '<li>Not publicly cacheable</li>'
        // break
      }
    }
  }
};

function private_cache_check(){
  headers_input = document.getElementsByName('input_headers')[0].value;
  var parsed_headers = parse_headers(headers_input)
  //check for the caching privately based on something
}

function cache_duration_check(){
  headers_input = document.getElementsByName('input_headers')[0].value;
  var parsed_headers = parse_headers(headers_input)
  //check for the cache duration based on max-age
}

function build_explain_cache_html() {
  caching_explain_area = document.querySelector('#caching_explain_area');
  caching_explain_area.innerHTML = public_cache_check();
  //private cache
  //cache duration
}
