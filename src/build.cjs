const fs = require('node:fs');
const path = require('node:path');

const snippets = {
  STYLE: ['story.css', 'practice.css', 'mobile-app.css', 'mobile-practice.css'],
  STORIES: ['stories.js'],
  SIMULATOR: ['simulator.js'],
  PRACTICE: ['practice.js'],
  APP: ['story-app.js'],
};

const template = fs.readFileSync(path.join(__dirname, 'story-template.html'), 'utf8');
const html = template.replace(/\/\* (STYLE|STORIES|SIMULATOR|PRACTICE|APP) \*\//g, (_, name) => {
  return snippets[name].map(file => fs.readFileSync(path.join(__dirname, file), 'utf8')).join('\n');
});

const destination = process.argv[2] ?? path.join(__dirname, '..', 'index.html');
fs.writeFileSync(destination, html.replace(/\r\n/g, '\n'), 'utf8');
