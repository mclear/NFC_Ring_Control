nfcRing.actions = {
  link: {
    label: "Link",
    description: "Link to a web address",
    optionText: "What is the URL of the website?",
    placeHolder: "http://nfcring.com",
    format: function (option) {
      return option
    }
  },
  text: {
    label: "Text",
    description: "Write arbitary text such as a Bitcoin public key",
    optionText: "What is your text?",
    placeHolder: "Hello world",
    format: function(option){
      return option
    }
  },
  vcard: { 
    label: "vCard",
    description: "Create a vCard to share yours or someone elses contact details",
    optionText: "Search for your contact by name",
    placeHolder: "John Smith"
  },
  twitter: {
    label: "Twitter",
    description: "Link to a Twitter user",
    optionText: "What is your Twitter Username?",
    placeHolder: "@nfcring",
    prefix: "http://twitter.com/",
    format: function (option) {
      return this.prefix + option
    }
  },
  facebook: {
    label: "Facebook",
    description: "Link to a Facebook page",
    optionText: "What is your Facebook Page URL?",
    placeHolder: "NfcRing",
    prefix: "http://facebook.com/",
    format: function (option) {
      return this.prefix + option
    }
  },
  youtube: {
    label: "Youtube",
    description: "Link to a video or channel",
    optionText: "What is your Youtube Video / Channel?",
    placeHolder: "johnyma22",
    prefix: "http://youtube.com/",
    format: function (option) {
      return this.prefix + option
    }
  }
};

