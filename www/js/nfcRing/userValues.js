nfcRing.userValues = { // stuff like what value we're going to write
  toWrite: "", // Action value
  location: "", // Our current location
  localSweetSpot: {
    value: function(){}, // The Local Sweet Spot location
    set: function(sweetSpot){}, // Save the Local Sweet Spot location
  },
  history: {
    value: {}, // The users previous action history

    set: function(){ // Store the event in the actionHistory
      var actionHistory = JSON.parse(localStorage.getItem("actionHistory") || "{}");
//      if(ts) delete nfcRing.actionHistory[ts]; // Deletes previous record of this action
      console.log("Previous action History", actionHistory, "pushing ", nfcRing.userValues.toWrite);
      var ts = new Date().getTime();
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
        // TODO i18n me!
        $('#history ul').append('<li><a data-key="'+key+'" data-action="'+action+'" class="historical">' + action + '<span>Action created/used <em class="timeago" title="'+ts+'"></span></span></a></em>');
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

