const http = require('http');
const url  = require('url');
const imageProxy = require('./imageProxy');
const imageProxyUtils = require('./imageProxyUtils');

const CONFIG = {
    port: process.env.PORT || 3000
}

const httpRequestHandler = (request, response) => {
    console.log(`Request received: ${request.url}`);
    const requestUrl = url.parse(request.url, true);  
    switch (requestUrl.pathname){   
    case '/':
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end();
        break;    
    case '/image':
        try {
            imageProxy.imageProxyHandler(requestUrl, response);
        }
        catch(e) {
            imageProxyUtils.serverError(e, response);
        }
        break;    
    default:
        console.log(`Error: path ${requestUrl.pathname} not found`);
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('404 Not Found', 'utf-8');
        break;  
    }
}

http.createServer(httpRequestHandler).listen(CONFIG.port);
console.log(`Server running at http://127.0.0.1:${CONFIG.port}/`);

module.exports = { CONFIG }