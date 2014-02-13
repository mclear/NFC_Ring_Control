nfcRing.heatmap = {
  coOrds: {}, // The Co-Ordinates we have stored for this phone

  config: { // Our heatmap config
    element: document.getElementById("heatMap"),
    radius: 30,
    opacity: 100
  }, 
  init: function(){
    var heatmap = h337.create(config);
    console.log("Writing data to heatmap", nfcRing.coOrdData);
    heatmap.store.setDataSet(nfcRing.heatmap.coOrds);
    console.log("Done writing data to the heatmap");
  }, // Initialize the heatmap
  draw: function(){ // Draw the data from our coOrds onto the heatmap

  }, 

  loadFromParse: function(){ // Getting data from Parse..
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
          }
          if(results.length == 0){ // if there are no results
            // TODO i18n this
            $('#writeRing .inner > .actionName').html("<h2>It looks like our awesome community hasn't stored a location of the NFC Sweet Spot for your phone yet.</h2><p>Move the ring around the back of the phone until you recieve a confirmation.  This can take a little bit of time so be patient :)</p>");
          }else{ // there are some heatmap results so let's draw em
            console.log("Drawing heatmap");
            nfcRing.coOrds = coOrdinateCounter;
            // nfcRing.drawHeatMap();
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
  }
}
