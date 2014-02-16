nfcRing.registration = {
  isValidUid: function(uid, callback){ // Getting data from Parse..
    parseInitUID();
    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    var query = new Parse.Query(TestObject);
    try{
      if(!device){return false;}
    }catch(e){
      return false;
    }
    query.equalTo("uid", uid);
    console.log("uid", uid);
    try{
      query.find({
        success: function(results){
          if(results.length == 0){ // if there are no results
            console.log("no results from parse");
            callback(false);
          }else{ // there are some heatmap results so let's draw em
            callback(true);
          }
        },
        failure: function(){
          // fires on failure to connect
          $('#writeRingTitle').html(html10n.get('sweetSpot.unableToConnect'));
          callback(false);
        }
      });
    }catch(e){
      // Windows Phone wont do the Parse XHR request and fails on access is denied, this should be handled by the Parse API but $
      if(device.platform === "Win32NT"){
        $('#writeRingTitle').html("Windows Phone is unable to handle registrations at this time");
        console.log("Unable to process Parse on WP");
      }
    }
  }
}
