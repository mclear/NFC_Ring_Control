nfcRing.registration = {
  passwordResetConfirm: function(wantToReset){
    if(wantToReset === 1){
      window.open('https://me.nfcring.com/validationCodeReset', '_system');
    }
  }
}
