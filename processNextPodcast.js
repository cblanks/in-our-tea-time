// 
// Dependencies
// 
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

// 
// Functions
//
function exec(cmd, cb) {
  cp.exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    cb(stdout);
  });
}

function download(url, cb) {
  console.log('Downloading', url);
  const cmd = `wget ${url}`;
  exec(cmd, res => { cb(); });
}

function duration(filePath, cb) {
  console.log('Finding duration of', filePath);
  const cmd = `ffprobe -v quiet -print_format json -show_format -show_streams ${filePath}`;
  exec(cmd, res => { cb(JSON.parse(res).streams[0].duration); });
}

function cut(fileParts, duration, cb) {
  console.log('Clipping to end of', fileParts.base);
  const clipDuration = 90;
  const start = Math.max(duration - clipDuration, 0); 
  const cmd = `ffmpeg -ss ${start} -i ${fileParts.base} -vn -acodec copy ${fileParts.name}_end.mp3`;
  exec(cmd, res => { cb(`${fileParts.name}_end.mp3`); });
}

function prepareAudio(record, cb) {
  download(record.url, () => {
    const fileParts = path.parse(record.url);

    duration(fileParts.base, seconds => {
      console.log(seconds);

      cut(fileParts, seconds, audioClipPath => {
        cb(audioClipPath); 
      });
    });
  });
}

function parseCategory(fileName) {
  return fileName
    .split(': ')[1]
    .split('.json')[0];
}

function getNextEpisode(callback) {
  const feedListFiles = fs.readdirSync('./feeds');
  let record = null;

  for (let i = 0; i < feedListFiles.length; i++) {
    let foundNewFeed = false;
    const feedList = JSON.parse(
      fs.readFileSync('./feeds/'+feedListFiles[i], 'utf8')
    );

    for (let j =  0; j < feedList.length; j++) {
      if (!feedList[j].downloaded) {
        foundNewFeed = true;
        record = {
          category: parseCategory(feedListFiles[i]),
          url: feedList[j].media,
          title: feedList[j].title,
          pubDate: feedList[j].pubDate,
          transcript: null,
          counts: { tea: 0, coffee: 0 }
        };
        break;
      }
    }

    if (foundNewFeed) break;
  }

  callback(record);
}

// 
// Main
//

// cron job runs this every X seconds to comply with haven ondemand processng restrictions

getNextEpisode(record => {
  console.log(record);

  prepareAudio(record, audioClipPath => {
    console.log(audioClipPath);

    // TODO: launch BIFHI process
    // save a token file
    console.log(audioClipPath.split('.mp3', '.json'));
  });
});

// const progressFile = path.resolve('./progress.json');

// fs.readFile(progressFile, 'utf8', (err, data) => {
//   let json = [];
//   try {
//     json = JSON.parse(data);
//   } catch (err) {
//     if (err) console.log(err);
//   } 

//   processNextFeed(json, (result) => {
//     json.push(result);
//     fs.writeFileSync(
//       progressFile,
//       JSON.stringify(json, null, 2),
//       'utf8'
//     );
//   });
// });
