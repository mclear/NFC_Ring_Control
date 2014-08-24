var app = {
  initialize: function () {
    this.bind();
  },
  bind: function () {
    document.addEventListener('deviceready', this.deviceready, false);
  },
  deviceready: function () {

    // See http://docs.phonegap.com/en/edge/cordova_notification_notification.md.html#Notification
    alert = navigator.notification.alert;
    prompt = navigator.notification.prompt;
    confirm = navigator.notification.confirm;

    // Begin listening for NFC Tags
    nfcRing.nfcEvent.init();

    if (device.platform == "Win32NT") {
      $('#read').hide();
      $('.win32').show(); // Note to Designer, by default this needs to be hidden
    }

    // Handle back events
    document.addEventListener("backbutton", nfcRing.ui.handleBack, false);

    FastClick.attach(document.body);

  },
  intentEvent: function() {
    // alert("Intent passed, handling that way");
    window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT, function(value) {
      if(!value) value = "http://nfcring.com/getStarted";

      // console.log("Intent value is ", value);
      nfcRing.userValues.activity = "write";
      nfcRing.userValues.toWrite = value;
      nfcRing.userValues.location = "writeRing";
      // nfcRing.userValues.intent = true;

      // If the first chars are http we should assume this is a URL
      // We need this functionality for intent events
  
      if(nfcRing.userValues.toWrite.substring(0,4) === "http"){
        nfcRing.userValues.isUrl = true;
        console.log("deciding it's a url");
      }

      nfcRing.heatmap.init();
      nfcRing.ui.displayPage("writeRing");
      nfcRing.ui.prepareWritePage("write");

    }, function(){
      console.log("ERROR XVMA123");
    });
  }
};

window.onerror = function(e,f,g){
   console.log("window.onerror ", e, f, g);
};
