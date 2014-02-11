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
      $('.win32').show(); // Note to Designer, by default this needs to be hidden
      $('#writeRing > .actionName').html("Windows Phone is unable to use our Community Sweet Spot location servers, we hope to get this fixed as soon as possible, sorry");
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
