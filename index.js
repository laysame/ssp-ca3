// Back-end
const http = require('http'), //HTTP server
    path = require('path'),
    express = require('express'), //handling HTTP requests and routing
    fs = require('fs'), // File system functionalities
    xmlParse = require('xslt-processor').xmlParse, // XML handling
    xsltProcess = require('xslt-processor').xsltProcess, //XSLT handling
    app = express(), // Initialize the server
    xml2js = require('xml2js');

app.use(express.static(path.resolve(__dirname, 'views')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

/**
 *
 * @param filename
 * @param cb
 * @constructor converts XML file to JSON format
 */
const XMLtoJSON = (filename, cb) => {
    let filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
    });
};

/**
 *
 * @param filename
 * @param cb
 * @param obj
 * @constructor converts JSON file to XML format
 */
const JSONtoXML = (filename, obj, cb) => {
    let filepath = path.normalize(path.join(__dirname, filename));
    let builder = new xml2js.Builder();
    let xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
};


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

app.post('/post/json', function (request, response) {
    function appendJSON(obj) {
        XMLtoJSON('todo.xml', function (err, result) {
            if (err) throw (err);

            const day = result.todo.day[obj.section];
            // If the day does not have a task node yet, we make sure to create the array to contain the children
            if (!day.task) {
                day.task = [];
            }

            day.task.push({'listing': obj.listing});

            JSONtoXML('todo.xml', result, function (err) {
                if (err) throw (err)
            });
        });
    };

    appendJSON(request.body);

    response.redirect('back');
});

app.post('/post/delete', function (request, response) {
    function deleteJSON(obj) {
        console.log(obj);
        XMLtoJSON('todo.xml', function (err, result) {
            if (err) throw (err);
            console.log(result)
            result.todo.day[obj.section].task.splice(obj.task, 1);

            JSONtoXML('todo.xml', result, function (err) {
                if (err) throw (err)
            });
        });
    }

    deleteJSON(request.body);

    response.redirect('back');
});

/**
 * Setup server to be listened to the port 3000
 * @type {Server<typeof IncomingMessage, typeof ServerResponse>}
 */
const server = http.createServer(app).listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    const address = server.address();
    console.log(`Server listening at ${address.address}:${address.port}`);
});