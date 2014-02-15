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

