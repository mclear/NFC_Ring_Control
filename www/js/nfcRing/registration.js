nfcRing.registration = {
  isValidUid: function(callback){ // Getting data from Parse..
    var uid = nfcRing.userValues.uid;
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
      // Windows Phone wont do the Parse XHR request and fails on access is denied, this should be handled by the Parse API but it isn't
      if(device.platform === "Win32NT"){
        $('#writeRingTitle').html("Windows Phone is unable to handle registrations at this time");
        console.log("Unable to process Parse on WP");
      }
    }
  },


  registerUser: function(){
    parseInitUsers();
    var user = new Parse.User();
    var email = $('#emailInput').val();
    var pwd = $('#passwordInput').val();
    console.log("Creating new user");
    user.set("username", email);
    user.set("password", pwd);
    user.set("uid", nfcRing.userValues.uid);

    user.signUp(null, {
      success: function(user) {
        alert(html10n.get("register.success"));
        nfcRing.ui.displayPage("index");
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        if(error.code === 202){
          navigator.notification.confirm(html10n.get("register.resetPasswordPrompt"), nfcRing.registration.passwordResetConfirm, html10n.get("register.resetPasswordPromptTitle"));
        }else{
          alert("Error: " + error.code + " " + error.message);
        }
      }
    });
  },


  passwordResetConfirm: function(wantToReset){
    if(wantToReset === 1){
      window.open('https://me.nfcring.com/validationCodeReset', '_system');
    }
  }
}
