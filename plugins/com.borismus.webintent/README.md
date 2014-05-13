# WebIntents plugin for Phonegap #
* By Boris Smus
* Updated to Phonegap 3.0 by Avi Vaisenberger
* Adapted to Cordova/Phonegap command-line Interface by Brais Gabin

## Adding the Plugin to your project ##
There are two ways to install this plugin

### 1) The Command-line Interface ###
If you used [The Command-line Interface](http://cordova.apache.org/docs/en/3.0.0/guide_cli_index.md.html) to create your Cordova/Phonegap project you only need write this command at your terminal:
`cordova plugin add https://github.com/InQBarna/WebIntent.git`

### 2) Manually ###
1. To install the plugin, move `webintent.js` to your project's `www` folder and include a reference to it in your html files. 
2. Create the path `com/borismus/webintent` within your project's `src/` folder and move the java file into it.
3. Add the plugin to your `res/xml/config.xml` file:

```xml
<feature name="WebIntent">
    <param name="android-package" value="com.borismus.webintent.WebIntent" />
</feature>
```

## Using the plugin ##
The plugin creates the object `CDV.WEBINTENT` with five methods:

### startActivity ###
Launches an Android intent. For example:

```javascript
CDV.WEBINTENT.startActivity({
    action: CDV.WEBINTENT.ACTION_VIEW,
    url: 'geo:0,0?q=' + address}, 
    function() {}, 
    function() {alert('Failed to open URL via Android Intent')};
);
```

### hasExtra ###
checks if this app was invoked with the specified extra. For example:

```javascript
CDV.WEBINTENT.hasExtra(CDV.WEBINTENT.EXTRA_TEXT, 
    function(has) {
        // has is true iff it has the extra
    }, function() {
        // Something really bad happened.
    }
);
```
 
### getExtra ###
Gets the extra that this app was invoked with. For example:

```javascript
CDV.WEBINTENT.getExtra(CDV.WEBINTENT.EXTRA_TEXT, 
    function(url) {
        // url is the value of EXTRA_TEXT
    }, function() {
        // There was no extra supplied.
    }
);
```

### getUri ###
Gets the Uri the app was invoked with. For example:

```javascript
CDV.WEBINTENT.getUri(function(url) {
    if(url !== "") {
        // url is the url the intent was launched with
    }
});
```

### onNewIntent ###
Gets called when onNewIntent is called for the parent activity. Used in only certain launchModes. For example:

```javascript
CDV.WEBINTENT.onNewIntent(function(url) {
    if(url !== "") {
        // url is the url that was passed to onNewIntent
    }
});
```
    
### sendBroadcast ###
Sends a custom intent passing optional extras

```javascript
CDV.WEBINTENT.sendBroadcast({
        action: 'com.dummybroadcast.action.triggerthing',
        extras: {
            'option': true
        }
    }, function() {
    }, function() {
});
```

## Licence ##

The MIT License

Copyright 
(c) 2010 Boris Smus
(C) 2013 Avi Vaisenberger
(c) 2013 Brais Gabin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
