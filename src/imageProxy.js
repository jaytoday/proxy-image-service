const url  = require('url');
const imageProxyUtils = require('./imageProxyUtils');
const imageProxyHttp = require('./imageProxyHttp');

const imageProxyHandler = (requestUrl, response) => {
    let imageUrl;
    try {
        imageUrl = url.parse(requestUrl.query.url);
    } 
    catch(err) {
        return imageProxyUtils.badRequestError(`Unable to parse URL: ${requestUrl.query.url}`,
            response);
    }
    const validationError = imageProxyUtils.validateImageUrl(imageUrl);
    validationError !== false ? 
        imageProxyUtils.badRequestError(validationError, response) :
        undefined;
    const fetchImage = new Promise((resolve, fail) => { 
        imageProxyHttp.fetchRemoteImage(imageUrl, resolve, fail);
    });
    fetchImage.then(remoteImageResponse => {
        pipeRemoteImage(remoteImageResponse, response);
    }, error => {
        imageProxyUtils.badRequestError(error, response);
    });
}

const pipeRemoteImage = (remoteImageResponse, response) => {
    response.writeHead(200, remoteImageResponse.headers);
    remoteImageResponse.pipe(response, { end: true });
}

module.exports = { imageProxyHandler };