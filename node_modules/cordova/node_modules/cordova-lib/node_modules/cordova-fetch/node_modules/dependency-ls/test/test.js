var t = require('tap')
var ls = require('../index')

t.test('test depList', function(t) {
    return ls(process.cwd()).then(function(result) {
        return t.test('q should be version 1.4.1', function(t) { 
            t.equal(result['q'],'1.4.1')
            t.end();
        })
    })
})
