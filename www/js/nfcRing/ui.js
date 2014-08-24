nfcRing.ui = {
  firstRun: function(){
    navigator.notification.confirm(html10n.get("index.wantHelpLong"), nfcRing.ui.firstRunConfirm, html10n.get("index.wantHelp"));
  },

  firstRunConfirm: function(wantHelp){
    if(wantHelp === 1){
      introJs().start();
    }
  },
 
  addActions: function(){
    // Load each action icon and text
    $.each(nfcRing.actions, function (key, action) {
      if (!action.image) {
        action.image = key.toLowerCase() + ".png";
      }
      action.title = html10n.get('actions.'+key+'.name');
      action.descriptionI18n = html10n.get('actions.'+key+'.description');
      if(!typeof action.descriptionI18n == 'object'){ // If it's an object the string value was missing so we return nada
         action.description = action.descriptionI18n;
      }
      $('#ringActions').append('<li><div data-key="'+action.title+'" class="action icon icon-'+ action.label.toLowerCase() +'">' + action.label + '<span>' + action.description + '</span></div></li>');
    });
  },
 
  showNeedHelp: function(){
    $('#needHelp').fadeIn('slow');
  }, // Shows the need help button

  domListenersInit: function(){
    // In the browser when we use the back button it doesn't fire the handleBack or whatever so sometimes we have to catch it
    // None fo this shit seems to work..
    $(window).on('hashchange', function() {
      if(window.location.hash.split("#")[1] !== nfcRing.userValues.location){
        nfcRing.ui.displayPage(window.location.hash.split("#")[1]);
        // I don't like these bits..  We'd be better off using .emit / .on
        console.log(window.location.hash.split("#")[1]);
      }
    });

    // Swipe event
    var element = document.getElementById('context');
    var hammertime = Hammer(element).on("swiperight", function(event) {
      $('body').removeClass('context-open');
    });

    nfcRing.ui.history = []; // Create blank history stack

    $('body').on('click', '.index', function(){
      nfcRing.ui.displayPage("index");
    });

    $('body').on('click', '#actionBtn', function(){
      nfcRing.ui.displayPage("action");
    });

    $('body').on('click', '#mainContents, #heatMap', function(){
      $('body').removeClass('context-open');
    });

    $('body').on('click', '#readBtn', function(){
      nfcRing.heatmap.init();
      nfcRing.userValues.toWrite = false;
      nfcRing.ui.displayPage("writeRing"); // Read uses the same UI as writeRing just with different event listeners
      nfcRing.ui.prepareWritePage("read");
    });

    $('body').on('click', '#registerBtn', function(){
      nfcRing.heatmap.init();
      nfcRing.ui.displayPage("writeRing"); // Read uses the same UI as writeRing just with different event listeners
      nfcRing.ui.prepareWritePage("register");
    });

    $('body').on('click', '#simulateRead', function(){
      clearTimeout(nfcRing.ui.helpTimeout);
      $('#needHelp').hide();
      if(nfcRing.userValues.activity === "read"){
        ringData = "http://whatever.com";
        alert(ringData, false, html10n.get("readRing.contents"));
      }
      if(nfcRing.userValues.activity === "register"){
        nfcRing.userValues.uid = "4,33,81,2,-74,40,-128";
        console.log(nfcRing.registration);
        nfcRing.registration.isValidUid(function(isValid){ // TODO REMOVE UID!
          if(isValid){
            nfcRing.ui.displayPage("register");
          }else{
            alert("NOT NFC RING");
          }
        });
      }
    });

    $('body').on('click', '#simulateWrite', function(){
      clearTimeout(nfcRing.ui.helpTimeout);
      $('#needHelp').hide();
      ringData = "http://whatever.com";
      console.log("Simulating Write");

      var dontAskSweetSpotAgain = localStorage.getItem("dontAskSweetSpotAgain");

      if (dontAskSweetSpotAgain === "true") { // we should ask for the sweet spot
        alert(html10n.get("writeRing.ready"), false, html10n.get("writeRing.woohoo"));
      } else {
        navigator.notification.confirm(html10n.get("sweetSpot.askToShare"), function(shareLocation){
          console.log("Share location response", shareLocation);
          if (shareLocation === 1) {
            console.log("Set localstorage item dont ask sweet spot again");
            localStorage.setItem("dontAskSweetSpotAgain", true);
            nfcRing.ui.displayPage("sweetSpot");
          } else {
            localStorage.setItem("dontAskSweetSpotAgain", true);
          }
        }, false);
      }
    });

    $('body').on('click', '#settingsBtn', function(){
      nfcRing.ui.displayPage("settings");
    });

    $('body').on('click', '#feedbackBtn', function(){
      window.location.href = "mailto:support@nfcring.com";
    });

    Handlebars.registerHelper('html10n', function(str,a){
      return (html10n != undefined ? html10n.get(str) : str);
    });

    var language = localStorage.getItem("language");
    nfcRing.userValues.tagSize = localStorage.getItem("tagSize") || 137;


    if(!language) language = navigator.language;
    console.log("Setting language to ", language);
    var languageName = $('#'+language).val();

    console.log("Setting language to ", language);
    html10n.bind('indexed', function() {
      // we always localize to EN first so we have a cache of fallback strings..
      html10n.localize("en");
      html10n.localize([language, navigator.language, navigator.userLanguage, 'en'])
      console.log("language", language, navigator.language, navigator.userLanguage);
      nfcRing.userValues.language = language || navigator.language;
      // $('.changeLanguage').val(nfcRing.userValues.language);
    })
    html10n.bind('localized', function(e) {
      document.documentElement.lang = html10n.getLanguage();
      document.documentElement.dir = html10n.getDirection();
      // nfcRing.userValues.language = language || navigator.language;
      // $('.changeLanguage').val(nfcRing.userValues.language);
      if(!nfcRing.userValues.intent) nfcRing.ui.displayPage("index");
    });

    FastClick.attach(document.body); // What does this do?

    $('body').on('click', '#helpLink', function (e) {
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
          close: function () {
            $('#needHelp').fadeOut('slow');
          }
        }
      }, 0);
    });

    $('body').on('click', '#helpClose', function () {
      $.magnificPopup.close();
    });  

    // click listener for each action from actions.js
    $('body').on('click', '#ringActions > li > .action', function(){
      // Begin heatmap stuff, this pre-loads the data for us :)
      nfcRing.heatmap.init();
      console.log("Setting location to option");
      var key = $(this).data("key");
      nfcRing.action = $(this).data("key");
      nfcRing.ui.displayPage("option");
      var labelI18n = html10n.get('actions.'+key.toLowerCase()+'.optionText');
      if(!typeof labelI18n == 'object'){ // If it's an object the string value was missing so we return nada
         var label = action.labelI18n;
      }else{
         console.log("lower case label", key);
         console.log("actions", nfcRing.actions);
         var label = nfcRing.actions[key.toLowerCase()].optionText;
      }
      nfcRing.userValues.optionTitle = label;
      nfcRing.userValues.action = key.toLowerCase();
      nfcRing.userValues.isUrl = false;
      console.log("key", key);
      if(key.toLowerCase() === "vcard"){
        console.log("VCard so adding autocomplete class");
        $('#optionInput').addClass("autocomplete");
        $('.icon-next').hide();
      }else{
        $('#optionInput').removeClass("autocomplete");
      }
      if(key.toLowerCase() === "link"){
        console.log("Setting nfcRing.userValues.isUrl to true");
        nfcRing.userValues.isUrl = true;
      }
      if(nfcRing.actions[key.toLowerCase()].prefix){
        // If the prefix has a http in then make it a url
        if(nfcRing.actions[key.toLowerCase()].prefix.substring(0,4) === "http"){
          nfcRing.userValues.isUrl = true;
        }
      }
      $('.optionName').html('<h2>' + label + '</h2>');
    });

    $('body').on('change, keyup, paste', '#optionInput', function(e){
      setTimeout(function () { // Ghetto hack because paste event fires on paste not after paste
        var inputSize = $('#optionInput').val().length;
        var tagSize = nfcRing.userValues.tagSize;
        console.log("inputSize", inputSize, "tagSize", tagSize);
        if(inputSize >= tagSize){
          if(tagSize >= nfcRing.maxSize){
            console.log("displaying warning because too much data is attempting to be written to me");
            nfcRing.ui.dataSizeTooBig(true);
            nfcRing.ui.dataSizeTooBigUpgrade(false);
          }else{
            console.log("telling user to upgrade their ring as a better one exists");
            nfcRing.ui.dataSizeTooBigUpgrade(true);
          }
        }else{
          console.log("data should fit fine on the tag");
          nfcRing.ui.dataSizeTooBig(false);
          nfcRing.ui.dataSizeTooBigUpgrade(false);
        }
      }, 100);
    });

    $('body').on('click', '.vCardCheckbox', function(e){
      var input = nfcRing.vcard.build();
      var inputSize = input.length;
      var tagSize = nfcRing.userValues.tagSize;
      console.log("inputSize", inputSize, "tagSize", tagSize);
      if(inputSize >= tagSize){
        if(tagSize >= nfcRing.maxSize){
          console.log("displaying warning because too much data is attempting to be written to me");
          nfcRing.ui.dataSizeTooBig(true);
        }else{
          console.log("telling user to upgrade their ring as a better one exists");
          nfcRing.ui.dataSizeTooBigUpgrade(true);
        }
      }else{
        console.log("data should fit fine on the tag");
        nfcRing.ui.dataSizeTooBig(false);
        nfcRing.ui.dataSizeTooBigUpgrade(false);
      }
    });


    $('body').on('submit', '#optionForm', function(e){
      e.preventDefault();
      nfcRing.userValues.toWrite = nfcRing.actions[nfcRing.userValues.action].format($('#optionInput').val()); // gets the value to write
   
      nfcRing.userValues.history.set(); // saves it to history
      console.log("Submitting a write value to the nfcRing object");
      nfcRing.ui.displayPage("writeRing");
      nfcRing.ui.prepareWritePage("write");
      return false;
    });

    $('body').on('submit', '#vCardForm', function(e){
      e.preventDefault();
      nfcRing.userValues.toWrite = nfcRing.vcard.build();
      nfcRing.userValues.history.set();
      console.log("Submitting a write value to the nfcRing object");
      nfcRing.ui.displayPage("writeRing");
      nfcRing.ui.prepareWritePage("write");
      return false;
    });

    $('body').on('submit', '#registerEmail', function(e){
      e.preventDefault();
      // alert("This functionality is not ready yet..");
      if($('#passwordInput').val() === $('#passwordAgainInput').val()){
        nfcRing.registration.registerUser();
      }else{
        alert(html10n.get("register.passwordsDontMatch"));
      }
    });
    $('body').on('change', '.changeLanguage', function(e){
      var language = e.target.value;
      localStorage.setItem("language", language); // saves language
      console.log("change language to", language);
      nfcRing.userValues.language = language;
      html10n.localize(language);
    });

    $('body').on('click', '#clearSweetSpot', function(e){
      e.preventDefault();
      navigator.notification.confirm(html10n.get("sweetSpot.areYouSureSS"), function(confirmed){
        if(confirmed === 1){
          console.log("clearing sweet spot history");
          localStorage.setItem("dontAskSweetSpotAgain", false);
          localStorage.setItem("sweetSpotLocation", false);
        }
      }, html10n.get("sweetSpot.areYouSure"));
    });

    $('body').on('click', '#clearPreviousActions', function(e){
      e.preventDefault();
      navigator.notification.confirm(html10n.get("sweetSpot.areYouSureActions"), function(confirmed){
        if(confirmed === 1){
          console.log("Clearing previous actions");
          localStorage.setItem("actionHistory", "{}");
          $('#history-list').html("");
        }
      }, html10n.get("sweetSpot.areYouSure"));
    });

    $('body').on('click', '#viewHistory', function(e) {
      console.log("Showing history");
      e.preventDefault();
      $('body').toggleClass('show-history');
    });

    $('body').on('click', '#sweetSpotBtn', function(e){
      e.preventDefault();
      $('body').removeClass('context-open');
      console.log("Showing sweet spot location page");
      nfcRing.ui.displayPage("sweetSpot");
    });

    $('html').on('click', '#nav-btn', function() {
      $('body').toggleClass('context-open');
    });
    
    $('html').on('click', '#nav-btn-close', function() {
      $('body').toggleClass('context-open');
    });

    $('html').on('click', '#back-btn', function() {
      $('body').toggleClass('show-history');
    });

    // click action for previously historical actions
    $('html').on('click', '#history li > .historical', function(){
      $('body').toggleClass('show-history').toggleClass('context-open');
      var action = $(this).find("div").text();
      nfcRing.userValues.toWrite = action;
      nfcRing.heatmap.init();
      nfcRing.ui.displayPage("writeRing");
      nfcRing.ui.prepareWritePage("write");
    });

    $('body').on('click', '#finish', function(){
      nfcRing.ui.displayPage("index");
    });

    $('body').on('click', '#sweetSpotOverlay', function(e){
      nfcRing.userValues.localSweetSpot.set(e);
    });

    $('body').on('keyup', '.autocomplete', function(){
      var searchTerm = $('.autocomplete').val();
      if(searchTerm.length < 3) return;
      console.log("Searching for ", searchTerm);
      nfcRing.vcard.search(searchTerm);
    });

    $('body').on("click", ".contact", function(e){
      console.log("ID", e.target.id);
      var contactObj = nfcRing.vcard.cache[e.target.id];
      if(vcard){
        nfcRing.userValues.contactToWrite = contactObj;
        nfcRing.userValues.isVCard = true;
        console.log("Displaying vcard page");
        nfcRing.ui.displayPage("vcard");
      }else{
        alert("Failed to create VCard");
      }
    });

  },

  updateVersion: function(){ // show Version number on the page
    if(device.platform === "browser"){
      $('#versionNumber').text("N/A");
    }else{
      cordova.getAppVersion().then(function (version) { $('#versionNumber').text(version); });
    }
    $('#modelName').text(device.model);
  },

  displayPage: function(page){ // Display a page
    console.log("remove context open class");
    $('body').removeClass('context-open'); // hide context menu

    if(!page){
      history.go(-(history.length - 1));
      return false;
    }

    console.log("Location", nfcRing.userValues.location);
    if(nfcRing.userValues.location !== "#writeRing"){
      $('#heatMap').css("opacity","0");
    }else{
      $('#heatMap').css("opacity","0.8");
    }
    window.location.hash = '#'+page;
    console.log("Displaying page", page);

    // never allow the app to get stuck in a loop on pages..
    if(nfcRing.ui.history[nfcRing.ui.history.length-1] !== page){
      console.log("Wrote page to history stage");
      nfcRing.ui.history.push(page); // Write the this page to the history stack
    }
    nfcRing.userValues.location = page;
    console.log("page", page);
    var source = $('#'+page).html();
    var context = $('#contextContent').html(); // always include context nav on every page :)
    var template = Handlebars.compile(source);
    context = Handlebars.compile(context);
    $("#mainContents").html(template());
    $("#context").html(context()); // TODO fix me at the moment taking up most of the UI
    // console.log("Writing ", source, " to #container");
    if(page === "action"){
      console.log("Rendering actions");
      nfcRing.ui.addActions();
    }

    if(nfcRing.userValues.activity === "register" && nfcRing.userValues.location === "writeRing"){
      console.log("Displaying register page");
      nfcRing.ui.prepareWritePage("register");
    }

    if(page === "option"){
      $('.optionName').html('<h2>' + nfcRing.userValues.optionTitle + '</h2>');
      if(nfcRing.userValues.isVCard){
        $('#optionInput').addClass("autocomplete");
        $('.icon-next').hide();
      }
    }
 
    if(page === "settings"){
      console.log("Displaying settings page with value", nfcRing.userValues.language);
      $('.changeLanguage').val(nfcRing.userValues.language);
    }
    
    if(page === "vcard"){
      nfcRing.vcard.showFields(); // Write the checkboxes and fields to the UI
    }

    setTimeout(function(){
      if(page === "index"){
        if(localStorage.getItem("firstRunCompleted") !== "true" ){
          // Show a first run dialog
          nfcRing.ui.firstRun();
  
          // If it was the first run we can save this and never do this event again
          localStorage.setItem("firstRunCompleted", true);
        }
      }
    },200); 
    nfcRing.ui.updateVersion();
    nfcRing.userValues.history.get(); // always update the history on each page view so context is always updated
    $(".timeago").timeago(); // show " time ago " strings
  }, 

  handleBack: function(){  // Init the Back Button event handlers
    if($("body").hasClass("context-open")){
      $("body").removeClass("context-open");
      return;
    }
    console.log("handling back");
    if (nfcRing.userValues.location === "index") {
      nfcRing.userValues.activity = false;
      // Leave the app, this will prolly break Windows Phone
      navigator.app.exitApp();
    }else{
      nfcRing.ui.history.pop(); // drop the last item from the history array
      nfcRing.ui.displayPage(nfcRing.ui.history[nfcRing.ui.history.length-1]); // display the previous page
    }

  },

  prepareWritePage: function(eventType){
    console.log("preparing write page", device, eventType, nfcRing.userValues);
    nfcRing.userValues.activity = eventType;
    
    if(eventType === "write" && device.model == "browser"){
      $('#mainContents').append("<button id='simulateWrite'>Simulate Write Event</button>");
    }
    if((eventType === "read" || eventType === "register") && device.model == "browser"){
      $('#mainContents').append("<button id='simulateRead'>Simulate Read Event</button>");
    }

    if(nfcRing.heatmap.coOrds){
      $('#writeRingTitle').html("<h2>"+html10n.get('sweetSpot.holdRingToPhoneByDot')+"</h2>");
    }else{
      $('#writeRingTitle').html("<h2>"+html10n.get('sweetSpot.noDataYet')+"</h2>");
    }

    $('#heatMap').css("opacity","0.8");
    nfcRing.ui.helpTimeout = setTimeout(function(){
      console.log("Showing Help Message");
      nfcRing.ui.showNeedHelp()
    },5000);
    console.log("Done preparing write page");
  },

  paramFromURL: function(name){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null ) return "";
    else return results[1];
  },

  dataSizeTooBig: function(wontFit){
    if(wontFit){
      $('.dataWontFit').show();
    }else{
      $('.dataWontFit').hide();
    }
  },

  dataSizeTooBigUpgrade: function(wontFit){
    if(wontFit){
      $('.dataWontFitUpgrade').show();
    }else{
      $('.dataWontFitUpgrade').hide();
    }
  }

}
