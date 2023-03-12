const { spawn } = require('child_process');
const ffmpeg = spawn('ffmpeg', [
    '-list_devices', 'true',
    '-f',
    'dshow',
    '-i',
    'video=V380 FHD Camera',
]);

