let FS = require("fs");

// read the index.html from build folder
let name = "./build/index.html";
let data = FS.readFileSync(name, "utf8");

function insertContent(fullContent, beforeWhat, newContent) {
  // get the position before which newContent has to be added
  const position = fullContent.indexOf(beforeWhat);

  // since splice can be used on arrays only
  let fullContentCopy = fullContent.split("");
  fullContentCopy.splice(position, 0, newContent);

  return fullContentCopy.join("");
}

// will add the <meta> tags needed for cordova app
const afterAddingMeta = insertContent(
  data,
  "<link",
  // `<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">` +
  //   `<meta name="format-detection" content="telephone=no">` +
  //   `<meta name="msapplication-tap-highlight" content="no">`
  `<meta http-equiv="Content-Security-Policy" content="default-src 'self' * gap://ready wss://* ws://* https://* http://* blob: cdvfile:; img-src 'self' * *.tile.openstreetmap.org https://*.tile.openstreetmap.org data: blob: filesystem: cdvfile:; style-src 'self' 'unsafe-inline' *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *">`
);

// will add <script> pointing to cordova.js
const afterAddingScript = insertContent(
  afterAddingMeta,
  "<script",
  `<script type="text/javascript" src="cordova.js"></script>`
);

// updates the index.html file
FS.writeFile(name, afterAddingScript, "utf8", err => {
  if (err) {
    throw err;
  }
});
