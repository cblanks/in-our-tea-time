let Parser = require('rss-parser');

let parser = new Parser();

parser.parseURL('http://podcasts.files.bbci.co.uk/p01gyd7j.rss', (err, feed) => {
  console.log(feed.title);
//   feed.items.forEach(entry => {
//     console.log(entry.title + ':' + entry.link);
//   })
  console.log(Object.keys(feed.items[0]));
  console.log(feed.items[0].enclosure);
});
