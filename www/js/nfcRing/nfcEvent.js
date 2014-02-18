nfcRing.nfcEvent = {
  init: function(){

    if (typeof nfc === 'undefined') return false;
    if (device.platform !== "Win32NT") { // win 32s listener imlpementation is TERRIBLE, DO NOT USE
      console.log("NFC Found, adding listener");
      // Android requires both listeners -- It then choses which event to fire
      // Because we currently only support Android and WP we don't need to wrap this in an If

      nfc.addTagDiscoveredListener(function (nfcEvent) {
        console.log("NFC Event, IE tag or ring introduced to the app");
        nfcRing.nfcEvent.readOrWrite(nfcEvent);
        console.log("Attempting to bind to NFC TAG");
      }, function () {
        console.log("Success.  Listening for rings..");
      }, function () {
        alert(html10n.get("writeRing.noNFC"));
        $('#createNew, #read, #scan').attr('disabled', 'disabled');
      });
      nfc.addNdefListener(function (nfcEvent) {
        nfcRing.nfcEvent.readOrWrite(nfcEvent);
        console.log("Attempting to bind to NFC NDEF");
      }, function () {
        console.log("Success.  Listening for rings NDEF records..");
      }, function () {
        alert(html10n.get("writeRing.noNFC"));
        $('#createNew, #read, #scan').attr('disabled', 'disabled');
      });

    } else {
      console.log("NO NFC, SOMETHING IS WRONG HERE");
    }

  }, // create Event listeners
  readOrWrite: function(nfcEvent){ // Should we read or write to an NFC Event?
    console.log("Read or write event", nfcEvent, nfcRing.userValues.activity);
    $('#message').hide(); // hide help message

    if(nfcRing.userValues.activity == "write"){
      console.log("Doing write event", nfcEvent);
      nfcRing.nfcEvent.write(nfcEvent);
      $('#writeRing').show();
    }

    if(nfcRing.userValues.activity == "read"){
      nfcRing.nfcEvent.read(nfcEvent);
    }

    if(nfcRing.userValues.activity == "register"){
      console.log("nfcEvent", nfcEvent);
      nfcRing.userValues.uid = nfcEvent.tag.id.join(",");
      nfcRing.registration.isValidUid(function(isValid){
        if(isValid){
          nfcRing.ui.displayPage("register");
        }else{
          alert("NOT NFC RING");
        }
      });
    }
  },
  write: function(nfcEvent){ // Write an NFC NDEf record
    clearTimeout(nfcRing.ui.helpTimeout);
    $('#needHelp').hide();
    // If the string is a valid URL
    var isURL = nfcRing.nfcEvent.isValidURL(nfcRing.userValues.toWrite);

    if (isURL) {
      console.log("URL Record");
      var ndefRecord = ndef.uriRecord(nfcRing.userValues.toWrite); // Creates a URI record
    } else {
      console.log("Text record");
      // The string must be a text record as that's the only other type we support
      var ndefRecord = ndef.textRecord(nfcRing.userValues.toWrite); // Creates a Text record
    }

    nfc.write([ndefRecord], function () {
      navigator.notification.vibrate(100);
      console.log("Written", ndefRecord);
      var dontAskSweetSpotAgain = localStorage.getItem("dontAskSweetSpotAgain");
      console.log("dontAskSweetSpotAgain", dontAskSweetSpotAgain);
  
      if (dontAskSweetSpotAgain === "true") { // we should ask for the sweet spot
        alert(html10n.get("writeRing.ready"), false, html10n.get("writeRing.woohoo"));
      } else {
        confirm(html10n.get("sweetSpot.askToShare"), function(shareLocation){
          console.log("Share location response", shareLocation);
          if (shareLocation === 1) {
            console.log("Set localstorage item dont ask sweet spot again");
            localStorage.setItem("dontAskSweetSpotAgain", true);
            console.log("nfcEvent", nfcEvent)
            if (!nfcEvent) nfcEvent = {}; // Hack as WP8 doesn't pass event always
            if (!nfcEvent.tag) nfcEvent.tag = {}; // Continued Hack
            if (nfcEvent.tag.id) {
              var idStr = nfcEvent.tag.id.join(",");
            } else {
              var idStr = "false";
            }
            // Why do I need ID?
            nfcRing.userValues.uid = idStr;
            nfcRing.ui.displayPage("sweetSpot");
          } else {
            localStorage.setItem("dontAskSweetSpotAgain", true);
          }
        }, html10n.get("sweetSpot.done")); 
      }

      // This may seem crazy but WP needs to continue to call this but we should wait two seconds
      if (device.platform === "Win32NT") {
        setTimeout(function () {
          nfcRing.nfcEvent.write(false)
        }, 2000);
      }else{
        $('#needHelp').hide(); // dont hide this on win32 but do if there is a write event on any other device
      }

    }, function (reason) {
      console.log("Inlay write failed");
      // This may seem crazy but WP needs to continue to call this..
      if (device.platform === "Win32NT") {
        nfcRing.nfcEvent.write(false)
      }
    });
  }, 
  read: function(nfcEvent){ // Read an NFC NDEF record
    navigator.notification.vibrate(100);
    clearTimeout(nfcRing.ui.helpTimeout);
    $('#needHelp').hide();
    console.log("Reading", nfcEvent);
    var ring = nfcEvent.tag;
    if(ring.ndefMessage){
      ringData = nfc.bytesToString(ring.ndefMessage[0].payload); // TODO make this less fragile 
      console.log(ringData, false, "Ring contents:");
      alert(ringData, false, html10n.get("readRing.contents"));
    }else{
      alert("No NDEF data found", false, "Unable to read");
    }
  },
  isValidURL: function(url){ // Is NFC NDEF Record a Valid URL
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (!pattern.test(url)) {
      return false;
    } else {
      return true;
    }    
  }
}
