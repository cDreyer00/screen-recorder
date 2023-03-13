const ffmpegStatic = process.cwd() + '/ffmpeg/ffmpeg';
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);

const videosPath = './videos'

async function record(outFileName, audioDeviceName) {
    let ffmpegArgs;
    if (audioDeviceName) {
        ffmpegArgs = [
            // '-f', 'dshow',
            // '-i', 'audio="Microphone (G600)"',
            '-f', 'dshow',
            '-i', `audio="${audioDeviceName}"`,
            '-f', 'gdigrab',
            '-video_size', '1920x1080',
            '-i', 'desktop',
            '-framerate', '30',
            // '-filter_complex', '"[0:a][1:a]amerge=inputs=2[a]"',
            // '-map', '2',
            // '-map', '"[a]"',
            `${videosPath}/${outFileName}.avi`
        ]
    } else {
        ffmpegArgs = [
            '-f', 'gdigrab',
            '-video_size', '1920x1080',
            '-i', 'desktop',
            '-framerate', '30',
            `${videosPath}/${outFileName}.avi`
        ]
    }

    const { stdout, stderr } = await execFile(ffmpegStatic, ffmpegArgs, { shell: true })

    if (stderr) {
        throw stderr;
    }

    return stdout;
}

async function convert(I, O) {
    const { stdout, stderr } = await execFile('ffmpeg', [
        '-i', `${videosPath}/${I}`,
        `${videosPath}/${O}.mp4`
    ], {
        shell: true
    })

    if (stderr) {
        throw stderr;
    }

    return stdout;
}

async function audioDevices() {
    return execFile('ffmpeg', [
        '-list_devices', `true`,
        '-f', `dshow`,
        '-i', `dummy`,
    ], {
        shell: true
    })
        .then(res => {
            const m = res.message
            const audioDevices = getAudioDevices(m);
            return audioDevices
        })
        .catch(err => {
            const m = err.message
            const audioDevices = getAudioDevices(m);
            return audioDevices
        })
}

function getAudioDevices(string) {
    try {
        let devices = string
            .split('\n')
            .filter(line => line.includes('[dshow @'))

        let audioDevices = devices
            .filter(item => item.includes('audio'))
            .map(item => item.split('"')[1])

        return audioDevices;
    }
    catch (e) {
        return "audio devices not found"
    }
}


// FOR EXAMPLE
const withMoreAudioDevices = [
    '-f', 'dshow',
    '-i', 'audio="Microphone (G600)"',
    '-f', 'dshow',
    '-i', `audio="Mixagem estéreo (Realtek High Definition Audio)"`,
    '-f', 'gdigrab',
    '-video_size', '1920x1080',
    '-i', 'desktop',
    '-framerate', '30',
    '-filter_complex', '"[0:a][1:a]amerge=inputs=2[a]"',
    '-map', '2',
    '-map', '"[a]"',
]

module.exports = {
    record,
    convert,
    audioDevices
}