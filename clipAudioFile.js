// 
// Dependencies
// 
const cp = require('child_process');
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
  const cmd = `ffprobe -v quiet -print_format json -show_format -show_streams ${podcastUrl}`;
  exec(cmd, (res) => { cb(JSON.parse(res).streams[0].duration); });
}

const cut = (fileParts, duration, cb) => {
  console.log('Clipping to end of', fileParts.base);
  const start = Math.max(duration - 60, 0); 
  const cmd = `ffmpeg -ss ${start} -i ${fileParts.base} -c copy ${fileParts.name}_end.mp3`;
  exec(cmd, (res) => { cb(); });
}

// 
// Main
// 
const podcastUrl = 'http://open.live.bbc.co.uk/mediaselector/5/redir/version/2.0/mediaset/audio-nondrm-download/proto/http/vpid/p06lnkbr.mp3';
const fileParts = path.parse(podcastUrl);

download(podcastUrl, () => {
  duration(fileParts.base, (seconds) => {
    cut(fileParts, seconds, () => { console.log('done'); });
  });
});
