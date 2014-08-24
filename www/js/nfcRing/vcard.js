nfcRing.vcard = {};
nfcRing.vcard.cache = {};

// Search for a contact
nfcRing.vcard.search = function(name){
  $('#vCardResults').html(""); // Clear the results
  $('#vCardLoading').show(); // Show the loading screen
  $('#vCardNoResults').hide(); // Hide the vCardNoResults
  var options = new ContactFindOptions();
  options.filter = name;
  options.multiple = true;
  var fields = ["*"]; // Gets all the user data
  navigator.contacts.find(fields, nfcRing.vcard.found, nfcRing.vcard.error, options);
}

// When a contact is found write it to the UI
nfcRing.vcard.found = function(contacts){
  $('#vCardLoading').hide();
  console.log("Contact found", contacts);
  if(contacts.length === 0){ // If no contacts were found.
    $('#vCardResults').html("");
    $('#vCardNoResults').show();
  }else{
    $('#vCardNoResults').hide();
  }
  var i = 0;
  $.each(contacts, function(k,person){
    if(person.displayName && person.id){
      if(i < 5){
        $('#vCardResults').append("<div class='contact' id='"+person.id+"'>"+person.displayName+"</div>");
        nfcRing.vcard.cache[person.id] = person;
        i++;
      }
    }
  });
}

nfcRing.vcard.showFields = function(){
  $("#vCardData").html("");
  $.each(nfcRing.userValues.contactToWrite, function(key, value){
    if(nfcRing.userValues.contactToWrite[key]){
      if(key !== "id" && key !== "rawId" && key !== "remove" && key !== "clone" && key !== "save" && key !== "photos"){
        $("#vCardData").append("<div class='contactInfo'><label>" + key + "<input class='vCardCheckbox' type='checkbox' id='" + key + "' value='" + key + "' name='" + key + "'></label></div>");
      }
    }
  })
}

// takes in contact card from cordova and builds vcard format
nfcRing.vcard.build = function(contact){
  console.log("Contact", contact);
  var vcard = 'BEGIN:VCARD\n' +
    'VERSION:2.1\n' +
    'N:'+contact.name.familyName+';'+contact.name.givenName+';;;\n' +
    'FN:'+contact.name.formatted+'\n' +
    'EMAIL;WORK:'+contact.emails[0].value+'\n' +
    'TEL;'+contact.phoneNumbers[0].value+'\n' +
    'END:VCARD';
  console.log("vcard", vcard);
  nfcRing.userValues.toWrite = vcard;
  nfcRing.userValues.isVCard = true;
  return vcard;
}

nfcRing.vcard.error = function(e){
  console.error("vCard Error", e);
}
