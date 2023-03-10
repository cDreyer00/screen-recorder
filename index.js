const { spawn } = require('child_process');

// start recording
const startRecording = () => {
  const ffmpegProcess = spawn('ffmpeg', ['-f', 'gdigrab', '-framerate', '30', '-i', 'desktop', 'C:/Users/crist/Desktop/output.avi']);

  // listen for errors
  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`FFmpeg error: ${data}`);
  });

  // listen for when recording stops
  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  return ffmpegProcess;
};

// stop recording
const stopRecording = (ffmpegProcess) => {
  ffmpegProcess.stdin.write('q\n');
};

// start recording when program starts
const ffmpegProcess = startRecording();

// listen for program exit
process.on('SIGINT', () => {
  console.log('Stopping recording...');
  stopRecording(ffmpegProcess);
  process.exit();
});



