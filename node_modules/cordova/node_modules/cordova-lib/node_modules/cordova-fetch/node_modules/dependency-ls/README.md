## dependency-ls

This module returns a promise containing an object of top level node modules installed in the supplied path. 

This module is essentially a fork of https://www.npmjs.com/package/npmlist. I just needed the results in a json object and I wanted the module to be requireable. 

### USAGE

    npm instal dependency-ls --save

    var dep-ls = require('dependency-ls')
    return depls(process.cwd())
    .then(function(result) {
        console.log(result)
    }
