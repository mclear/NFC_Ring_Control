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

  loadFromRemote: function(callback){ // Getting data from Remote database..

    try{
      if(!device){return false;}
    }catch(e){
      return false;
    }

    var coOrdinateCounter = {};
    var model = device.model;
    var url = "http://sweetspot.nfcring.com/api/v1/sweetspot?model="+model
    $.getJSON(url).done(function(results){
      results = JSON.parse(results);
      for (var i = 0; i < results.length; i++) { 
        var object = results[i];
        var x = object.x; // 1
        var y = object.y; // 2

        // Turns it into a counted set of objects instead of single objects
        if(coOrdinateCounter[x+":"+y]){ // If this coOrdinateCounter exists add to it
          coOrdinateCounter[x+":"+y] = coOrdinateCounter[x+":"+y] + 1;
        }else{
          coOrdinateCounter[x+":"+y] = 1;
        }
      }
      console.log("Got results from database", coOrdinateCounter);

      if(results.length == 0){ // if there are no results
        console.log("no results from database");
      }else{ // there are some heatmap results so let's draw em
        console.log("0. Drawing heatmap");
        if($('#heatMap canvas').length < 1){
          nfcRing.heatmap.coOrds = coOrdinateCounter;
          localStorage.setItem("heatMapCache", JSON.stringify(nfcRing.heatmap.coOrds));
        }
        // nfcRing.drawHeatMap();
        callback();
      }

    }).fail(function(){
      console.log("Attempting to load data from cache");
      var cachedCoOrds = localStorage.getItem("heatMapCache");
      if(cachedCoOrds){
        nfcRing.heatmap.coOrds = JSON.parse(cachedCoOrds);
        callback();      
      }
    });
  },

  sendToRemote: function(x,y,model){
    console.log("Posting to remote", x, y, model, maxX, maxY);
    var data = {
      "x": x,
      "y": y,
      "model": model,
      "maxX": maxX,
      "maxY": maxY
    }
    $.post("http://sweetspot.nfcring.com/api/v2/sweetspot", data, function(results){
      console.log("Success posting to remote");
      alert(html10n.get("sweetSpot.yay"), false, html10n.get("sweetSpot.done"));
      nfcRing.ui.displayPage("index");
    }).fail(function(){
      alert("Failed to share sweet spot location :(  Check your Internet connectivity"); 
      nfcRing.ui.displayPage("index");
    });
  }
}
