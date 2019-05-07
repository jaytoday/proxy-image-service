const http = require('http');
const https = require('https'); 
const url  = require('url');

const MAX_REQUESTS = 5;

const fetchRemoteImage = (imageUrl, resolve, fail, requestsMade=0) => { 
    const fetchModule = imageUrl.protocol === 'https:' ? https : http;
    const remoteRequest = fetchModule.get(imageUrl.href, remoteResponse => {
        if ([301,302].includes(remoteResponse.statusCode)) {
            return makeRecursiveRequest(remoteResponse, resolve, fail, requestsMade);
        } else {
            if (remoteResponse.statusCode !== 200) {
                return fail(`Unsupported remote server status code ${remoteResponse.statusCode}`);
            }
        }
        if (!remoteResponse.headers['content-type'].includes('image/')){
            return fail(`Unsupported content type ${remoteResponse.headers['content-type']}`);
        }
        return resolve(remoteResponse);  
    });
    remoteRequest.on('error', function() {
        fail('Error contacting remote server');
    });
}

const makeRecursiveRequest = (remoteResponse, resolve, fail, requestsMade) => {
    requestsMade++;
    if (requestsMade >= MAX_REQUESTS) {
        return fail('Too many requests made');
    }
    const redirectUrl = url.parse(remoteResponse.headers.location);
    console.log(`Response specifies redirect to ${redirectUrl.href},\
  ${requestsMade} requests made`);
    return fetchRemoteImage(redirectUrl, resolve, fail, requestsMade);
}

module.exports = { fetchRemoteImage };