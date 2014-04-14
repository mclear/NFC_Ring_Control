nfcRing.heatmap = {
  coOrds: {}, // The Co-Ordinates we have stored for this phone
  coOrdData: {
    data: []
  },

  init: function(){

    nfcRing.heatmap.loadFromParse(function(){

      if($('#heatMap canvas').length >= 1){
        console.log("Heatmap already drawn");
        return;
      }

      // Initialize the heatmap
      nfcRing.heatmap.config = { // Our heatmap config
        element: document.getElementById("heatMap"),
        radius: 30,
        opacity: 100
      }

      nfcRing.heatmap.coOrdData = {};
      nfcRing.heatmap.coOrdData.max = 20;
      nfcRing.heatmap.coOrdData.data = [];

      $.each(nfcRing.heatmap.coOrds, function(k,v){
        var x = k.split(":")[0];
        var y = k.split(":")[1];
        x = Number(x);
        y = Number(y);
        if(x >= 0 && y >= 0){
          var coOrd = {
            x: x,
            y: y,
            count: v*10
          };
          nfcRing.heatmap.coOrdData.data.push(coOrd);
        }
      });

      console.log("1. initiating heatmap");
      window.hm = h337.create(nfcRing.heatmap.config);
      console.log("2. Writing data to heatmap", nfcRing.heatmap.coOrdData);
      window.hm.store.setDataSet(nfcRing.heatmap.coOrdData);
      console.log("3. Done writing data to the heatmap");
    });
  }, 

  draw: function(){ // Draw the data from our coOrds onto the heatmap

  }, 

  loadFromParse: function(callback){ // Getting data from Parse..
    parseInitSS();
    var coOrdinateCounter = {};
    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    var query = new Parse.Query(TestObject);
    try{
      if(!device){return false;}
    }catch(e){
      return false;
    }
    query.equalTo("model", device.model);
    console.log("Model", device.model);
    try{
      query.find({
        success: function(results){
          for (var i = 0; i < results.length; i++) { 
            var object = results[i];
            var x = object.get('x');
            var y = object.get('y');
            // Turns it into a counted set of objects instead of single objects
            coOrdinateCounter[x+":"+y] = coOrdinateCounter[x+":"+y] || 1;
            console.log("Got results from Parse", coOrdinateCounter);
          }
          if(results.length == 0){ // if there are no results
            console.log("no results from parse");
          }else{ // there are some heatmap results so let's draw em
            console.log("0. Drawing heatmap");
            if($('#heatMap canvas').length < 1){
              nfcRing.heatmap.coOrds = coOrdinateCounter;
            }
            // nfcRing.drawHeatMap();
            callback();
          }
        },
        failure: function(){
          // fires on failure to connect
          $('#writeRingTitle').html(html10n.get('sweetSpot.unableToConnect'));
        }
      });
    }catch(e){
      // Windows Phone wont do the Parse XHR request and fails on access is denied, this should be handled by the Parse API but it isn't so we handle it here
      if(device.platform === "Win32NT"){
        $('#writeRingTitle').html("Windows Phone is unable to use our Community Sweet Spot location servers, we hope to get this fixed as soon as possible, sorry");
        console.log("Unable to process Parse on WP");
      }
    }
  },

  sendToParse: function(x,y,phoneModel){
    parseInitSS();
    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    testObject.save({x: x, y: y, model: phoneModel, guid: nfcRing.userValues.uid}, {
      success: function(object) {
        alert(html10n.get("sweetSpot.yay"), false, html10n.get("sweetSpot.done"));
        nfcRing.ui.displayPage("index"); // Return user back to start page
      },
      failure: function(e){
        // TODO: i18n me
        alert("Unable to share details with others, is your Internet enabled?")
      }
    });
  }
}
