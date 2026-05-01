const fs = require('fs');

function fixMojibake(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Only convert the parts that are corrupted, or just do the whole file if all non-ascii is corrupted.
  // Actually, doing the whole file is safest if the file was saved with wrong encoding.
  const buf = Buffer.from(content, 'latin1');
  let fixedContent = buf.toString('utf8');
  
  fs.writeFileSync(filePath, fixedContent, 'utf8');
  console.log('Fixed encoding in ' + filePath);
}

// 1. Fix encodings
try {
  fixMojibake('index.html');
} catch(e) { console.error('Error fixing index.html:', e.message); }

try {
  fixMojibake('public/sitemap.xml');
} catch(e) { console.error('Error fixing sitemap.xml:', e.message); }

// 2. Fix Favicon
try {
  let indexContent = fs.readFileSync('index.html', 'utf8');
  // Replace the old ico links with modern svg and standard ico fallbacks
  const oldFaviconRegex = /<link rel="icon" type="image\/x-icon" href="\/bagpiperico\.ico" \/>[\s\S]*?<link rel="shortcut icon" href="\/bagpiperico\.ico" \/>/;
  
  const newFavicon = `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate icon" href="/bagpiperico.ico" />
    <link rel="apple-touch-icon" href="/bagpiperico.ico" />`;
    
  if (oldFaviconRegex.test(indexContent)) {
    indexContent = indexContent.replace(oldFaviconRegex, newFavicon);
    fs.writeFileSync('index.html', indexContent, 'utf8');
    console.log('Fixed favicon in index.html');
  } else {
    console.log('Favicon regex did not match, please check index.html manually.');
  }
} catch(e) {
  console.error('Error fixing favicon:', e.message);
}
