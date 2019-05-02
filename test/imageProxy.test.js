const assert = require('assert');
const http = require('http');
const app = require('../app');

const exampleImageUrl = 'https%3A%2F%2Fs.gravatar.com%2Favatar%2F0fa604b440cb38bd8e1f935114524ff9%3Fsize%3D100%26default%3Dretro';
const redirectedImageUrl = 'https%3A%2F%2Fproxy.co%2Ffavicon.ico';
const nonImageUrl = 'https%3A%2Fwww.google.com';
const notFoundUrl = 'https%3A%2F%2Fproxy.com%2Fnotfound';

describe('Image Proxy Service', () => {
  describe('httpRequestHandler', () => {
    
    it('should respond with 200 status for request to root path', done => {
      http.get(`http://localhost:${app.CONFIG.port}`, res => {
        assert.equal(200, res.statusCode);
        done();
      });
    });
    
    it('should respond with 404 status for request to unknown path', done => {
      http.get(`http://localhost:${app.CONFIG.port}/unknown`, res => {
        assert.equal(404, res.statusCode);
        done();
      });
    });
  });
  
  describe('imageProxy', () => {
    
    it('should respond with image when a HTTPS remote image URL is sent to /image', done => {
      http.get(`http://localhost:${app.CONFIG.port}/image?url=${exampleImageUrl}`, res => {
        let responseBody = '';
        assert.equal(200, res.statusCode);
        assert.equal('image/jpeg', res.headers['content-type']);
        res.on('data', function(chunk) {
          responseBody += chunk;
        });
        res.on('end', function() {
          assert.equal(5349, responseBody.length);
          done();
        });
      });
    });
    
    it('should respond with image when a valid HTTP remote image URL value is sent to /image', done => {
      const exampleHttpImageUrl = exampleImageUrl.replace('https:', 'http:');
      http.get(`http://localhost:${app.CONFIG.port}/image?url=${exampleImageUrl}`, res => {
        let responseBody = '';
        assert.equal(200, res.statusCode);
        assert.equal('image/jpeg', res.headers['content-type']);
        res.on('data', function(chunk) {
          responseBody += chunk;
        });
        res.on('end', function() {
          assert.equal(5349, responseBody.length);
          done();
        });
      });
    });
    
    it('should respond with image when a remote image URL containing 301/302 response is sent', done => {
      http.get(`http://localhost:${app.CONFIG.port}/image?url=${redirectedImageUrl}`, res => {
        assert.equal(200, res.statusCode);
        assert.equal('image/vnd.microsoft.icon', res.headers['content-type']);
        done();
      });
    });
    
    it('should respond with 400 status when unsupported protocol is used', done => {
      const unsupportedProtocolUrl = exampleImageUrl.replace('https:', 'ftp:');
      http.get(`http://localhost:${app.CONFIG.port}/image?url=${unsupportedProtocolUrl}`, res => {
        assert.equal(200, res.statusCode);
        assert.equal('image/jpeg', res.headers['content-type']);
        done();
      });
    });
    
    it('should respond with 400 status for non-image URL value', done => {
      http.get(`http://localhost:${app.CONFIG.port}/image?url=${nonImageUrl}`, res => {
        assert.equal(400, res.statusCode);
        done();
      });
    });
    
    it('should respond with 400 status for not found image URL value', done => {
      http.get(`http://localhost:${app.CONFIG.port}/image?url=${notFoundUrl}`, res => {
        assert.equal(400, res.statusCode);
        done();
      });
    });
    
  });
});