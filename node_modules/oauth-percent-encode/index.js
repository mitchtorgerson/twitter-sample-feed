/**
 * Percent encoder, as described on
 * https://dev.twitter.com/docs/auth/percent-encoding-parameters
 * RFC 3986, Section 2.1
 * @param  {String} string
 * @return {String}
 */

module.exports = function (string) {
    var char, charCode, i;
    var encodedString = '';

    for (i=0; i<string.length; i++) {
      char = string.charAt(i); 
      if ((char >= '0' && char <= '9') ||
        (char >= 'A' && char <= 'Z') ||
        (char >= 'a' && char <= 'z') ||
        (char == '-') || (char == '.') || 
        (char == '_') || (char == '~')) {
        encodedString += char;
      } else {
        charCode = string.charCodeAt(i);
        encodedString += '%' + charCode.toString(16).toUpperCase();
      }
    }
    return encodedString;
};
