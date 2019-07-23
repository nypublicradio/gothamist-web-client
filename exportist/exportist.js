const sqlite3 = require('better-sqlite3');
const AWS = require('aws-sdk');
const fs = require('fs');
 
var bucket = 'nypr-cms-demo';
var key = 'gothamist-1k.db';
var uploadKey = 'gothamist-1k-fixed.db';

// pull sqlite file down from S3
var s3 = new AWS.S3();

const s3Download = (bucketName, keyName, localDest) => {

    if (typeof localDest == 'undefined') {
        localDest = keyName;
    }

    let params = {
        Bucket: bucketName,
        Key: keyName
    };

    let file = fs.createWriteStream(localDest);

    return new Promise((resolve, reject) => {
        s3.getObject(params).createReadStream()
        .on('end', () => {
            return resolve();
        })
        .on('error', (error) => {
            return reject(error);
        }).pipe(file);
    });
};

const s3Upload = (bucketName, keyName, fileName) => {
  if (typeof fileName == 'undefined') {
    fileName = keyName;
  }

  fs.readFile(fileName, (err, data) => {
    if (err) throw err;
    let params = {
      Bucket: bucketName,
      Key: keyName,
      Body: JSON.stringify(data, null, 2),
      ACL: 'public-read',
    };
    s3.upload(params, (err, data) => {
      if (err) throw err;
      console.log(`File uploaded successfully at ${data.Location}`)
    })
  });
};

const readDB = () => {
  // open the database
  let db = new sqlite3(key);

  //Update each entry in the database
  var ids = db.prepare(`
    SELECT original_id as id
    FROM entries
    ORDER BY authored_on DESC
    LIMIT 10;
  `).all();

  for (let id of ids) {
    let row = db.prepare(`
      SELECT original_id as id, title as title, blob as blob
      FROM entries
      WHERE original_id == ?
    `).get(id.id);

    console.log(`Processing article:\t${row.id}\t${row.title}`);

    db.transaction(() => {
      db.prepare(`UPDATE entries SET blob = @blob WHERE original_id == @id`).run({ blob: "{updated: 'yes'}", id: row.id})
    })();
  }
  return;
}

s3Download(bucket, key).then(readDB).then(s3Upload(bucket, uploadKey, key));