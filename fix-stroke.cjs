const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.css'));

let count = 0;
files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // E.g. -webkit-text-stroke: 1px var(--cyan); color: transparent;
  // We'll replace this with a responsive class or use CSS vars.
  // Actually, let's just use CSS variables map.
  
  if (content.includes('-webkit-text-stroke')) {
    // Basic replace for the one-liners
    content = content.replace(/-webkit-text-stroke:\s*1px\s*var\(--cyan\);\s*color:\s*transparent;/g, 
                             '-webkit-text-stroke: var(--stroke-w) var(--cyan); color: var(--stroke-c);');
                             
    // Hero.css has it spread out:
    /*
      color: transparent;
      -webkit-text-stroke: 1.5px var(--cyan);
    */
    content = content.replace(/color:\s*transparent;\s*-webkit-text-stroke:\s*1\.5px\s*var\(--cyan\);/g, 
                             'color: var(--stroke-c); -webkit-text-stroke: var(--stroke-w-hero) var(--cyan);');
                             
    // About.css has it spread out:
    content = content.replace(/color:\s*transparent;\s*-webkit-text-stroke:\s*1px\s*var\(--cyan\);/g, 
                             'color: var(--stroke-c); -webkit-text-stroke: var(--stroke-w) var(--cyan);');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + file);
    count++;
  }
});
console.log(`Updated ${count} files.`);
