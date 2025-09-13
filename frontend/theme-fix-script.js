// Automated theme compatibility fix script
// This script will systematically replace hardcoded colors with theme-aware CSS variables

const fs = require('fs');
const path = require('path');

const replacements = [
  // Background gradients
  { from: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900', to: 'transition-colors duration-300" style={{\n        background: \'var(--background)\',\n        backgroundImage: \'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 50%, var(--surface) 100%)\'\n      }}' },
  
  // Text colors
  { from: 'text-white', to: 'text-primary' },
  { from: 'text-gray-300', to: 'text-secondary' },
  { from: 'text-gray-400', to: 'text-muted' },
  { from: 'text-gray-500', to: 'text-muted' },
  { from: 'text-gray-600', to: 'text-muted' },
  { from: 'text-gray-700', to: 'text-secondary' },
  { from: 'text-gray-800', to: 'text-primary' },
  { from: 'text-gray-900', to: 'text-primary' },
  
  // Border colors
  { from: 'border-white/10', to: 'border-border/20' },
  { from: 'border-white/20', to: 'border-border/40' },
  
  // Background colors
  { from: 'bg-white/5', to: 'bg-surface/20' },
  { from: 'bg-white/10', to: 'bg-surface/30' },
  { from: 'hover:bg-white/5', to: 'hover:bg-surface/20' },
  { from: 'hover:bg-white/10', to: 'hover:bg-surface/30' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replaceAll(from, to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(fullPath);
    }
  });
}

// Process the entire src directory
processDirectory('./src');
console.log('Theme compatibility fixes completed!');
