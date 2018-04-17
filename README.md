![Logo of the project](https://raw.githubusercontent.com/mclear/NFC_Ring_Control/master/res/icon/android/xhdpi.png)

# What is this?
This is the NFC Ring Control App.  This repository contains the source code for our Android, Windows Phone and Blackberry app.  

This app enables you to Read from and Write to your NFC Ring, create links to your favorite social network profile or read your current NFC Ring.

The NFC Ring app has built in support for Facebook, Twitter, generic website links, Etherpad and Youtube.

You can use the app to write any link you want, such as your own blog or a news page. Simply choose your link and hold your rings public inlay to the sweet spot on your phone or tablet.

NFC Ring Control is Open source software. The Source code is available at https://github.com/mclear/NFC_Ring_Control

Our Community maintains a Q&A at https://github.com/mclear/NFC_Ring_Control/wiki

Please post any issues on our bugtracker: https://github.com/mclear/NFC_Ring_Control/issues/new

Please post bug reports before posting any negative reviews, our community works hard to maintain this software, we appreciate the feedback and your assistance.

# Getting the development environment setup

[6 Minute long video showing how to get started](https://www.youtube.com/watch?v=xirlKmCo7KA&list=UUdbzIfrpmzGCJ2j1LjqW9Gw) also shows how to add a new action.

Prereq to build cordova = NodeJS, linux, Java, Ant, Android dev tools, git

```
sudo npm install -g cordova
git clone https://github.com/mclear/NFC_Ring_Control.git
cd NFC_Ring_Control
cordova platform add android
cordova plugin add phonegap-nfc
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-vibration
cordova plugin add cordova-plugin-contacts
```
Obviously some changes need to be made to the below

```
export JAVA_HOME='/usr/lib/jvm/java-6-openjdk/'
export ANT_HOME=/usr/local/ant
export PATH=$ANT_HOME:$PATH
export ANDROID_HOME=/home/jose/Downloads/adt-bundle-linux-x86_64-20140702/sdk
export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH
```

Run with
```
cordova run android
```

# Publishing
```
Bump version number in www/config.xml and platforms/android/androidManifest.xml
cordova build android --release
cd platforms/android/build/outputs/apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/keystore android-release-unsigned.apk nfcring
/home/jose/Downloads/android-sdk-linux/build-tools/23.0.1/zipalign -v 4 android-release-unsigned.apk ~/Desktop/NFCRingControl.apk
```
