nfcRing.nfcEvent = {
  init: function(){

      // BELOW NEEDS A REFACTOR
      if(typeof cordova !== 'undefined'){
        console.log("Checking for intent");
        window.plugins.webintent.hasExtra(window.plugins.webintent.EXTRA_TEXT,
          function(hasExtra) {
            if(hasExtra){
              app.intentEvent()
            }
          }, function() {
            console.log("ERROR XVMA172");
          }
        );
      }

      window.plugins.webintent.onNewIntent(function() {
        console.log("new intent event detected");
        try{
          window.plugins.webintent.hasExtra(window.plugins.webintent.EXTRA_TEXT,
            function(hasExtra) {
              if(hasExtra){
                console.log("Intent passed, handling that way");
                app.intentEvent();
              }
            }
          );
        }catch(e){
          console.log("error getting value");
        }
      });


    if (typeof nfc === 'undefined') return false;
    if (device.platform !== "Win32NT") { // win 32s listener imlpementation is TERRIBLE, DO NOT USE
      console.log("NFC Found, adding listener");
      // Android requires both listeners -- It then choses which event to fire
      // Because we currently only support Android and WP we don't need to wrap this in an If

      nfc.addTagDiscoveredListener(function (nfcEvent) {
//        alert("NFC Event, IE tag or ring introduced to the app");
        nfcRing.nfcEvent.readOrWrite(nfcEvent, "notNDEF");
      }, function () {
        console.log("Success.  Listening for rings..");
      }, function () {
        alert(html10n.get("writeRing.noNFC"));
        $('#createNew, #read, #scan').attr('disabled', 'disabled');
      });

      nfc.addNdefListener(function (nfcEvent) {
        console.log("Beginning of NFC Ndef event");
        console.log("reading NDEF value from tag!", nfcEvent);
        nfcRing.nfcEvent.readOrWrite(nfcEvent, "ndef");
        console.log("end of NDEF value tag event");
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
  readOrWrite: function(nfcEvent, type){ // Should we read or write to an NFC Event?
    // console.log("Read or write event", nfcEvent, nfcRing.userValues.activity, type);
    alert(nfcRing.userValues.location); // This is index and that's wrong!!
    if(nfcRing.userValues.location !== "writeRing"){
      console.log("We're not on a write or read page so do nothing");
      return false;
    }

    alert(2);
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
      nfcRing.userValues.tagSize = nfcEvent.tag.maxSize || nfcEvent.tag.freeSpaceSize; // saves the size
      localStorage.setItem("tagSize", nfcRing.userValues.tagSize);
      nfcRing.userValues.uid = nfcEvent.tag.id.join(",");
      nfcRing.registration.isValidUid(function(isValid){
        if(isValid){
          nfcRing.ui.displayPage("register");
        }else{
          alert("NOT NFC RING");
        }
      });
    }
    alert("fin read or write");
  },
  write: function(nfcEvent){ // Write an NFC NDEf record
    console.log("Clearing help Timeout");
    clearTimeout(nfcRing.ui.helpTimeout);
    $('#needHelp').hide();
    console.log("Write values are", nfcRing.userValues.toWrite);
    console.log("nfcRing.userValues.isUrl", nfcRing.userValues.isUrl);

    var isURL = nfcRing.userValues.isUrl;

    console.log("isURL", isURL);
    if (isURL) {
      console.log("URL Record");

      // does the uri have http as the first 4 characters?
      console.log("First 4 letters of userValue", nfcRing.userValues.toWrite.substring(0,4));
      if(nfcRing.userValues.toWrite.substring(0,4) !== "http"){
        // Note on the gruonds of security: prefixing with http is fine for now, however https is prefered however
        // sites IE beta.etherpad.org should redirect to https on the server.
        console.log("URL did not begin with http so prefixing http://");
        nfcRing.userValues.toWrite = "http://"+nfcRing.userValues.toWrite;
      }
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
        navigator.notification.confirm(html10n.get("sweetSpot.askToShare"), function(shareLocation){
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
      console.log("Writing failed!", reason);
      alert(reason, false, html10n.get("writeRing.fail"));
      console.log("Inlay write failed", reason);
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
    var record = nfcEvent;
    var ring = nfcEvent.tag;
    var record = nfcEvent.tag.ndefMessage[0];
    var recordType = nfc.bytesToString(record.type);

    if (recordType === "T") {
      var langCodeLength = record.payload[0],
      text = record.payload.slice((1 + langCodeLength), record.payload.length);
      payload = nfc.bytesToString(text);
    } else if (recordType === "U") {
      console.log("URL");
      var identifierCode = record.payload.shift(),
      uri =  nfc.bytesToString(record.payload);
      if (identifierCode !== 0) {
        console.log("WARNING: uri needs to be decoded");
      }
      payload = uri;
    } else {
        // kludge assume we can treat as String
        payload = nfc.bytesToString(record.payload); 
    }

    if(ring.ndefMessage){
      console.log(payload, false, "Ring contents:");
      alert(payload, false, html10n.get("readRing.contents"));
    }else{
      alert("No NDEF data found", false, "Unable to read");
    }
  },
  isValidURL: function(url){ // Is NFC NDEF Record a Valid URL
    // borrowed with great pride from http://stackoverflow.com/questions/1701898/how-to-detect-whether-a-string-is-in-url-format-using-javascript after many others failed..
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re=new RegExp(strRegex);
    return re.test(url);
  }
}
