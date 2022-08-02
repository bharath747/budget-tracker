const express = require('express');

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const app = express();
app.use(express.static(__dirname + '/'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TOKEN_PATH = 'token.json';

var filePath = null;

app.get('/', (_, res) => {
   res.sendFile(`${__dirname}/tracker.html`);
});

app.post("/backup", (req, res) => {
  var obj = JSON.stringify(req.body);
    tempFile('temp.json', obj)
            .then(path => filePath = path)
            .catch(e => console.log("e", e))
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        authorize(JSON.parse(content), uploadFile);
    });
  res.end(JSON.stringify("success"));  
})

app.get('/restore', (_, res) => {
  var response = performOperationOnDrive(getBackupData);
  console.log(response);
  res.end(JSON.stringify("success"));  
});

app.listen(4200, () => {
    console.log('Form running on port 4200');
});

function tempFile (name = 'temp_file.json', data = '', encoding = 'utf8') {
  const fs = require('fs');
  const os = require('os');
  const path = require('path');

  return new Promise((resolve, reject) => {
      const tempPath = path.join(os.tmpdir(), 'foobar-');
      fs.mkdtemp(tempPath, (err, folder) => {
          if (err) 
              return reject(err)

          const file_name = path.join(folder, name);

          fs.writeFile(file_name, data, encoding, error_file => {
              if (error_file) 
                  return reject(error_file);

              resolve(file_name)
          })
      })
  })
}


function performOperationOnDrive(callback) {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), callback);
});
}

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) console.log("Error accessing token");
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getBackupData(auth) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
      q:"name = 'backup.json' and '1YvaC0rDHuB4P8nziUGquQHL9ZHuXS97Z' in parents and trashed = false",
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)'
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
          getFileByFileId(auth, file.id);
        });
      } else {
        console.log('No files found.');
      }
    });
}

function getFileByFileId(auth, fileId) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.get({
    q:"parents in '1YvaC0rDHuB4P8nziUGquQHL9ZHuXS97Z' and trashed = false",
    pageSize: 10,
    fileId: fileId,
    alt : 'media'
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    //console.log(res.data);
    return res.data;
  });
}

function uploadFile(auth) {
    console.log("File : " + filePath );
    const { data } = google.drive({ version: 'v3' , auth}).files.create({
      media: {
        mimeType: 'application/json',
        body: fs.createReadStream(filePath),
      },
      requestBody: {
        name: 'backup.json',
        parents: ['1YvaC0rDHuB4P8nziUGquQHL9ZHuXS97Z'],
      },
      fields: 'id,name',
    });
  };