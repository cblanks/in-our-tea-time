// Dependencies
const fs = require('fs');
const Parser = require('rss-parser');

// Main
const parser = new Parser();

const feedList = [
  'http://podcasts.files.bbci.co.uk/p01drwny.rss',
  'http://podcasts.files.bbci.co.uk/p01dh5yg.rss',
  'http://podcasts.files.bbci.co.uk/p01f0vzr.rss',
  'http://podcasts.files.bbci.co.uk/p01gvqlg.rss',
  'http://podcasts.files.bbci.co.uk/p01gyd7j.rss'
];

feedList.forEach(feedUrl => {
  parser.parseURL(feedUrl, (err, feed) => {
    console.log(feed.title);
    
    const summary = feed.items
      .map(entry => {
        return { 
          media: entry.enclosure.url,
          title: entry.title,
          link: entry.link,
          pubDate: entry.pubDate
        };
      });
  
    fs.writeFileSync(
      feed.title + '.json',
      JSON.stringify(summary, null, 2),
      'utf8'
    );
  });
});
