# Getting the development environment setup

[6 Minute long video showing how to get started](https://www.youtube.com/watch?v=xirlKmCo7KA&list=UUdbzIfrpmzGCJ2j1LjqW9Gw) also shows how to add a new action.

Prereq to build cordova = NodeJS, linux, Java, Ant, Android dev tools, git

```
sudo npm install -g cordova
git clone https://github.com/mclear/NFC_Ring_Control.git
cd NFC_Ring_Control
cordova platform add android
cordova plugin add https://github.com/chariotsolutions/phonegap-nfc.git
cordova plugin add https://github.com/apache/cordova-plugin-device.git
cordova plugin add org.apache.cordova.dialogs
cordova plugin add org.apache.cordova.vibration
```
Obviously some changes need to be made to the below

```
export JAVA_HOME='/usr/lib/jvm/java-6-openjdk/'
export ANT_HOME=/usr/local/ant
export PATH=$ANT_HOME:$PATH
export ANDROID_HOME=/home/jose/Downloads/adt-bundle-linux-x86_64-20131030/sdk
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
cd platforms/android/ant-build
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/keystore NFCRingControl-release-unsigned.apk nfcring
zipalign -v 4 NFCRingControl-release-unsigned.apk NFCRingControl.apk
```
