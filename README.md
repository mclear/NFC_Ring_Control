# Getting the development environment setup

Prereq to build cordova = NodeJS, linux, Java, Ant, Android dev tools, git

```
sudo npm install -g cordova
git clone https://github.com/mclear/NFC_Ring_PhoneGap_App.git NFCRingPro
cd NFCRingPro
cordova platform add android
cordova plugin add https://github.com/chariotsolutions/phonegap-nfc.git
cordova plugin add https://github.com/apache/cordova-plugin-device.git
cordova plugin add org.apache.cordova.dialogs
cordova plugin add org.apache.cordova.vibration
```
Obviously some changes need to be made to the below

```
export ANT_HOME="/home/jose/apache-ant-1.9.3"
export PATH=/home/jose/Downloads/adt-bundle-linux-x86_64-20131030/sdk/platform-tools:$PATH
export PATH=/home/jose/Downloads/adt-bundle-linux-x86_64-20131030/sdk/tools:$PATH
export PATH=$ANT_HOME:$PATH
```

Run with
```
cordova run android
```

Note if you install with apt you should do 

```
export ANT_HOME="/usr/local/ant"
```

# Publishing
```
cordova build android --release
cd platforms/android/bin
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore KEYSTOREFILELOCATION NFCRingPro-release-unsigned.apk nfcring
zipalign -v 4 NFCRingPro-release-unsigned.apk NFCRingControl.apk
```
