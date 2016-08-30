'use strict';
const express = require( 'express' );
const path = require( 'path' );
const fs = require( 'fs' );
const url = require( 'url' );
const bodyParser = require( 'body-parser' );
const apiVersion = require( './package' ).version;
const promisify = require( './promisify' );
const rimraf = require( 'rimraf' );

const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const read = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const readStream = promisify(fs.createWriteStream);

let app = express();

let router = (route) => '/api/'+ apiVersion + route;

app.set('port', 8080);
app.listen(app.get('port'), () => {
  console.log('Node app is running on http://localhost:' + app.get('port') );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//default
app.get('/', (req, res) => {
  res.send('<html><body><h1>My web app http API! Version ' + apiVersion + '</h1></body></html>');
});


//requests to get all users or posts
app.get(router('/users'), (req, res) => {
  renderGetRequest(req, res);
});

app.get(router('/posts'), (req, res) => {
  renderGetRequest(req, res);
});


//requests to add new user or post
app.post(router('/users'), (req, res) => {
  renderPostRequest(req, res);
});

app.post(router('/posts'), (req, res) => {
  renderPostRequest(req, res);
});


//request to update particular user or post
app.put(router('/users/:id'), (req, res) => {
  renderPutRequest(req, res);
});

app.put(router('/posts/:postId'), (req, res) => {
  renderPutRequest(req, res);
});


//requests to delete particular user or post
app.delete(router('/users/:id'), (req, res) => {
  renderDeleteRequest(req, res);
});

app.delete(router('/posts/:postId'), (req, res) => {
  renderDeleteRequest(req, res);
});


//render functions
function renderGetRequest(req, res) {
  'use strict';
  let dirPath = modifiedfilePath(req, '');

  readDir(dirPath).then((allFiles) => {
    if (allFiles.length) {

      let promises = [];
      allFiles.forEach((file) => {
        let filePath = path.join(dirPath, file);

        let promise = stat(filePath).then((stats) => {
          if (stats.isDirectory()) {
            return filePath  + '/' + req.method.toLowerCase() + '.json';
          }
        });
        promises.push(promise);
      });

      Promise.all(promises).then((paths) => {
        res.setHeader('content-type', 'application/json');

        let promisesPaths = [];
        paths.forEach((path) => {
          if (path) promisesPaths.push(read(path))
        });

        Promise.all(promisesPaths).then((filesBuffer) => {
          let filesContentArray = filesBuffer.map((buff) => JSON.parse(buff.toString('utf8')).pop());
          res.status(200).json(filesContentArray).end();
        });
      });
    }
  }, (reson) => {
    res.status(404).json([{
      "status": "fail"
    }]).end();
  });
}

function renderPostRequest(req, res) {
  'use strict';
  let data = JSON.stringify(req.body);
  let dirPath = ((req.path).indexOf('users') > 0) ? modifiedfilePath(req, req.body.pop().id) : modifiedfilePath(req, req.body.pop().postId);

  stat(dirPath).then((stats) => {

    if (stats.isDirectory()) {
      res.status(409).json([{
        "status": "fail"
      }]).end();
    }

  }, (reason) => {

    mkdir(dirPath).then((err) => {
      if (err) console.error(err);

      let filePath = path.join(dirPath, '/get.json');
      let stream = fs.createWriteStream(filePath);

      stream.on('error', (err) => {
        console.error(err);
      });

      stream.write(data, () => {
        res.status(201).json(JSON.parse(data)).end();
      });
    });

  });
}


function renderPutRequest(req, res) {
  'use strict';
  let filePath = modifiedfilePath(req, '/get.json');
  let data = JSON.stringify(req.body);

  stat(filePath).then((stats) => {

    if (stats.isFile()) {
      let stream = fs.createWriteStream(filePath);

      stream.on('error', (err) => {
        console.error(`Error: ${err}`);
      });

      stream.write(data, () => {
        res.status(200).json([{
          "status": "success"
        }]).end(`User updated: ${data}`);
      });

    }
  }, (reason) => {
      res.status(404).json([{
        "status": "fail"
      }]).end();
  });
}


  function renderDeleteRequest(req, res) {
    'use strict';
    let dirPath = modifiedfilePath(req, '');

    stat(dirPath).then((stats) => {

      if (stats.isDirectory()) {

        rimraf(dirPath, (err) => {
          if (err) console.error(`Error: ${err}`);

          res.status(200).json([{
            "status": "success"
          }]).end();
        });

      }
    }, (reason) => {
        res.status(404).json([{
          "status": "fail"
        }]).end();
    });
  }

  function modifiedfilePath(req, opts) {
    'use strict';
    let options = opts || '';
    return path.join(__dirname, req.path, '/', options).replace('/' + apiVersion + '/', '/');
  }
