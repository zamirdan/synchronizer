var la =require('lazy-ass');
var check = require('check-more-types');
var fs = require('fs');

describe('synchronizer', function () {
    var synchronizer;
    beforeEach(function () {
        synchronizer = require('../synchronizer');
    });
   // it('is an object', () => console.assert(typeof synchronizer === 'object'));
    it('is an object', () => la(check.object(synchronizer), 'synchronizer should be an object', synchronizer));
    it('has function run', () => la(check.fn(synchronizer.run), 'synchronizer should be an object', synchronizer));
    it('has function sync', () => la(check.fn(synchronizer.sync), 'synchronizer should be an object', synchronizer));
    it('is using fs async methods as sync methods', (done) => testSyncFS(synchronizer,done));

});



function testSyncFS(synchronizer,done){

    function* syncFile (){

        var timesStamp  = new Date().getMilliseconds()
        var textToWrite = "test me "+ timesStamp;
        var fileName = 'test/'+timesStamp+'.txt';

        var FileCreateResult = yield synchronizer.sync(fs.writeFile,fileName , textToWrite);
       checkResult(FileCreateResult);


        var fileStatResult = yield synchronizer.sync(fs.stat, fileName);
        checkResult(FileCreateResult);

        var readFileResult = yield synchronizer.sync(fs.readFile, fileName);
        checkResult(readFileResult);

        var textFromFile = readFileResult.result.toString();
        if(textToWrite != textFromFile){
            throw  new Error("test fail text is not match");
        }

        //var removeFileResult = yield synchronizer.sync(fs.unlink, fileName);
     //   checkResult(removeFileResult);

       done();

    }
    function checkResult(result){
        if(result.error){
            throw new Error (result.error);
        }
    }

    synchronizer.run(syncFile());


}