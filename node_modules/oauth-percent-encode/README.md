oauth-percent-encode
==============

Just one utility function for percent encoding strings as described in RFC 3986, Section 2.1
  
This can be used when creating OAuth signatures, since OAuth require strings to be encoded according to RFC 3986, Section 2.1.

The way this encoding function works is described for example on the Twitter developer page https://dev.twitter.com/docs/auth/percent-encoding-parameters

And as written on that page..: "Since many implementations of URL encoding algorithms are not fully compatible with RFC 3986, bad encodings are a cause of many OAuth signature errors. For this reason, the exact signing algorithm to use is covered on this page."

This function aims at solving that.  
  
  
## Installation

  npm install oauth-percent-encode --save

## Dependencies

  There are no dependencies for execution.  
  To run the testcases, you need mocha and chai.  
  mocha and chai are installed by 'npm install'.

## Usage

  var percentEncode = require('oauth-percent-encode');

  console.log('Percent encoding string "A message": ' +
      percentEncode('A message'));

## Tests

  npm install  
  npm test

## Author

  Mattias Erlo, <mattias.erlo@gmail.com>

## License

  BSD2-clause

## Release History

* 0.1.2 Updated readme
* 0.1.1 Updated readme
* 0.1.0 Initial release

