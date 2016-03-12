var la =require('lazy-ass');
var check = require('check-more-types');
var fs = require('fs');

describe('syncme', function () {
    var syncme;
    beforeEach(function () {
        syncme = require('../syncme');
    });
   // it('is an object', () => console.assert(typeof syncme === 'object'));
    it('is an object', () => la(check.object(syncme), 'syncme should be an object', syncme));
    it('has function run', () => la(check.fn(syncme.run), 'syncme should be an object', syncme));
    it('has function sync', () => la(check.fn(syncme.sync), 'syncme should be an object', syncme));
    it('is using fs async methods as sync methods', (done) => testSyncFS(syncme,done));
});

describe('syncme.createSyncFunction', function () {
    var syncme;
    beforeEach(function () {
        syncme = require('../syncme');
    });
    it('is converting async functions to sync', (done) => testcreateSyncFunction(syncme,done));

});

function checkResult(result){
    if(result.error){
        throw new Error (result.error);
    }
}

    function testSyncFS(syncme,done){

    function* syncFile (){

        var timesStamp  = new Date().getMilliseconds()
        var textToWrite = "test me "+ timesStamp;
        var fileName = 'test/syncme'+timesStamp+'.txt';

        var FileCreateResult = yield syncme.sync(fs.writeFile,fileName , textToWrite);
       checkResult(FileCreateResult);


        var fileStatResult = yield syncme.sync(fs.stat, fileName);
        checkResult(FileCreateResult);

        var readFileResult = yield syncme.sync(fs.readFile, fileName);
        checkResult(readFileResult);

        var textFromFile = readFileResult.result.toString();
        if(textToWrite != textFromFile){
            throw  new Error("test fail text is not match");
        }

        var removeFileResult = yield syncme.sync(fs.unlink, fileName);
        checkResult(removeFileResult);

       done();

    }


    syncme.run(syncFile());


}


function testcreateSyncFunction(syncme,done) {

    var writeFile = syncme.createSyncFunction(fs.writeFile);
    var stat = syncme.createSyncFunction(fs.stat);
    var readFile = syncme.createSyncFunction(fs.readFile);
    var unlink = syncme.createSyncFunction(fs.unlink);

    function* syncFile (){

        var timesStamp  = new Date().getMilliseconds()
        var textToWrite = "test me "+ timesStamp;
        var fileName = 'test/syncme'+timesStamp+'.txt';

        var FileCreateResult = yield writeFile(fileName , textToWrite);
        checkResult(FileCreateResult);


        var fileStatResult = yield stat(fileName);
        checkResult(FileCreateResult);

        var readFileResult = yield readFile( fileName);
        checkResult(readFileResult);

        var textFromFile = readFileResult.result.toString();
        if(textToWrite != textFromFile){
            throw  new Error("test fail text is not match");
        }

        var removeFileResult = yield unlink( fileName);
        checkResult(removeFileResult);

        done();



    }

    syncme.run(syncFile());

}
