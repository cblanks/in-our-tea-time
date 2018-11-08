// 
// Dependencies
// 
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

// 
// Functions
//
const exec = (cmd, cb) => {
  cp.exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    cb(stdout);
  });
}

const download = (url, cb) => {
  console.log('Downloading', url);
  const cmd = `wget ${url}`;
  exec(cmd, (res) => { cb(); });
}

const duration = (filePath, cb) => {
  console.log('Finding duration of', filePath);
  const cmd = `ffprobe -v quiet -print_format json -show_format -show_streams ${filePath}`;
  exec(cmd, (res) => { cb(JSON.parse(res).streams[0].duration); });
}

const cut = (fileParts, duration, cb) => {
  console.log('Clipping to end of', fileParts.base);
  const clipDuration = 90;
  const start = Math.max(duration - clipDuration, 0); 
  const cmd = `ffmpeg -ss ${start} -i ${fileParts.base} -vn -acodec copy ${fileParts.name}_end.mp3`;
  exec(cmd, (res) => { cb(); });
}

const parseCategory = (fileName) => {
  return fileName
    .split(': ')[1]
    .split('.json')[0];
};

const alreadyProcessed = (progress, feed) => {
  return false;
}

const processNextFeed = (progress, cb) => { 
  // step through feeds to find one not yet processed
  let record;
  const feedListFiles = fs.readdirSync('./feeds');

  for (let i =  0; i < feedListFiles.length; i++) {
    let foundNewFeed = false;
    const feedList = JSON.parse(fs.readFileSync('./feeds/'+feedListFiles[i], 'utf8'));

    for (let j =  0; j < feedList.length; j++) {
      if (alreadyProcessed(progress, feedList[j])) break;
      foundNewFeed = true;
      record = {
        category: parseCategory(feedListFiles[i]),
        url: feedList[j].media,
        title: feedList[j].title,
        pubDate: feedList[j].pubDate,
        transcript: null,
        counts: { tea: 0, coffee: 0 }
      };
    }

    if (foundNewFeed) break;
  }

  if (record) {
    const fileParts = path.parse(record.url);
    
    download(record.url, () => {
      duration(fileParts.base, (seconds) => {
        cut(fileParts, seconds, () => {
          // process with havenondemand
          console.log('done');
          cb(record); 
        });
      });
    });
  }
};

// 
// Main
// 
// cron job runs this every X seconds to comply with haven ondemand processng restrictions
const progressFile = path.resolve('./progress.json');

fs.readFile(progressFile, 'utf8', (err, data) => {
  let json = [];
  try {
    json = JSON.parse(data);
  } catch (e) {
    // if (err) console.log(err);
  } 

  processNextFeed(json, (result) => {
    json.push(result);
    fs.writeFileSync(
      progressFile,
      JSON.stringify(json, null, 2),
      'utf8'
    );
  });
});
