const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(file, 'utf8');

            // Replace literal TSX >$ with >₦
            let newContent = content.replace(/>\$/g, '>₦');

            // Replace > $ with > ₦
            newContent = newContent.replace(/> \$/g, '> ₦');

            // Replace `$${ inside template literals
            newContent = newContent.replace(/`\$\$\{/g, '`₦${');

            // Replace 'Free' : `$${ with 'Free' : `₦${
            newContent = newContent.replace(/:\s*`\$\$\{/g, ': `₦${');

            // Replace " $\" format if anywhere
            newContent = newContent.replace(/"\$/g, '"₦');

            // Specifically handling "$\" cases
            newContent = newContent.replace(/text-gray-400">\$/g, 'text-gray-400">₦');

            if (content !== newContent) {
                fs.writeFileSync(file, newContent);
                console.log('Fixed currency in: ' + file);
            }
        }
    });
    return results;
}

walk('.');
console.log('Currency replacement complete.');
