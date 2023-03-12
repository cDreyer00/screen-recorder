const ffmpegStatic = require('ffmpeg-static');
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);

const videosPath = './videos'

async function record() {
    const { stdout, stderr } = await execFile(ffmpegStatic, [
        '-f', 'dshow',
        '-i', 'audio="Microphone (G600)"',
        '-f', 'dshow',
        '-i', 'audio="Mixagem estéreo (Realtek High Definition Audio)"',
        '-f', 'gdigrab',
        '-video_size', '1920x1080',
        '-i', 'desktop',
        '-framerate', '30',
        '-filter_complex', '"[0:a][1:a]amerge=inputs=2[a]"',
        '-map', '2',
        '-map', '"[a]"',
        `${videosPath}/s-m-system.avi`
    ], {
        shell: true
    })

    if (stderr) {
        throw stderr;
    }

    return stdout;
}

function convert() {
    ffmpeg('./videos/output.mkv')
        .output('output.avi')
        .run()
}

// convert()
record()
    .then(data => console.log(data))
    .catch(err => console.error("ERROR:", err.message))

// capture screen accord to dimensions
'ffmpeg -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 test.avi'

// capture screen with mic (testing)
'ffmpeg -f dshow -i audio="Microphone (G600)" -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 test.avi'

// list devices
'ffmpeg -list_devices true -f dshow -i dummy'

// record webcam
'ffmpeg -f dshow -i video="V380 FHD Camera" cam.avi'

// web and system sound
'ffmpeg -f dshow -i video="V380 FHD Camera":audio="Mixagem estéreo (Realtek High Definition Audio)" cam.avi'

// web and micro and system sound
'ffmpeg -f dshow -i video="V380 FHD Camera":audio="Mixagem estéreo (Realtek High Definition Audio)" -f dshow -i audio="Microphone (G600)" cam.avi'

// desktop | micro | system sound
'ffmpeg -f dshow -i audio="Microphone (G600)" -f dshow -i audio="Mixagem estéreo (Realtek High Definition Audio)" -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 2 -map "[a]" screen.avi'

// TESTS
'ffmpeg -f dshow -i audio="Microphone (G600)" -f dshow -i audio="Mixagem estéreo (Realtek High Definition Audio)" -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 2 -map "[a]" screen.avi'

'ffmpeg -f dshow -i audio="Microphone (G600)" -f dshow -i audio="Mixagem estéreo (Realtek High Definition Audio)" -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 2 -map "[a]" testaaa.avi'