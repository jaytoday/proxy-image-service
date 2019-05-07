const url  = require('url');
const imageProxyErrors = require('./imageProxyErrors');
const imageProxyHttp = require('./imageProxyHttp');

const imageProxyHandler = (requestUrl, response) => {
    let imageUrl;
    let {badRequestError, serverError} = imageProxyErrors;
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
        } 
        catch(e) {
            serverError(e, response);
            fail(e);
        }
    });
    fetchImage
        .then(remoteImageResponse => {
            pipeRemoteImage(remoteImageResponse, response);
        })
        .catch(error => {
            if (!response.finished) badRequestError(error, response);
        });
}

const pipeRemoteImage = (remoteImageResponse, response) => {
    response.writeHead(200, remoteImageResponse.headers);
    remoteImageResponse.pipe(response, { end: true });
}

module.exports = { imageProxyHandler };