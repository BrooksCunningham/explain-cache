myList = document.querySelector('ul');

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
}


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

function updateHtmlWithCacheExplained(headers_input) {
  fetch('./cache-headers-and-values.json')
  .then(status)
  .then(json)
  .then(function(data) {
    // get the value input by the user
    if (document.getElementsByName('input_headers')[0].value.length > 2) {
      headers_input = document.getElementsByName('input_headers')[0].value;
    };
    var parsed_headers = parse_headers(headers_input)
    // console.log("Parsed headers:  " + JSON.stringify(parsed_headers));
    // console.log("Header input:  " + headers_input);


    document.getElementById("demo").innerHTML = "YOU CLICKED THE BUTTON : " + headers_input;
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
          // console.log('header:', h, 'parsed_headers:', parsed_headers[h]);
        };

        if (data.Headers[i].Name.includes(h)) {
          // console.log('hit1')
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
  var public_cache_control_busting = ['no-store', 'no-cache']

  for (h in parsed_headers) {
    for (ccb in public_cache_control_busting) {
      // console.log('hit1:', h, parsed_headers[h], ', ccb:', cache_control_busting[ccb])
      if (parsed_headers[h].includes(public_cache_control_busting[ccb])) {
        return 'Not publicly cacheable'
      }
    }
  }
  return 'May be publicly cacheable'
};

function private_cache_check(){
  var cache_output_array = [];
  headers_input = document.getElementsByName('input_headers')[0].value;
  var parsed_headers = parse_headers(headers_input)
  //check for the caching privately based on something
  var private_cache_control_busting = ['no-store', 'no-cache']

  for (h in parsed_headers) {
    for (ccb in private_cache_control_busting) {
      // console.log('hit1:', h, parsed_headers[h], ', ccb:', cache_control_busting[ccb])
      if (parsed_headers[h].includes(private_cache_control_busting[ccb])) {
        cache_output_array.push('Not privately cacheable')
        return cache_output_array
      }
    }
  }
  for (h in parsed_headers) {
    if (parsed_headers[h].includes('private')) {
      cache_output_array.push('May be privately cacheable')
    }
  }
  return cache_output_array
}

function cache_duration_check(){
  var cache_output_array = [];
  headers_input = document.getElementsByName('input_headers')[0].value;
  var parsed_headers = parse_headers(headers_input)
  //check for the cache duration based on max-age
  // var cache_control_duration = ['max-age', 'expires']

  for (h in parsed_headers) {
    if (h.includes('cache-control') && parsed_headers[h].includes('max-age')) {
      csv_array = CSVToArray(parsed_headers[h])[0]
      for (i in csv_array) {
        if (csv_array[i].includes('max-age')) {
          cache_output_array.push('May cache based on max-age for ' + csv_array[i].split('=')[1] + ' second.')
          // return 'May cache based on max-age for ' + csv_array[i].split('=')[1] + ' second.'
        }
      }
    }
  }
  // https://www.w3.org/TR/edge-arch/ Surrogate-control
  for (h in parsed_headers) {
    if (h.includes('Surrogate-Control') && parsed_headers[h].includes('max-age')) {
      csv_array = CSVToArray(parsed_headers[h])[0]
      for (i in csv_array) {
        if (csv_array[i].includes('max-age')) {
          cache_output_array.push('Proxy may cache based on max-age for ' + csv_array[i].split('=')[1] + ' second.')
          // return 'Proxy may cache based on max-age for ' + csv_array[i].split('=')[1] + ' second.'
        }
      }
      // cache_output_array.push('Proxy may cache for duration')
      // return 'Proxy May cache for duration'
    }
  }
  //if no cache duration specified
  if (cache_output_array.length < 1) {
    cache_output_array.push('May NOT cache for duration')
  }

  // return 'May NOT cache for duration'
  return cache_output_array
}

function add_list_to_html(string_data) {
  console.log(string_data)
  return document.querySelector('#caching_explain_area').appendChild(document.createElement("li")).appendChild(document.createTextNode(string_data))}

function build_explain_cache_html() {
  caching_explain_area = document.querySelector('#caching_explain_area');
  caching_explain_area.innerHTML = ''
  // caching_explain_area.innerHTML += public_cache_check();
  add_list_to_html(public_cache_check())
  // caching_explain_area.innerHTML += private_cache_check();
  add_list_to_html(private_cache_check())
  // caching_explain_area.innerHTML += cache_duration_check();
  add_list_to_html(cache_duration_check())
}
