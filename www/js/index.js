var app = {
  initialize: function () {
    this.bind();
  },
  bind: function () {
    document.addEventListener('deviceready', this.deviceready, false);
  },
  deviceready: function () {
    // Remove read from windows phone, it's far too buggy
    if (device.platform == "Win32NT") {
      $('#read').hide();
      $('#helpContents ul').append('<li>Windows Phone requires the NFC Ring to already have a link on. To fix this grab an android handset or another App and write a URL to your phone then you will be able to use the NFC Ring Control app to write a URL</li>');
    }

    // See http://docs.phonegap.com/en/edge/cordova_events_events.md.html#backbutton
    nfcRing.ui.handleBack();

    // Windows Phone doesn't support reading MIME types..  I mean, really..  *Sigh
    if (device.platform == "Win32NT") {
    }

    // See http://docs.phonegap.com/en/edge/cordova_notification_notification.md.html#Notification
    alert = navigator.notification.alert;
    prompt = navigator.notification.prompt;

    nfcRing.nfcEvent.init();

  }
};
