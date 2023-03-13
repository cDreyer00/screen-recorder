const prompt = require('prompt-sync')({ sigint: true })
const { record, audioDevices } = require("./ffmpegHandler")

async function execute() {
    // catch audio devices
    const devices = await audioDevices();
    console.log(`${devices.length} audio devices were found:`)
    devices.map((item, index) => console.log(`  ${index} - ${item}`))
    console.log(`  ${devices.length} - NONE`)

    // select one
    const n = prompt('type a number to select your device: ')
    const selectedDevice = devices[n];

    if (!selectedDevice) {
        console.log(`audio device not selected, screen will be recorded without audio`)
    } else {
        console.log(`${selectedDevice} was chosen`)
    }

    // choose out file name and start recording
    const outFileName = prompt('output file name: ')
    record(outFileName, selectedDevice)
        .then(data => console.log(data))
        .catch(err => console.log("ERROR =>", err))

    console.log("start recording")
    console.log("press CTRL+C to stop")
}

execute()

// // capture screen accord to dimensions
// 'ffmpeg -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 test.avi'

// // capture screen with mic (testing)
// 'ffmpeg -f dshow -i audio="Microphone (G600)" -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 test.avi'

// // list devices
// 'ffmpeg -list_devices true -f dshow -i dummy'

// // record webcam
// 'ffmpeg -f dshow -i video="V380 FHD Camera" cam.avi'

// // web and system sound
// 'ffmpeg -f dshow -i video="V380 FHD Camera":audio="Mixagem estéreo (Realtek High Definition Audio)" cam.avi'

// // web and micro and system sound
// 'ffmpeg -f dshow -i video="V380 FHD Camera":audio="Mixagem estéreo (Realtek High Definition Audio)" -f dshow -i audio="Microphone (G600)" cam.avi'

// // desktop | micro | system sound
// 'ffmpeg -f dshow -i audio="Microphone (G600)" -f dshow -i audio="Mixagem estéreo (Realtek High Definition Audio)" -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 2 -map "[a]" screen.avi'

// // TESTS
// 'ffmpeg -f dshow -i audio="Microphone (G600)" -f dshow -i audio="Mixagem estéreo (Realtek High Definition Audio)" -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 2 -map "[a]" screen.avi'

// 'ffmpeg -f dshow -i audio="Microphone (G600)" -f dshow -i audio="Mixagem estéreo (Realtek High Definition Audio)" -f gdigrab -video_size 1920x1080 -i desktop -framerate 30 -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 2 -map "[a]" testaaa.avi'