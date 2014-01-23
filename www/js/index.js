var nfcRing = {};

var app = {
  initialize: function () {
    this.bind();
  },
  bind: function () {
    document.addEventListener('deviceready', this.deviceready, false);
  },
  deviceready: function () {
    // note that this is an event handler so the scope is that of the event
    // so we need to call app.report(), and not this.report()
    console.log('deviceready');
	
	// Remove read from windows phone, it's far too buggy
    if(device.platform == "Win32NT"){
      $('#read').hide();
      // note we need to this here beacuse device isn't avialable previously..  It's a bit of a PITA but it's only temporary
    }

    // See http://docs.phonegap.com/en/edge/cordova_events_events.md.html#backbutton
	console.log("location...", nfcRing.location)
    if(nfcRing.location == "index"){
	  // Clear history so back button on home page always leaves the app
	  console.log("Cleared app history");
	  history.go(-(history.length-9999));
	  document.addEventListener("backbutton", nfcRing.handleBack, true);
      // navigator.app.clearHistory(); // This doesn't even exist in WP -- does it actually exist on Android?
    }else{
	  document.addEventListener("backbutton", nfcRing.handleBack, false);
	}

    // Windows Phone doesn't support reading MIME types..  I mean, really..  *Sigh
    if(device.platform == "Win32NT"){
      $('#read').hide();
      $('#helpContents ul').append('<li>Windows Phone requires the NFC Ring to already have a link on. To fix this grab an android handset or another App and write a URL to your phone then you will be able to use the NFC Ring Control app to write a URL</li>');
    }
	
    // See http://docs.phonegap.com/en/edge/cordova_notification_notification.md.html#Notification
    alert = navigator.notification.alert;
    prompt = navigator.notification.prompt;
    if (nfc) {
	  console.log("NFC Found, adding listener");
      nfc.addNdefListener(function (nfcEvent) {
        nfcRing.readOrWrite(nfcEvent);
        console.log("Attempting to bind to NFC");
      }, function () {
        console.log("Success.  Listening for rings..");
      }, function () {
        alert("NFC Functionality is not working, is NFC enabled on your device?");
        $('#createNew, #read, #scan').attr('disabled', 'disabled');
      });
    }else{
	  console.log("NO NFC, SOMETHING IS WRONG HERE");
	}
    
		$('#helpLink').on('click', function(e){
			e.preventDefault();
			$.magnificPopup.open({
			  items: {
			    src: '#helpContents'
			  },
			  type: 'inline',
				mainClass: 'mfp-fade',
				showCloseBtn: false,
				closeOnBgClick: false,
				callbacks: {
			    close: function() {
			    setTimeout( $('#message').fadeOut('slow'), 5000);
			    }
			  }
			}, 0);
		});

		$('#helpClose').click( function(){		
			$.magnificPopup.close();
		});
    
  }
};

function debug(msg) {
  console.log(msg);
}

nfcRing.readOrWrite = function(nfcEvent){
  $('#message').hide(); // hide help message
  if(nfcRing.toWrite){
    console.log("Doing write event", nfcEvent);
    nfcRing.write(nfcEvent);
    $('#writeRing').show();
  }else{
    nfcRing.read(nfcEvent);
  }
}

nfcRing.write = function(nfcEvent){
  // If the string is a valid URL
  var isURL = nfcRing.validURL(nfcRing.toWrite);
 
  if(isURL){
    console.log("URL Record");
    var ndefRecord = ndef.uriRecord(nfcRing.toWrite); // Creates a URI record
  }else{
    console.log("Text record");
    // The string must be a text record as that's the only other type we support
    var ndefRecord = ndef.textRecord(nfcRing.toWrite); // Creates a Text record
  }
  nfc.write([ndefRecord], function () {
    navigator.notification.vibrate(100);
    console.log("Written", ndefRecord);
    var dontAskSweetSpotAgain = localStorage.getItem("dontAskSweetSpotAgain");
    console.log("dontAskSweetSpotAgain", dontAskSweetSpotAgain);
    if(dontAskSweetSpotAgain === "true"){ // we should ask for the sweet spot
      alert("Woohooo", false, "Your ring is ready");
    }else{
      var shareLocation = confirm("Your ring is ready.  Would you like to be awesome and help others by sharing the sweet spot location for this phone model? ", false, "Woohooo");
    }
	console.log("Share location response", shareLocation);
    if(shareLocation){
	  console.log("Set localstorage item dont ask sweet spot again");
      localStorage.setItem("dontAskSweetSpotAgain", true);
	  console.log("nfcEvent", nfcEvent)
      if(nfcEvent.tag.id){
	    var idStr = nfcEvent.tag.id.join(",");
	  }else{
	    var idStr = "false";
	  }
      window.location = "shareLocation.html#?guid="+idStr;
    }else{
      localStorage.setItem("dontAskSweetSpotAgain", true);
    }
  }, function (reason) {
    console.log("Inlay write failed")
  });
}

nfcRing.read = function(nfcEvent){
  console.log("Reading")
  console.log(nfcEvent);
  var ring = nfcEvent.tag;
  console.log(ring);
  ringData = nfc.bytesToString(ring.ndefMessage[0].payload); // TODO make this less fragile 
  alert(ringData, false, "Ring contents:");
}

nfcRing.handleBack = function(){
  console.log("Handling back without any nativeness");
  
  // If we're providing an input such as a twitter username and we hit back then go back to the actions prompt page
  if(nfcRing.location === "option"){
    console.log("reloading");
    location.reload();
  }

  // When writing an NFC Ring if back button is pressed show the input page IE twitter username prompt
  if(nfcRing.location === "writing"){
    $('#option').show(); $('#writeRing').hide(); $('#heatMap').hide(); nfcRing.location = "option";
  }
  
  // When on shareLocation screen if back button is pressed we should go back to the createAction page
  if(nfcRing.location === "shareLocation") window.location = "createAction.html";

  // When on location page take back to home page
  if(nfcRing.location === "actions"){
    console.log("Redirecting back to home page");
    window.location = "index.html";
  }

  // When back on index page leave the app..
  if(nfcRing.location === "index"){
    console.log("I shouldn't be here..");
    navigator.app.exitApp();
  }
}


nfcRing.validURL = function(url) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if(!pattern.test(url)) {
    return false;
  } else {
    return true;
  }
}
