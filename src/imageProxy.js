const url  = require('url');
const imageProxyUtils = require('./imageProxyUtils');
const imageProxyHttp = require('./imageProxyHttp');

const imageProxyHandler = (requestUrl, response) => {
    let imageUrl;
    let {badRequestError, serverError} = imageProxyUtils;
    try {
        imageUrl = url.parse(requestUrl.query.url);
        if (!['http:','https:'].includes(imageUrl.protocol)) throw('Unsupported protocol');
    } 
    catch(err) {
        return badRequestError(`Unable to parse URL: ${requestUrl.query.url}`,
            response);
    }
    const fetchImage = new Promise((resolve, fail) => { 
        try {
            imageProxyHttp.fetchRemoteImage(imageUrl, resolve, fail);
        } catch(e) {
            fail(e, serverError);
        }
    });
    fetchImage
        .then(remoteImageResponse => {
            pipeRemoteImage(remoteImageResponse, response);
        })
        .catch((error, errorType=badRequestError) => errorType(error, response));
}

const pipeRemoteImage = (remoteImageResponse, response) => {
    response.writeHead(200, remoteImageResponse.headers);
    remoteImageResponse.pipe(response, { end: true });
}

module.exports = { imageProxyHandler };