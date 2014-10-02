var app = {
  initialize: function () {
    this.bind();
  },
  bind: function () {
    document.addEventListener('deviceready', this.deviceready, false);
    document.addEventListener('resume', this.deviceready, false);
  },
  resume: function () {
    // BELOW NEEDS A REFACTOR
    if(typeof cordova !== 'undefined'){
      console.log("Checking for intent");
      webintent.hasExtra(webintent.EXTRA_TEXT,
        function(hasExtra) {
          if(hasExtra){
            console.log("Intent passed, handling that way");
            webintent.getExtra(webintent.EXTRA_TEXT, function(value) {
              if(!value) value = "http://nfcring.com/getStarted";
              console.log("Intent value is ", value);
              nfcRing.userValues.activity = "write";
              nfcRing.userValues.intentSet = true;
              nfcRing.userValues.toWrite = value;
              setTimeout(function(){
                nfcRing.heatmap.init();
                nfcRing.ui.displayPage("writeRing");
                nfcRing.ui.prepareWritePage("write");
              }, 500);
            }, function(){
              console.log("ERROR XVMA123");
            });
          }
        }, function() {
          console.log("ERROR XVMA172");
        }
      );
    }

    webintent.onNewIntent(function(intent, test) {

      console.log("new intent event detected", intent, test);

      webintent.hasExtra(webintent.EXTRA_TEXT,
        function(hasExtra) {
          if(hasExtra){
            console.log("Intent passed, handling that way");
          }
      });

    });

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

    // BELOW NEEDS A REFACTOR
    if(typeof cordova !== 'undefined'){
      console.log("Checking for intent");
      webintent.hasExtra(webintent.EXTRA_TEXT,
        function(hasExtra) {
          if(hasExtra){
            console.log("Intent passed, handling that way");
            webintent.getExtra(webintent.EXTRA_TEXT, function(value) {
              if(!value) value = "http://nfcring.com/getStarted";
              console.log("Intent value is ", value);
              nfcRing.userValues.activity = "write";
              nfcRing.userValues.intentSet = true;
              nfcRing.userValues.toWrite = value;
              setTimeout(function(){
                nfcRing.heatmap.init();
                nfcRing.ui.displayPage("writeRing");
                nfcRing.ui.prepareWritePage("write");
              }, 500);
            }, function(){
              console.log("ERROR XVMA123");
            });
          }
        }, function() {
          console.log("ERROR XVMA172");
        }
      );
    }

    webintent.onNewIntent(function(intent, test) {

      console.log("new intent event detected", intent, test);

      webintent.hasExtra(webintent.EXTRA_TEXT,
        function(hasExtra) {
          if(hasExtra){
            console.log("Intent passed, handling that way");
          }
      });

    });
  }
};
