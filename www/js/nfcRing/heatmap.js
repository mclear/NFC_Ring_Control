nfcRing.heatmap = {
  coOrds: {}, // The Co-Ordinates we have stored for this phone
  coOrdData: {
    max: 10,
    data: []
  },

  init: function(){

    nfcRing.heatmap.loadFromParse(function(){

      // Initialize the heatmap
      var config = { // Our heatmap config
        element: document.getElementById("heatMap"),
        radius: 30,
        opacity: 100
      }

      $.each(nfcRing.heatmap.coOrds, function(k,v){
        var x = k.split(":")[0];
        var y = k.split(":")[1];
        var coOrd = {
          x: x,
          y: y,
          count: v*5
        };

        console.log("COSY", nfcRing.heatmap.coOrds, nfcRing.heatmap.coOrdData);

        nfcRing.heatmap.coOrdData.data.push(coOrd);

      });

      console.log("COSY", nfcRing.heatmap.coOrds, nfcRing.heatmap.coOrdData);


      console.log("initiating heatmap");
      var heatmap = h337.create(config);
      console.log("Writing data to heatmap", nfcRing.heatmap.coOrds, nfcRing.heatmap.coOrdData);
      heatmap.store.setDataSet(nfcRing.heatmap.coOrdData);
      console.log("Done writing data to the heatmap");
    });
  }, 

  draw: function(){ // Draw the data from our coOrds onto the heatmap

  }, 

  loadFromParse: function(callback){ // Getting data from Parse..
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
            // TODO i18n this
            $('#writeRing .inner > .actionName').html("<h2>Hold your NFC Ring to the back of your phone at the location indicated by the colored dots.</h2>");
            var object = results[i];
            var x = object.get('x');
            var y = object.get('y');
            // Turns it into a counted set of objects instead of single objects
            coOrdinateCounter[x+":"+y] = coOrdinateCounter[x+":"+y] || 1;
            console.log("Got results from Parse", coOrdinateCounter);
          }
          if(results.length == 0){ // if there are no results
            // TODO i18n this
            console.log("no results from parse");
            $('#writeRing .inner > .actionName').html("<h2>It looks like our awesome community hasn't stored a location of the NFC Sweet Spot for your phone yet.</h2><p>Move the ring around the back of the phone until you recieve a confirmation.  This can take a little bit of time so be patient :)</p>");
          }else{ // there are some heatmap results so let's draw em
            console.log("Drawing heatmap");
            nfcRing.heatmap.coOrds = coOrdinateCounter;
            // nfcRing.drawHeatMap();
            callback();
          }
        },
        failure: function(){
          // fires on failure to connect
          // TODO i18n this
          $('#writeRing .inner > .actionName').html("We were unable to connect to our community sweet spot location servers, the sweet spot location will help you identify where to hold the ring on your phone.  You might need to turn on your Internet connection to access our servers, thanks");
        }
      });
    }catch(e){
      // Windows Phone wont do the Parse XHR request and fails on access is denied, this should be handled by the Parse API but it isn't so we handle it here
      if(device.platform == "Win32NT"){
        $('#writeRing .inner > .actionName').html("Windows Phone is unable to use our Community Sweet Spot location servers, we hope to get this fixed as soon as possible, sorry");
        console.log("Unable to process Parse on WP");
      }
    }
  },

  sweetSpot : {
    send: function(e){
      $('#bubble').show();
      var centerX = e.clientX - ($('#bubble').width()/2); // get the center of the bubble
      var centerY = e.clientY - ($('#bubble').height()/2);
      var guid = nfcRing.userValues.guid;
      $('#bubble').css({
        top: centerY+"px",
        left: centerX+"px"
      })
      setTimeout(function(){
        var correctLocation = confirm("Looks good!  Is the red dot close to where the ring works with your phone?");
        if(correctLocation){
          localStorage.setItem("sweetSpotLocation", JSON.stringify({x: centerX, y:centerY})); // store to localstorage
          var phoneModel = device.model; 
          console.log("Sending ", centerX, centerY, phoneModel, " to Database");
          try{
            nfcRing.heatmap.sendToParse(centerX, centerY, phoneModel);
          }catch(e){
            alert("FAILED"); // TODO i18n me
          }
        }
      }, 100);
    }
  },

  sendToParse: function(x,y,phoneModel){
    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    testObject.save({x: x, y: y, model: phoneModel, guid: nfcRing.userValues.guid}, {
      success: function(object) {
        // TODO: i18n me
        alert("Yay!  It worked.  Thank you for being awesome");
        nfcRing.ui.displayPage("index"); // Return user back to start page
      },
      failure: function(e){
        // TODO: i18n me
        alert("Unable to share details with others, is your Internet enabled?")
      }
    });
  }
}
