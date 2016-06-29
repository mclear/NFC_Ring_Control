var spawn = require('child_process').spawn
var Q = require('q')

var REGEX = {
  'package': /^([│ ]*)[└├]─+┬?\s+(.*)@(.*)$/,
  invalid: /^(.*)\s+invalid$/,
  unmet: /^.*UNMET DEPENDENCY\s+(.*)$/,
  version: /^([\d.]*)(?:\s+->\s+(.*))$/
}

function cleanup(arr) {
    for(var i = 0; i < arr.length; i++) {
        if(!arr[i]) {
            arr.splice(i, 1);
            --i
        }
    }
    return arr;
}

module.exports = function(directory) {
    opts = {} 
    opts.cwd = directory
    var capturedOut = ''
    var capturedErr = ''
    var d = Q.defer();

    var ls = spawn('npm',['ls', '--depth=0'], opts)

    ls.stdout.on('data', function(data) {
        capturedOut += data    
    })

    ls.stderr.on('data', function(data) {
        capturedErr += data
    })

    ls.on('error', function(error) {
        return Q.reject(error);
    });

    ls.on('close', function(code) { 
        var pkgs = {};
        var deps = cleanup(capturedOut.split('\n'));
          
        deps.forEach(function(dep) {
            var pkgMatches = dep.match(REGEX.package);
            
            if (pkgMatches) {
  
                //tempArr = [bars, name, version]
                var tempArr = pkgMatches.slice(1);
                var name = tempArr[1];
                var version = tempArr[2];

                var unmetMatches = name.match(REGEX.unmet);
                var invalidMatches = version.match(REGEX.invalid);
                var versionMatches = version.match(REGEX.version);

                // Check for invalid dependencies
                if (invalidMatches) {
                    version = invalidMatches[1];
                } 

                // Check for UNMET dependencies
                if (unmetMatches) {
                    name = unmetMatches[1]
                    version = 'UNMET'
                }

                // Check for linked packages
                if (versionMatches) {
                    version = versionMatches[1];
                }

                pkgs[name] = version;
            }
        });
        d.resolve(pkgs)
    });
    return d.promise           
}
