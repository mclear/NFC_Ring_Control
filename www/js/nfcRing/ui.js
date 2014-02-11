nfcRing.ui = {
  addActions: function(){
    // Firstly we need to load them from history
    nfcRing.userValues.history.values = localStorage.getItem("actionHistory");
    if(nfcRing.userValues.history.values) nfcRing.userValues.history.values = JSON.parse(nfcRing.userValues.history.values);
    nfcRing.userValues.history.reverse(nfcRing.userValues.history.values, function(key){
      console.log('KEY:', key, 'VALUE:', this[key]); 
      var action = this[key];
      console.log(key);
      key = parseInt(key);
      var ts = new Date(key).toISOString();
      $('#ringActions').append('<li><a data-key="'+key+'" data-action="'+action+'" class="historical icon icon-'+ action +'">' + action +   '<span>Action created/used <i class=timeago title="'+ts+'"></span></span></a></i>');
    });

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

  }, // Note this will be a PITA to do i18n
  showNeedHelp: function(){}, // Shows the need help button
  domListenersInit: function(){
    $('body').on('click', '#createNew', function(){
      nfcRing.ui.displayPage("action");
      nfcRing.ui.addActions();
    });

    Handlebars.registerHelper('html10n', function(str,a){
      console.log("STRING", str);
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
    $(".timeago").timeago(); // assign timeago stuff

    $('#helpLink').on('click', function (e) {
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
            setTimeout($('#message').fadeOut('slow'), 5000);
          }
        }
      }, 0);
    });

    $('#helpClose').on('click', function () {
      $.magnificPopup.close();
    });  

    // click action for previously historical actions
    $('#ringActions > li > .historical').on('click', function(){ 
      $('#action').hide();
      console.log("beginning init");
      nfcRing.heatmapInit();
      console.log("Setting location to option");
      nfcRing.location = "writing";
      var action = $(this).data("action");
      var key = $(this).data("key");
      console.log("Key ", key);
      console.log("Submitting a write value to the nfcRing object");
      nfcRing.submitted(action, key);
    });

    // click listener for each action from actions.js
    $('#ringActions > li > .action').on('click', function(){
      // Begin heatmap stuff, this pre-loads the data for us :)
      console.log("beginning init");
      nfcRing.heatmapInit();
      console.log("Setting location to option");
      nfcRing.location = "option";
      var key = $(this).data("key");
      console.log("Key ", key);
      $('#option').show(); $('#action').hide();
      $('#option > .actionName').html('<h2>' + actions[key].label + '</h2>');
      $('#optionInput').attr("placeholder", actions[key].placeHolder);
      $('form > label').text(actions[key].optionText);
      console.log("Updated UI to show form etc");
      $('#optionForm').submit(function(e){
        e.preventDefault();
        console.log("Submitting a write value to the nfcRing object");
        nfcRing.submitted(key);
        return false;
      });
    });

  }, // Creates Dom listeners for events
  updateVersion: function(){ // show Version number on the page
    cordova.getAppVersion().then(function (version) { $('#versionNumber').text(version); });
  },
  displayPage: function(page){ // Display a page
    console.log("Displaying page", page);
    var source = $('#'+page).html();
    var template = Handlebars.compile(source);
    $("#container").html(template());
    console.log("Writing ", source, " to #container");
  }, 
  handleBack: function(){  // Init the Back Button event handlers
    if (nfcRing.location == "index") {
      // Clear history so back button on home page always leaves the app
      console.log("Cleared app history");
      history.go(-(history.length - 9999));
      document.addEventListener("backbutton", nfcRing.handleBack, true);
      // navigator.app.clearHistory(); // This doesn't even exist in WP -- does it actually exist on Android?
    } else {
      document.addEventListener("backbutton", nfcRing.handleBack, false);
    }
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
