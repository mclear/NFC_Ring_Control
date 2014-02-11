nfcRing.nfcEvent = {
  init: function(){
    if (nfc && device.platform !== "Win32NT") { // win 32s listener imlpementation is TERRIBLE, DO NOT USE
      console.log("NFC Found, adding listener");
      // Android requires both listeners -- It then choses which event to fire
      // Because we currently only support Android and WP we don't need to wrap this in an If
      nfc.addTagDiscoveredListener(function (nfcEvent) {
        nfcRing.readOrWrite(nfcEvent);
        console.log("Attempting to bind to NFC TAG");
      }, function () {
        console.log("Success.  Listening for rings..");
      }, function () {
        alert("NFC Functionality is not working, is NFC enabled on your device?");
        $('#createNew, #read, #scan').attr('disabled', 'disabled');
      });

      nfc.addNdefListener(function (nfcEvent) {
        nfcRing.readOrWrite(nfcEvent);
        console.log("Attempting to bind to NFC NDEF");
      }, function () {
        console.log("Success.  Listening for rings NDEF records..");
      }, function () {
        alert("NFC Functionality is not working, is NFC enabled on your device?");
        $('#createNew, #read, #scan').attr('disabled', 'disabled');
      });

    } else {
      console.log("NO NFC, SOMETHING IS WRONG HERE");
    }
  }, // create Event listeners
  readOrWrite: function(nfcEvent){}, // Should we read or write to an NFC Event?
  write: function(nfcEvent){}, // Write an NFC NDEf record
  read: function(nfcEvent){}, // Read an NFC NDEF record
  isValidURL: function(url){} // Is NFC NDEF Record a Valid URL
}
