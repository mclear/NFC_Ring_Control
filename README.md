# Getting the development environment setup

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
cd platforms/android/bin
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore KEYSTOREFILELOCATION NFCRingControl-release-unsigned.apk nfcring
zipalign -v 4 NFCRingControl-release-unsigned.apk NFCRingControl.apk
```
