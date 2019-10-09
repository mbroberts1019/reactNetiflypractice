exports.handler = function(event, context, callback) {
    callback(null, {
        statusCode: 200,
        body: `This only took me ${Math.floor(Math.random() * 10)} hours`
        
    });
};
