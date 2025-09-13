const fs = require('fs');
const path = require('path');

function fixSyntaxErrors(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixSyntaxErrors(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const before = content;
      
      // Fix the specific pattern: }} className="..." -> } className="..."
      content = content.replace(/}}\s+(className="[^"]*"[^>]*>)/g, '} $1');
      
      // Fix patterns where CSS properties are mixed with className
      content = content.replace(/}}\s+([a-zA-Z-]+[^>]*>)/g, (match, p1) => {
        // If it looks like CSS classes, wrap in className
        if (p1.match(/^(flex|items-|justify-|p-|m-|w-|h-|max-|min-|bg-|text-|border-|rounded-)/)) {
          return `} className="${p1.replace('>', '')}">`;
        }
        return match;
      });
      
      if (content !== before) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed syntax in: ${fullPath}`);
      }
    }
  });
}

console.log('Starting comprehensive syntax fix...');
fixSyntaxErrors('./src');
console.log('Syntax fix completed!');
