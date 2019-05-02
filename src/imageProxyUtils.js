
const badRequestError = (err, response) => {
  console.error(`Bad Request Error: ${err}`);
  response.writeHead(400, { 'Content-Type': 'text/html' });
  response.end(`400 Bad Request: ${err}`, 'utf-8');
}

const serverError = err => {
    console.error(`Server Error: ${err}`);
    response.writeHead(500, { 'Content-Type': 'text/html' });
    response.end('500 Server Error');
}

const validateImageUrl = imageUrl => {
  const isURL = str => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }  
  if (!isURL(imageUrl.href)) return `Invalid URL ${imageUrl.href}`;
  if (imageUrl.protocol !== 'http:' && imageUrl.protocol !== 'https:'){
    return `Invalid Protocol: ${imageUrl.protocol}`;
  }
  return false;
}

module.exports = { badRequestError, serverError, validateImageUrl };