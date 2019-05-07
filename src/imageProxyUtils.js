
const badRequestError = (err, response) => {
    console.error(`Bad Request Error: ${err}`);
    response.writeHead(400, { 'Content-Type': 'text/html' });
    response.end(`400 Bad Request: ${err}`, 'utf-8');
}

const serverError = (err, response) => {
    console.error(err);
    response.writeHead(500, { 'Content-Type': 'text/html' });
    response.end('500 Server Error');
}


module.exports = { badRequestError, serverError };