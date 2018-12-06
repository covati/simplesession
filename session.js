const strmgr = require("./strmgr");
const cache = require("./cache");

exports.handler = async (event) => {
    // strmgr.traverse_object(event);
    
    const client = cache.client_setup(process.env);
    
    const session_data = await manage_session(event, client);
    
    console.log("Session data is : "+ session_data)
    return strmgr.return(200,"Good response", session_data);
};

/**
 * @param {event} event The event object
 * @param {redis_client} client a connected redis client, call from within on-ready
 */
function manage_session(event, client) {
    return new Promise(function (resolve, reject) {
        client.on('error', function (err) {
            console.log('>>>>> Failed to connect to session cache ' + err);
            reject(strmgr.return(500,"Failed to get session data,"+ err,err));
        }).on('ready', function () {
            // test a failure
            // reject(strmgr.return(500,"Failed to find a header in this request"));
            let request;
            try{
                request = get_request_data(event);
            }catch(err){
                console.log("We're in catch: "+err)
                return reject(strmgr.return(500,"Request failure: "+ err,"Request failure: "+ err));
            }

            if (request.method == 'GET') {
                const my_get = cache.get_value(client, request.session_id);
                my_get.then(function(reply){
                    resolve(reply);
                });
            } else if (request.method == 'POST'){
                // session_id   = event.body.session_id;
                // session_data = event.body.session_data;
                // account_id   = event.body.account_id;
                const my_set = cache.set_value(client, request.session_id, request.session_data);
                my_set.then(function(reply){
                    resolve(reply);
                });
            } else {
                return reject(strmgr.return(500,"Total failure","Total failure")); 
            }
        });
    });
}

/**
 * 
 * @param {*} event the event data passed in from the lambda invocation
 */
function get_request_data(event){

    if(! event.method){
        console.log("No Method passed in");
        throw("Failed to find a header in this request");
    } else if(event.method == 'GET'){
        var account_id = "NONE";
        if (! event.params.querystring.account_id){
            account_id = event.params.querystring.account_id;
        }
        
        return {
            "method"      : "GET",
            "session_id" : get_session_key(event.params.querystring.session_id, account_id),
            "account_id" : account_id
        }
    } else if (event.method == 'POST'){
        var account_id = "NONE";
        if (! event.body.account_id){
            account_id = event.body.account_id;
        }       
        
        return {
            "method"        : "POST",
            "session_id"   : get_session_key(event.body.session_id, account_id),
            "session_data" : event.body.session_data,
            "account_id"   : account_id
        }
    } else {
        console.log("Bad Method passed in: "+ event.method);
        throw("Bad method supplied: "+ event.method);
    }
}

/**
 * Build a key that this data will be indexed by in the cache based on Session Id and account Id
 * @param {string} session_id 
 * @param {string} account_id 
 */
function get_session_key(session_id, account_id){
    return "||"+account_id +"||"+ session_id;
}
