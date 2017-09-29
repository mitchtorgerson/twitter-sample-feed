var socketUrl = "ws://localhost:8001";
var APP;
var WS = function() {
    return {
        send: function(txt, func) {
            APP.send(txt);
        },

        connect: function() {
            APP = new WebSocket(socketUrl);
            
            APP.onopen = function (event) {
            
            };
            
            APP.onerror = function (event) {
                APP.close();
            };
            
            APP.onmessage = function (event) {
                if (APP.readyState == 1) {
                    var oData = JSON.parse(event.data);
                    
                    $("#feedTotal").html(oData.total);
                    $("#avgPerHour").html(oData.hourAvg || "Calculating...");
                    $("#avgPerMin").html(oData.minAvg || "Calculating...");
                    $("#avgPerSec").html(oData.secAvg || "Calculating...");
                    $("#withEmojis").html(oData.withEmojis + " %");
                    $("#topEmojis").html(oData.topEmojis);
                    
                    var displayTags = "";
                    for (var i = 0; i < oData.topHashtags.length; i++) {
                        displayTags += "<div>#" + oData.topHashtags[i] + "</div>";
                    }
                    $("#topHashtags").html(displayTags);
                    
                    $("#withUrl").html(oData.withUrl + " %");
                    $("#withPhotoUrl").html(oData.withPhotoUrl + " %");
                    
                    var displayDomains = "";
                    for (var j = 0; j < oData.topDomains.length; j++) {
                        displayDomains += "<div>" + oData.topDomains[j] + "</div>";
                    }
                    $("#topDomains").html(displayDomains);
                }
            };
        }
    }
}();

WS.connect();

$(window).on('unload', function() {
    APP.close();
});