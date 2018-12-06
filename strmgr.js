module.exports.return = function (code, message, body) {
    console.log(message);
    
    var success = {
        statusCode: code,
        body: body,
    };
    return success;
}

module.exports.traverse_object = function (my_obj, prefix){
    console.log("Traversing an obj, keys: "+ Object.keys(my_obj).length)
    if(! prefix){ prefix = ">";}
    Object.keys(my_obj).forEach(function(key) {
        var val = my_obj[key];
        if (typeof val == "object"){
            console.log(prefix+"<"+ key +">")
            module.exports.traverse_object(val, prefix+key+" > ");
            console.log(prefix+"</"+ key +">")
        } else {
            console.log(prefix +"'"+ key +"': "+ val);
        }
    });
}