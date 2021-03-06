const sqlite3 = require('better-sqlite3');
const AWS = require('aws-sdk');
const fs = require('fs');

const {
  DomFixer,
  clean,
  extractLeadImage,
  extractImageMeta,
} = require('./lib/dom-fixer');

var bucket = 'nypr-cms-demo';
var key = 'gothamist.db';
var uploadKey = 'gothamist-fixed.db';

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
    let buffer = new Buffer.from(data, 'binary');
    let params = {
      Bucket: bucketName,
      Key: keyName,
      Body: buffer,
      ACL: 'public-read',
    };
    console.log('uploading to S3');
    s3.upload(params, (err, data) => {
      if (err) throw err;
      console.log(`File uploaded successfully at ${data.Location}`)
    })
  });

  fs.unlinkSync(fileName);
};

const readDB = () => {
  // open the database
  let db = new sqlite3(key);

  //Update each entry in the database
  var ids = db.prepare(`
    SELECT original_id as id
    FROM entries
    ORDER BY authored_on DESC
  `).all();

  for (let id of ids) {
    let row = db.prepare(`
      SELECT original_id as id, title as title, blob as blob
      FROM entries
      WHERE original_id == ?
    `).get(id.id);

    console.log(`Processing article:\t${row.id}\t${row.title}`);

    const articleJSON = JSON.parse(row.blob);

    const domFixer = new DomFixer(articleJSON.text);
    clean(domFixer);

    // remove duplicate lead image
    // mutates passed in nodes
    let [leadImage] = extractLeadImage(domFixer.nodes);

    // extract caption and credit and alt
    if (leadImage) {
      let img = leadImage.querySelector('img');

      let src = img ? img.src : '';

      let [, caption, credit] = extractImageMeta(leadImage);
      caption = caption ? caption.trim() : '';
      credit = credit ? credit.trim() : '';

      let alt = caption ? DomFixer.removeHTML(caption) : "";

      articleJSON.leadImage = {
        src,
        caption,
        credit,
        alt
      };
    }

    const HTML = Array.from(domFixer.nodes.childNodes).map(node => node.outerHTML);
    articleJSON.text = HTML.join('');

    const ARTICLE_BLOB = JSON.stringify(articleJSON);

    db.transaction(() => {
      db.prepare(`
        UPDATE entries
        SET blob = @blob
        WHERE original_id == @id
      `).run({
        blob: ARTICLE_BLOB,
        id: row.id
      });
    })();
  }

  console.log('finished processing');
}

s3Download(bucket, key).then(readDB).then(() => s3Upload(bucket, uploadKey, key));
