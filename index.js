const express = require('express');

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const e = require('express');

const app = express();
app.use(express.static(__dirname + '/'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TOKEN_PATH = 'token.json';

app.get('/', (_, res) => {
  res.sendFile(`${__dirname}/tracker.html`);
});

app.post("/backup", (req, res) => {
  var obj = JSON.stringify(req.body);
  performOperationOnDrive(getFolderIdByName, 'bharath747').then(fileId => {
    performOperationOnDrive(getMaxId, fileId).then(maxId => {
      if (!isNaN(maxId)) {
        tempFile('temp.json', obj)
          .then(path => {
            fs.readFile('credentials.json', (err, content) => {
              if (err) return console.log('Error loading client secret file:', err);
              performOperationOnDrive(uploadFile, path, parseInt(maxId)+1).then(response => {
                res.end(JSON.stringify(response));
              });
            });
          })
          .catch(e => console.log("e", e))
      }
    });
  });
})

app.get('/restore', (_, res) => {
  performOperationOnDrive(getBackupData).then(response => {
    res.end(JSON.stringify(response));
  });
});

app.listen(4200, () => {
  console.log('Form running on port 4200');
});

function tempFile(name = 'temp_file.json', data = '', encoding = 'utf8') {
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


function performOperationOnDrive(callback, ...args) {
  return new Promise((resolve, reject) => {
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      authorize(JSON.parse(content), callback, args).then(response => {
        return resolve(response);
      });;
    });
  });
}

function authorize(credentials, callback, args) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) console.log("Error accessing token");
      oAuth2Client.setCredentials(JSON.parse(token));
      if (args.length > 0) {
        callback(oAuth2Client, args).then(response => {
          return resolve(response);
        });
      } else {
        callback(oAuth2Client).then(response => {
          return resolve(response);
        });
      }
    });
  });
}

function getBackupData(auth) {
  const drive = google.drive({ version: 'v3', auth });
  return new Promise((resolve, reject) => {
    drive.files.list({
      q: "name = 'backup' and '1YvaC0rDHuB4P8nziUGquQHL9ZHuXS97Z' in parents and trashed = false",
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)'
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        //console.log('Files:');
        files.map((file) => {
          //console.log(`${file.name} (${file.id})`);
          getFileByFileId(auth, file.id).then(response => {
            return resolve(response);
          });
        });
      } else {
        console.log('No files found.');
        return resolve({});
      }
    });
  });
}

function getFileByFileId(auth, args) {
  var fileId = args[0];
  var folderId = args[1];
  const drive = google.drive({ version: 'v3', auth });
  return new Promise((resolve, reject) => {
    drive.files.get({
      q: "parents in " + "'" + folderId + "'" + " and trashed = false",
      pageSize: 10,
      fileId: fileId,
      alt: 'media'
    }, (err, res) => {
      if (err) {
        return reject(err);
        console.log('The API returned an error: ' + err);
      }
      const files = res.data.files;
      //console.log(res.data);
      return resolve(res.data);
    });
  });
}

function uploadFile(auth, args) {
  var filePath = args[0];
  var maxId = args[1];
  var folderId = args[2]
  return new Promise((resolve, reject) => {
    if (!isNaN(maxId)) {
      const { data } = google.drive({ version: 'v3', auth }).files.create({
        media: {
          mimeType: 'application/json',
          body: fs.createReadStream(filePath),
        },
        requestBody: {
          name: 'backup' + "-" + maxId + '.json',
          parents: ["'" + folderId + "'"],
        },
        fields: 'id,name',
      });
      return resolve(data);
    } else {
      return reject("Invalid Id");
    }
  });
};

function getMaxId(auth, args) {
  var folderId = args[0];
  const drive = google.drive({ version: 'v3', auth });
  return new Promise((resolve, reject) => {
    drive.files.list({
      q: "'" + folderId + "'" + " in parents and trashed = false",
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)'
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      var maxId = 0;
      if (files.length) {
        files.map((file) => {
          //console.log(file.name.toString());
          var incrementId = file.name.toString().split("-")[1].split(".")[0];
          maxId = maxId < incrementId ? incrementId : maxId;
        });
        return resolve(maxId);
      } else {
        console.log('No files found.');
        return resolve(0);
      }
    });
  });
}

function getFolderIdByName(auth, args) {
  var folderName = args[0];
  const drive = google.drive({ version: 'v3', auth });
  return new Promise((resolve, reject) => {
    drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and name=" + "'" + folderName + "'" + "and trashed = false",
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)'
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      var maxId = 0;
      if (files.length) {
        console.log(files[0].id);
        return resolve(files[0].id);
      } else {
        console.log('No files found.');
        return resolve(0);
      }
    });
  });
}

