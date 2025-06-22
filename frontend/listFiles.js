const fs = require('fs');
const path = require('path');

function listFiles(dir, parent = '') {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relPath = path.join(parent, file);
        if (file === 'node_modules') return; // Skip node_modules
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            listFiles(fullPath, relPath);
        } else {
            console.log(relPath);
        }
    });
}

listFiles(__dirname);