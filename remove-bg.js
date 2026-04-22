const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');

async function run() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  
  if (!fs.existsSync(inputPath)) {
    console.error("Input file not found at", inputPath);
    process.exit(1);
  }

  try {
    const buffer = fs.readFileSync(inputPath);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    
    const resultBlob = await removeBackground(blob);
    const resultArrayBuffer = await resultBlob.arrayBuffer();
    const resultBuffer = Buffer.from(resultArrayBuffer);
    
    fs.writeFileSync(outputPath, resultBuffer);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
