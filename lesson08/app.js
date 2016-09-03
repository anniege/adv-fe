'use strict';
const express = require( 'express' );
const path = require( 'path' );
const fs = require( 'fs' );
const bodyParser = require( 'body-parser' );
const apiVersion = require( './package' ).version;
const promisify = require( './promisify' );
const rimraf = require( 'rimraf' );

const stat = promisify(fs.stat);
const read = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

let app = express();

let router = (route) => '/api/'+ apiVersion + route;

let reqHandler = {
  'get': renderGetRequest,
  'post': renderPostRequest,
  'put': renderPutRequest,
  'delete': renderDeleteRequest
};

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

app.all(router('/:common/((:id)?)'), (req, res) => {
  let common = req.params.common;
  let httpMethod = req.method.toLowerCase();

  (common === 'users' || common === 'posts') ? reqHandler[httpMethod](req, res)  : renderFailStatus(res, 404);
});


//GET request
function renderGetRequest(req, res) {
  let dirPath = modifiedfilePath(req);
  let id = req.params.id;

  if (id !== undefined) {
    let fileName = path.join(dirPath, '/get.json');

    stat(fileName).then((stats) => {
      if (stats.isFile()) {
        let stream = fs.createReadStream(fileName);
        stream.pipe(res);
      }
    }, (reason) => {
      renderFailStatus(res, 404);
    });
  } else {
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
      renderFailStatus(res, 404);
    });
  }
}

// POST request
function renderPostRequest(req, res) {
  if (req.params.id !== undefined) {
    renderFailStatus(res, 400);
    return;
  }

  let data = JSON.stringify(req.body);
  let dirPath = (req.params.common === 'users') ? modifiedfilePath(req, req.body.pop().id) : modifiedfilePath(req, req.body.pop().postId);

  stat(dirPath).then((stats) => {

    if (stats.isDirectory()) {
      renderFailStatus(res, 409);
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

//PUT request
function renderPutRequest(req, res) {

  if (req.params.id === undefined) {
    renderFailStatus(res, 400);
    return;
  }

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
    renderFailStatus(res, 404);
  });
}

//DELETE request
function renderDeleteRequest(req, res) {
  if (req.params.id === undefined) {
    renderFailStatus(res, 400);
    return;
  }

  let dirPath = modifiedfilePath(req);

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
    renderFailStatus(res, 404);
  });
}


function modifiedfilePath(req, opts) {
  let options = opts || '';
  return path.join(__dirname, req.path, '/', options).replace('/' + apiVersion + '/', '/');
}

function renderFailStatus(res, code) {
  res.status(code).json([{
    "status": "fail"
  }]).end();
}
