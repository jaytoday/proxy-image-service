# Proxy Image Service 

A simple Node.js image proxy service. It can be used by an application to render images hosted on remote servers while protecting users against cross-site request forgery attacks. 

The image content is piped directly from the remote service to the client for efficient usage of memory, and the remote response headers are forwarded to the client response.

## Demo 

A [demo instance of the service](https://proxy-image-service-dot-tap-trust.appspot.com) has been deployed via Google Cloud. 

Here are a few examples of the image proxy functionality: 

* [Example 1](https://proxy-image-service-dot-tap-trust.appspot.com/image?url=https%3A%2F%2Fimg3.thelist.com%2Fimg%2Fgallery%2Fwhatever-happened-to-lisa-frank%2Fshe-thinks-shes-very-very-famous.jpg)
* [Example 2](https://proxy-image-service-dot-tap-trust.appspot.com/image?url=https%3A%2F%2Fs.gravatar.com%2Favatar%2F0fa604b440cb38bd8e1f935114524ff9%3Fsize%3D100%26default%3Dretro)
* [Example 3 (301 redirect is followed)](https://proxy-image-service-dot-tap-trust.appspot.com/image?url=https%3A%2F%2Fproxy.co%2Ffavicon.ico)


## Usage

To use the proxy service, simply specify a URL in the format of `[proxyServerDomain]/image?url=[remoteImageUrl]` as the `src` attribute of an image element:

```
<img src="/image?url=[link]" alt="[link]">
```

### Header Forwarding

All response headers from the remote server are included in the proxy image service's responses when the remote image has been successfully retrieved. 

### Supported Content Types 

The remotely hosted image must have a `Content Type` response header that begins with `image/`. Here are a few examples of supported content types: 

* `image/jpeg` 
* `image/gif` 
* `image/png`
* `image/svg+xml`

The specified `url` value does **not** need to include an image file extension such as `.jpg`, `.gif`, or `.png`. 


## Getting Started 

### Installation

This package does not contain any dependencies, so to install it you simply need to use commands `git clone` and `cd proxy-image-service` to enter the project directory.

Run the Node.js server locally with command `npm start`. 

### Testing 

Run tests with command `npm test`.

### Deployment

To deploy on Google Compute Engine, use command `npm run deploy`. 

Make sure you have first authenticated with command `gcloud auth login` and logged into an account that has permissions on Google Cloud to deploy to your project's `proxy-image-service` as specified in the `app.yaml` file. For more information, refer to the [Google Cloud developer documentation](https://cloud.google.com/appengine/docs/flexible/nodejs/quickstart). To deploy to an alternative cloud compute provider, modify the `deploy` script command in the `package.json` file to use your preferred provider.

You can tail the logs sent to the Google Compute Engine instance with command `gcloud app logs tail -s proxy-image-service`. 
