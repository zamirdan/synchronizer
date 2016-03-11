

function syncRunner(gen,val) {

    var context;

    if (val) {
        context = gen.next(val).value;
    }
    else {
        context = gen.next().value;
    }

    if (!context) {
        return;
    }

    var args = context.param.slice();
    args.push(function () {
        var args = argumentsToArray( arguments);
        syncRunner(gen, args);
    });
    context.func.apply(this, args);
}

function syncFunction(func,theRest ){

    var args = argumentsToArray( arguments);
    args.shift();
    return  {func:func, param:args } ;
}

function argumentsToArray(args){

    var array = (args.length === 1?[args[0]]:Array.apply(null, args));
    return array;
}


module.exports.sync = syncFunction;
module.exports.run = syncRunner;








