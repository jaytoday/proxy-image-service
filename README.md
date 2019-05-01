# Proxy Image Service 

A simple Node.js image proxy service. 
The remotely hosted image content is piped directly to the client for efficient usage of memory, and the remote response headers are forwarded to the client response.


## Usage

To use the proxy service, simply specify a URL in the format of `[proxyServerDomain]/image?url=[remoteImageUrl]` as the `src` attribute of an image element:

```
<img src="/image?url=[link]" alt="[link]">
```


### Supported Content Types 

Currently, the remotely hosted image must use one of the following MIME Types in its response headers: 

* `image/jpeg` 
* `image/gif` 
* `image/png`
* `image/svg+xml`

The specified `url` value does **not** need to end in `.jpg`, `.gif`, `.png`, etc. 


## Getting Started 

### Installation

This package does not contain any dependencies, so to install it you simply need to use commands `git clone` and `cd proxy-image-service` to enter the project directory, and run the Node.js server with `node app.js`. 

To automatically restart the server when any project code is modified, install `nodemon` with command `npm install -g nodemon` and run the server with command `nodemon app.js` 

### Testing 

Run tests with command `npm test`.
