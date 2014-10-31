nfcRing.userValues = { // stuff like what value we're going to write
  toWrite: "", // Action value
  location: "", // Our current location
  localSweetSpot: {
    value: function(){}, // The Local Sweet Spot location
    set: function(e){
      $('#bubble').show();
      var centerX = e.clientX - ($('#bubble').width()/2); // get the center of the bubble
      var centerY = e.clientY - ($('#bubble').height()/2);
      $('#bubble').css({
        top: centerY+"px",
        left: centerX+"px"
      });

      setTimeout(function(){
        navigator.notification.confirm(html10n.get('sweetSpot.looksGood'), function(correctLocation){
          console.log("correctLocation", correctLocation);
          if(correctLocation === 1){
            localStorage.setItem("sweetSpotLocation", JSON.stringify({x: centerX, y:centerY})); // store to localstorage
  
            console.log("Sending ", centerX, centerY, device.model, Math.round(window.innerWidth * window.devicePixelRatio), Math.round(window.innerHeight * window.devicePixelRatio), " to Database");
  	    try{
              nfcRing.heatmap.sendToRemote(centerX, centerY, device.model, Math.round(window.innerWidth * window.devicePixelRatio), Math.round(window.innerHeight * window.devicePixelRatio));
            }catch(e){
              nfcRing.ui.displayPage("index");
            }
          }
        });
      }, 100);

    }, // Save the Local Sweet Spot location

  },
  history: {
    value: {}, // The users previous action history

    set: function(){ // Store the event in the actionHistory
      var actionHistory = JSON.parse(localStorage.getItem("actionHistory") || "{}");
      console.log("Previous action History", actionHistory, "pushing ", nfcRing.userValues.toWrite);
      var ts = new Date().getTime();

      // Escape nfcRing.userValues.toWrite value
      actionHistory[ts] = nfcRing.userValues.toWrite;
      console.log("obj historY", ts, actionHistory);
      actionHistory = JSON.stringify(actionHistory);
      console.log("new action History", actionHistory);
      localStorage.setItem("actionHistory", actionHistory);
      nfcRing.userValues.history.value = JSON.parse(actionHistory);
    },

    get: function() { // loads action history
      nfcRing.userValues.history.value = JSON.parse(localStorage.getItem("actionHistory") || "{}");
      // Firstly we need to load them from history
      nfcRing.userValues.history.values = localStorage.getItem("actionHistory");
      if(nfcRing.userValues.history.values) nfcRing.userValues.history.values = JSON.parse(nfcRing.userValues.history.values);
      nfcRing.userValues.history.reverse(nfcRing.userValues.history.values, function(key){
        var action = this[key];
        key = parseInt(key);
        var ts = new Date(key).toISOString();
        $('#history ul').append('<li><a data-key="'+key+'" class="historical"><div id="'+key+'"></div><span>Action created/used <em class="timeago" title="'+ts+'"></em></span></a></li>');
        $('#'+key).text(action);
      });
    },

    reverse: function(obj, f) {
      // f is a function that has the obj as 'this' and the property name as first parameter
      var arr = [];
      for (var key in obj) {
        // add hasOwnPropertyCheck if needed
        arr.push(key);
      }
      for (var i=arr.length-1; i>=0; i--) {
        f.call(obj, arr[i]);
      }
    }
  } 
}

