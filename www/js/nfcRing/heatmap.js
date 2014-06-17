nfcRing.heatmap = {
  coOrds: {}, // The Co-Ordinates we have stored for this phone
  coOrdData: {
    data: []
  },

  init: function(){

    nfcRing.heatmap.loadFromRemote(function(){

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

  loadFromRemote: function(callback){ // Getting data from Parse..

    try{
      if(!device){return false;}
    }catch(e){
      return false;
    }

    var coOrdinateCounter = {};
    var model = device.model;

    $.getJSON("http://sweetspot.nfcring.com/api/v1/sweetspot?model="+model).done(function(results){
      results = JSON.parse(results);
      for (var i = 0; i < results.length; i++) { 
        var object = results[i];
        var x = object.x;
        var y = object.y;
        // Turns it into a counted set of objects instead of single objects
        coOrdinateCounter[x+":"+y] = coOrdinateCounter[x+":"+y] || 1;
      }
      console.log("Got results from Parse", coOrdinateCounter);

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

    });
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
