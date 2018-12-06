# Simple Session
An API that allows for the storage of session data based off of keys. 

This file is incomplete, more soon - hopefully in the form of CloudFormation.

The basic setup for this lambda code is:
API Gateway -> header/params management -> Lambda -> Elasitcache (Redis backed)

The translation of the `GET` has a Mapping Template for `application/json`:
```
#set($allParams = $input.params())
{
  "params" : {
    #foreach($type in $allParams.keySet())
    #set($params = $allParams.get($type))
    "$type" : {
      #foreach($paramName in $params.keySet())
      "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
      #if($foreach.hasNext),#end
      #end
    }
    #if($foreach.hasNext),#end
    #end
  },
    "method": "$context.httpMethod"
}
```

The translation of the `POST` has a Mapping Template for `application/json`:
```
{
    "method": "$context.httpMethod",
    "body" : $input.json('$'),
    "headers": {
        #foreach($param in $input.params().header.keySet())
        "$param": "$util.escapeJavaScript($input.params().header.get($param))"
        #if($foreach.hasNext),#end
        #end
    }
}
```