var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
  var file = req.url.replace("/", "");
  var fileNames = file.split(".");
  var extension = fileNames.length > 0 ? fileNames[fileNames.length-1] : 'text/html';
  var mimeType = getMIMEType(extension);

  file = (file === "" || !["tracker", "admin", "tracker.js", "manifest.json", "images/logo.png", "serviceworker.js", "analytics"].includes(file)) ? "tracker" : file;
  file = (file === "tracker" || file === "admin" || file === "analytics") ? file + ".html" : file;

  fs.readFile(file, function(err, data) {
    res.writeHead(200, {'Content-Type': mimeType});
    res.write(data);
    return res.end();
    
  });
}).listen(process.env.PORT || 4200)

function getMIMEType(type) {
  var mime = {
      html: 'text/html',
      txt: 'text/plain',
      css: 'text/css',
      gif: 'image/gif',
      jpg: 'image/jpeg',
      png: 'image/png',
      svg: 'image/svg+xml',
      js: 'application/javascript',
      json: 'application/json'
  };
  return !mime[type] ? mime["html"] : mime[type];
}
