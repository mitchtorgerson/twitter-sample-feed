var should = require('chai').should();
var percentEncode = require('../index.js');

describe('percent encode', function() {
  it('percent encode aAgGzZ039', function() {
    percentEncode('aAgGzZ039').should.equal('aAgGzZ039');
  });

  // TODO, more test cases
  it('percent encode a', function() {
    percentEncode('a').should.equal('a');
  });
});

