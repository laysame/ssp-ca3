const http = require('http'), //HTTP server
    path = require('path'),
    express = require('express'), //handling HTTP requests and routing
    fs = require('fs'), // File system functionalities
    xmlParse = require('xslt-processor').xmlParse, // XML handling
    xsltProcess = require('xslt-processor').xsltProcess, //XSLT handling
    app = express(), // Initialize the server
    xml2js = require('xml2js');

app.use(express.static(path.resolve(__dirname, 'views')));

/**
 * function to handle request and response xml and xsl
 */
app.get('/get/html', function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});

    let xml = fs.readFileSync('todo.xml', 'utf8'),
        xsl = fs.readFileSync('todo.xsl', 'utf8');

    xml = xmlParse(xml);
    xsl = xmlParse(xsl);

    const html = xsltProcess(xml, xsl);

    response.end(html.toString());
});
/**
 * Setup server to be listened to the port 3000
 * @type {Server<typeof IncomingMessage, typeof ServerResponse>}
 */
const server = http.createServer(app).listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    const address = server.address();
    console.log(`Server listening at ${address.address}:${address.port}`);
});