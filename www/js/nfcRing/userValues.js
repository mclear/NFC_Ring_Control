nfcRing.userValues = { // stuff like what value we're going to write
  toWrite: "", // Action value
  location: "", // Our current location
  localSweetSpot: {
    value: function(){}, // The Local Sweet Spot location
    set: function(sweetSpot){}, // Save the Local Sweet Spot location
  },
  history: {
    value: {}, // The users previous action history
    set: function(){}, // Save the users previous action history
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

