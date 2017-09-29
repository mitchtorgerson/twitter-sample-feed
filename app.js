const express = require('express');
const app = express();
app.use(express.static('public'));
    
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const json = require('json-string');
const EmojiData = require('emoji-data');
const findHashtags = require('find-hashtags');
const getUrls = require('get-urls');
const parseDomain = require('parse-domain');
const isImageUrl = require('is-image-url');

const ws = require("nodejs-websocket");
const Twitter = require('twitter');
 
var twitterClient = new Twitter({
  consumer_key: process.env.CKEY,
  consumer_secret: process.env.CSECRET,
  access_token_key: process.env.TOKEN,
  access_token_secret: process.env.TSECRET
});

var clear = 10000;
var stats = 10000;
var prevTweets = 0;
var totalTweets = 0;
var perSec = 0;
var perMin = 0;
var perHour = 0;

var totalEmojis = 0;
var withEmojis = 0;
var allEmojis = [];
var topEmojis = [];

var allHashtags = [];
var topHashtags = [];

var withUrls = 0;
var totalUrls = 0;
var totalImageUrls = 0;
var withImage = 0;
var allUrls = [];
var topUrls = [];
    
var stream = twitterClient.stream('statuses/sample', {}, function(stream) {
    stream.on('data', function(data) {
        totalTweets++;
        
        if (totalTweets%clear == 0) {
            allEmojis = topEmojis;
            allHashtags = topHashtags;
            allUrls = topUrls;
        }
        
        // Parse emoji data
        EmojiData.scan(data.text).forEach(
            function(ec) {
                allEmojis.push(ec.render());
                totalEmojis++;
                withEmojis = Math.round((totalEmojis/totalTweets) * 100);                
                topEmojis = getTopNumber(allEmojis, 5);
            }
        );
        
        // Parse hashtag data
        var hashTags = findHashtags(data.text);
        if (hashTags.length) {
            allHashtags = allHashtags.concat(hashTags);
            topHashtags = getTopNumber(allHashtags, 5);
        }
        
        // Parse url data
        var urls = getUrls(data.text);
        urls = Array.from(urls);
        if (urls.length) {
            totalUrls++;
            urls.forEach(function(url, idx) {
                var d = parseDomain(url);
                if (d) {
                    urls[idx] = d.domain + '.' + d.tld;
                }
                if (isImageUrl(url)) {
                    totalImageUrls++;
                }
            });
            
            allUrls = allUrls.concat(urls);
            withUrls = Math.round((totalUrls/totalTweets) * 100);
            withImage = Math.round((totalImageUrls/totalTweets) * 100);
            topUrls = getTopNumber(allUrls, 5);
        }
        
        // Save the object for the client
        var sObj = json({
            total: totalTweets,
            hourAvg: perHour,
            minAvg: perMin,
            secAvg: perSec,
            withEmojis: withEmojis,
            topEmojis: topEmojis,
            topHashtags: topHashtags,
            withUrl: withUrls,
            withPhotoUrl: withImage,
            topDomains: topUrls
        });
        
        // Send the object to the client
        server.connections.forEach(function (conn) {
            conn.sendText(sObj);
        });
    });
     
    stream.on('error', function(error) {
        console.log("ERROR: " + error);
        //  error;
    });
    
    setTimeout(countInterval, stats);
});

function countInterval() {
    var diff = totalTweets - prevTweets;
    
    perSec = Math.round(diff / (stats / 1000));
    perMin = (perSec * 60);
    perHour = (perMin * 60);

    prevTweets = totalTweets;
    
    setTimeout(countInterval, stats);
}

function getTopNumber(arr, num) {
    var counts = arr.reduce(function(map, name) {
        map[name] = (map[name] || 0) + 1;
        return map;
    }, {});

    var sorted = Object.keys(counts).sort(function(a, b) {
        return counts[b] - counts[a];
    });

    return sorted.slice(0, num);
}

app.get('/', function (req, res) {
    res.render('index.ejs', {body: 'stream started'});
});

var server = ws.createServer(function (conn) {
    console.log("New websocket connection on 8001");
    conn.on("text", function (str) {
    
    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    });
}).listen(8001);
    
app.listen(3000, function () {
  console.log('Port 3000 Running');
});