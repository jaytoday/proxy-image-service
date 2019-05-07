const assert = require('assert');
const http = require('http');
const app = require('../src/app');

const exampleImageUrl = 'https%3A%2F%2Fs.gravatar.com%2Favatar%2F0fa604b440cb38bd8e1f935114524ff9%3Fsize%3D100%26default%3Dretro';
const exampleLargeImageUrl = 'https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F0%2F0a%2FKeswick%2C_Cumbria_Panorama_1_-_June_2009.jpg';
const redirectedImageUrl = 'https%3A%2F%2Fproxy.co%2Ffavicon.ico';
const nonImageUrl = 'https%3A%2F%2Fwww.google.com';
const notFoundPath = 'https%3A%2F%2Fproxy.com%2Fnotfound';
const httpErrorUrl = 'https%3A%2F%2Fhttp.error';

const testResponseBody = (res, test) => {
    let responseBody = '';
    res.on('data', function(chunk) {
        responseBody += chunk;
    });
    res.on('end', function() {
        test(responseBody);
    });
}

describe('Image Proxy Service', () => {

    describe('Image Proxy Success Conditions', () => {

        it('should respond with image when a HTTPS remote image URL is sent to /image', done => {
            http.get(`http://localhost:${app.CONFIG.port}/image?url=${exampleImageUrl}`, res => {
                assert.equal(200, res.statusCode);
                assert.equal('image/jpeg', res.headers['content-type']);
                testResponseBody(res, body => {
                    assert.equal(5349, body.length);
                    done();
                });
            });
        });

        it('should respond with image when a valid HTTP remote image URL value is sent to /image', done => {
            const exampleHttpImageUrl = exampleImageUrl.replace('https%', 'http%');
            http.get(`http://localhost:${app.CONFIG.port}/image?url=${exampleImageUrl}`, res => {
                assert.equal(200, res.statusCode);
                assert.equal('image/jpeg', res.headers['content-type']);
                testResponseBody(res, body => {
                    assert.equal(5349, body.length);
                    done();
                });
            });
        });

        it('should respond with image when a very large HTTPS remote image URL is sent to /image', done => {
            const request = http.get(`http://localhost:${app.CONFIG.port}/image?url=${exampleLargeImageUrl}`, res => {
                assert.equal(200, res.statusCode);
                assert.equal('image/jpeg', res.headers['content-type']);
                request.abort(); // full image file will not be downloaded
                done();
            });
        });

        it('should respond with image when a remote image URL containing 301/302 response is sent', done => {
            http.get(`http://localhost:${app.CONFIG.port}/image?url=${redirectedImageUrl}`, res => {
                assert.equal(200, res.statusCode);
                assert.equal('image/vnd.microsoft.icon', res.headers['content-type']);
                testResponseBody(res, body => {
                    assert.equal(14508, body.length);
                    done();
                });
            });
        });

    });
    
    describe('Image Proxy Error Conditions', () => {
    
        it('should respond with 400 status when unsupported protocol is used', done => {
            const unsupportedProtocolUrl = exampleImageUrl.replace('https%', 'ftp%');
            http.get(`http://localhost:${app.CONFIG.port}/image?url=${unsupportedProtocolUrl}`, res => {
                assert.equal(400, res.statusCode);
                assert.equal('text/html', res.headers['content-type']);
                testResponseBody(res, body => {
                    assert.equal('400 Bad Request: Unable to parse URL:\
 ftp://s.gravatar.com/avatar/0fa604b440cb38bd8e1f935114524ff9?size=100&default=retro', body);
                    done();
                });
            });
        });
    
        it('should respond with 400 status for non-image URL value', done => {
            http.get(`http://localhost:${app.CONFIG.port}/image?url=${nonImageUrl}`, res => {
                assert.equal(400, res.statusCode);
                assert.equal('text/html', res.headers['content-type']);
                testResponseBody(res, body => {
                    assert.equal('400 Bad Request:\
 Unsupported content type text/html; charset=ISO-8859-1', body);
                    done();
                });
            });
        });
    
        it('should respond with 400 status for URL value returning 404 from remote server', done => {
            http.get(`http://localhost:${app.CONFIG.port}/image?url=${notFoundPath}`, res => {
                assert.equal(400, res.statusCode);
                assert.equal('text/html', res.headers['content-type']);
                testResponseBody(res, body => {
                    assert.equal('400 Bad Request: Unsupported remote server status code 404', body);
                    done();
                });
            });
        });
    
        it('should respond with 400 status for URL value resulting in HTTP request error', done => {
            http.get(`http://localhost:${app.CONFIG.port}/image?url=${httpErrorUrl}`, res => {
                assert.equal(400, res.statusCode);
                assert.equal('text/html', res.headers['content-type']);
                testResponseBody(res, body => {
                    assert.equal('400 Bad Request: Error contacting remote server', body);
                    done();
                });
            });
        });
    
    });
  
    it('should respond with 200 status for request to root path', done => {
        http.get(`http://localhost:${app.CONFIG.port}`, res => {
            assert.equal(200, res.statusCode);
            testResponseBody(res, body => {
                assert.equal('', body);
                done();
            });
        });
    });
    
    it('should respond with 404 status for request to unknown path', done => {
        http.get(`http://localhost:${app.CONFIG.port}/unknown`, res => {
            assert.equal(404, res.statusCode);
            testResponseBody(res, body => {
                assert.equal('404 Not Found', body);
                done();
            });
        });
    });
  
});