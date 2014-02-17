nfcRing.ui = {
  firstRun: function(){
    if(device.model === "browser"){
      var wantHelp = confirm(html10n.get("index.wantHelpLong"), html10n.get("index.wantHelp"));
      nfcRing.ui.firstRunConfirm(wantHelp);
    }else{
      // CAKE TO DO USE ASYNC
      var wantHelp = confirm(html10n.get("index.wantHelpLong"), nfcRing.ui.firstRunConfirm, html10n.get("index.wantHelp"));
    }
  },

  firstRunConfirm: function(wantHelp){
    if(wantHelp === 1){
      introJs().start();
    }
  },
 
  addActions: function(){
    // Load each action icon and text
    $.each(nfcRing.actions, function (key, action) {
      console.log("action", action);
      if (!action.image) {
        action.image = key.toLowerCase() + ".png";
      }
      action.title = html10n.get('actions.'+key+'.name');
      action.descriptionI18n = html10n.get('actions.'+key+'.description');
      if(!typeof action.descriptionI18n == 'object'){ // If it's an object the string value was missing so we return nada
         action.description = action.descriptionI18n;
      }
      $('#ringActions').append('<li><a data-key="'+action.title+'" class="action icon icon-'+ action.label.toLowerCase() +'">' + action.label + '<span>' + action.description + '</span></a></li>');
    });

  },
 
  showNeedHelp: function(){
    $('#needHelp').fadeIn('slow');
  }, // Shows the need help button

  domListenersInit: function(){

    // In the browser when we use the back button it doesn't fire the handleBack or whatever so sometimes we have to catch it
    $(window).on('hashchange', function() {
      if(window.location.hash.split("#")[1] !== nfcRing.userValues.location){
        nfcRing.ui.displayPage(window.location.hash.split("#")[1]);
        // I don't like these bits..  We'd be better off using .emit / .on
        console.log(window.location.hash.split("#")[1]);
        if(window.location.hash.split("#")[1] == "action"){
          console.log("Adding actions");
          nfcRing.ui.addActions();
        }
        if(window.location.hash.split("#")[1] == "option"){
          $('.optionName').html('<h2>' + nfcRing.userValues.optionTitle + '</h2>');
        }
      }
    });

    nfcRing.ui.history = []; // Create blank history stack

    $('body').on('click', '#actionBtn', function(){
      nfcRing.ui.displayPage("action");
      nfcRing.ui.addActions();
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
        confirm(html10n.get("sweetSpot.askToShare"), function(shareLocation){
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

    Handlebars.registerHelper('html10n', function(str,a){
      return (html10n != undefined ? html10n.get(str) : str);
    });

    var language = document.cookie.match(/language=((\w{2,3})(-\w+)?)/);
    if(language) language = language[1];
    html10n.bind('indexed', function() {
      html10n.localize([language, navigator.language, navigator.userLanguage, 'en'])
    })
    html10n.bind('localized', function() {
      console.log("Localized");
      document.documentElement.lang = html10n.getLanguage()
      document.documentElement.dir = html10n.getDirection()
      nfcRing.ui.displayPage("index");
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
         var label = nfcRing.actions[key.toLowerCase()].optionText;
      }
      nfcRing.userValues.optionTitle = label;
      nfcRing.userValues.action = key.toLowerCase();;
      $('.optionName').html('<h2>' + label + '</h2>');
      /*
      // $('#optionInput').attr("placeholder", actions[key].placeHolder);
      // $('form > label').text(actions[key].optionText);
      
      */
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

    $('body').on('submit', '#registerEmail', function(e){
      // alert("This functionality is not ready yet..");
      if($('#passwordInput').val() === $('#passwordAgainInput').val()){
        nfcRing.registration.registerUser();
      }else{
        alert(html10n.get("register.passwordsDontMatch"));
      }
    });

    $('body').on('click', '#clearSweetSpot', function(){
      confirm(html10n.get("sweetSpot.areYouSureSS"), function(confirmed){
        if(confirmed === 1){
          console.log("clearing sweet spot history");
          localStorage.setItem("dontAskSweetSpotAgain", false);
          localStorage.setItem("sweetSpotLocation", false);
        }
      }, html10n.get("sweetSpot.areYouSure"));
    });

    $('body').on('click', '#clearPreviousActions', function(){
      confirm(html10n.get("sweetSpot.areYouSureActions"), function(confirmed){
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
      $('#container > #trigger').append('<div id="back-btn" class="icon icon-back close-sub"></div>');
    });

    $('body').on('click', '#sweetSpotBtn', function(){
      $('body').removeClass('context-open');
      console.log("Showing sweet spot location page");
      nfcRing.ui.displayPage("sweetSpot");
    });

    $('body').on('click', '#nav-btn', function() {
      $('body').toggleClass('context-open');
    });

    $('body').on('click', '#back-btn', function() {
      $('#back-btn').remove();
      $('body').toggleClass('show-history');
    });

    // click action for previously historical actions
    $('body').on('click', '#history li > .historical', function(){
      // $('#action').hide();
      $('body').toggleClass('show-history').toggleClass('context-open');
      var action = $(this).data("action");
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
    $('#back-btn').remove();
    window.location.hash = '#'+page;
    console.log("Displaying page", page);
    nfcRing.ui.history.push(page); // Write the this page to the history stack
    nfcRing.userValues.location = page;
    var source = $('#'+page).html();
    var context = $('#contextContent').html(); // always include context nav on every page :)
    var template = Handlebars.compile(source);
    context = Handlebars.compile(context);
    $("#mainContents").html(template());
    $("#context").html(context()); // TODO fix me at the moment taking up most of the UI
    // console.log("Writing ", source, " to #container");
    nfcRing.ui.updateVersion();
    nfcRing.userValues.history.get(); // always update the history on each page view so context is always updated
    $(".timeago").timeago(); // show " time ago " strings
  }, 

  handleBack: function(){  // Init the Back Button event handlers

    nfcRing.userValues.activity = false;

    console.log("handling back");

    if (nfcRing.userValues.location === "index") {
      // Leave the app, this will prolly break Windows Phone
      navigator.app.exitApp();
    }else{
      nfcRing.ui.history.pop(); // drop the last item from the history array
      nfcRing.ui.displayPage(nfcRing.ui.history[nfcRing.ui.history.length-1]); // display the previous page
    }

  },

  prepareWritePage: function(eventType){
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
  },

  paramFromURL: function(name){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null ) return "";
    else return results[1];
  }
}
