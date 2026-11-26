const fs = require('node:fs');
const path = require('node:path');

const snippets = {
  STYLE: ['story.css', 'practice.css', 'mobile-app.css', 'mobile-practice.css', 'market.css', 'strategy.css', 'strategy-art.css', 'tour.css'],
  STORIES: ['stories.js'],
  SIMULATOR: ['market-data.js', 'market-chart.js', 'simulator.js', 'tour.js'],
  PRACTICE: ['practice.js'],
  STRATEGY: ['strategy-content.js', 'strategy-art.js', 'strategy.js'],
  APP: ['story-app.js'],
};

const template = fs.readFileSync(path.join(__dirname, 'story-template.html'), 'utf8');
const html = template.replace(/\/\* (STYLE|STORIES|SIMULATOR|PRACTICE|STRATEGY|APP) \*\//g, (_, name) => {
  return snippets[name].map(file => fs.readFileSync(path.join(__dirname, file), 'utf8')).join('\n');
});

const destination = process.argv[2] ?? path.join(__dirname, '..', 'index.html');
fs.writeFileSync(destination, html.replace(/\r\n/g, '\n'), 'utf8');
