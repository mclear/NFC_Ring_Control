![Logo of the project](https://raw.githubusercontent.com/mclear/NFC_Ring_Control/master/res/icon/android/xhdpi.png)

# NFC Ring Control

NFC Ring Control enables you to Read from and Write to your NFC Ring, create links to your favorite social network profile or read your current NFC Ring.

This repository contains the source code for our Android, Windows Phone, iOS and Blackberry app.  

# Installing / Getting started

[6 Minute long video showing how to get started](https://www.youtube.com/watch?v=xirlKmCo7KA&list=UUdbzIfrpmzGCJ2j1LjqW9Gw) also shows how to add a new action.

Pre-requisite.  Apache Cordova

```
git clone https://github.com/mclear/NFC_Ring_Control.git  # Clone the repository
cd NFC_Ring_Control  # Enter the folder
cordova platform add android  # Add the Android platform
cordova plugin add phonegap-nfc  # Add the plugins...
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-vibration
cordova plugin add cordova-plugin-contacts
cordova build android  # Build the app
```

# Running / Deploying / Testing
```
cordova run android  # Runs the app on a test device or emulator.  ``adb devices`` will list available devices to deploy to.
```

# Publishing (Restricted to Deployment personnel only.)
```
cordova build android --release  # Build the Android release version
cd platforms/android/build/outputs/apk  # Enter the output folder
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/keystore android-release-unsigned.apk nfcring  # Sign the APK -- note the keystore file.
zipalign -v 4 android-release-unsigned.apk ~/Desktop/NFCRingControl.apk  # Align the APK zip.
```

# Features

 * Internationalization / Translations
 * Read NFC NDEF on iOS
 * Read / Write NFC NDEF on Android / Windows / Blackberry
 * Supports Twitter, Facebook, Youtube etc.
 * Push NFC straight from Apps with "Android Share"
 * See previous write history
 * Ring Sweet Spot to improve UX

# Testing
Left intentionally blank.

# Build with
 * Apache Cordova
 * Atom

# Compliance
 * Is the project GDPR compliant?  If so, how?

# Configuration

Left intentionally blank.

# Contributing
 * Please see CONTRIBUTING.MD -- DT ref: https://github.com/ether/etherpad-lite/blob/develop/CONTRIBUTING.md


# Authors
 * John McLear
 * Please add others based on Github commits

# Acknowledgements
 * TranslateWiki

# Links

Our Community maintains a Q&A at https://github.com/mclear/NFC_Ring_Control/wiki

Please post any issues on our bugtracker: https://github.com/mclear/NFC_Ring_Control/issues/new

Please post bug reports before posting any negative reviews, our community works hard to maintain this software, we appreciate the feedback and your assistance.

# Licensing

Apache 2
