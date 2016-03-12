# syncme
Write async code in a sync style with js generators.


## Example of use:

var fs = require('fs');

var syncme = require('syncme');

//syncme.sync - use to warp call to async code the

//the yield call will puase the execution, until fs.writeFile  finished

//result is object with 3 fields error, result, args {error:error, result:result args:args}

//syncme.sync expects to get as paramters an async func to call the the pramater to send to this function.

//syncme.sync expects that the async func last pramamter is a callcabk node style (err, result)

//any way all the callcabk paramters can be found in result.args... just for case....

//just look the code....

 function* syncFile (){
 
  var fileName = 'test.txt';
  
  var textToWrite = 'Hi from syncme';
  
  var result = yield syncme.sync(fs.writeFile,fileName , textToWrite);
  
  var readFileResult = yield syncme.sync(fs.readFile, fileName);

  //print file text
  
  console.log(readFileResult.result.toString());
  
  //delete the file
  
  var removeFileResult = yield syncme.sync(fs.unlink, fileName);
  
  if(result.error){  throw new Error (result.error);}
 }
 
 // run the generator....
 
  syncme.run(syncFile());
