const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'videos');
// 小安要的
const needed = ['video_126', 'video_127', 'video_130', 'video_131', 'video_132', 'video_136', 'video_139', 'video_142', 'video_159', 'video_160', 'video_169', 'video_218',
'video_222', 'video_226', 'video_264', 'video_265', 'video_266', 'video_267', 'video_270', 'video_283', 'video_303', 'video_305', 'video_309', 'video_310', 'video_311',
'video_314', 'video_316', 'video_317', 'video_331', 'video_332', 'video_336', 'video_36', 'video_361', 'video_367', 'video_369', 'video_374', 'video_381', 'video_385',
'video_387', 'video_389', 'video_390', 'video_391', 'video_394', 'video_395', 'video_401', 'video_405', 'video_406', 'video_407', 'video_408', 'video_417', 'video_422',
'video_427', 'video_428', 'video_431', 'video_433', 'video_436', 'video_438', 'video_439', 'video_449', 'video_454', 'video_455', 'video_458', 'video_459', 'video_46',
'video_460', 'video_466', 'video_467', 'video_470', 'video_471', 'video_473', 'video_477', 'video_478', 'video_480', 'video_481', 'video_482', 'video_492', 'video_493',
'video_500', 'video_511', 'video_514', 'video_520', 'video_521', 'video_65', 'video_66', 'video_67', 'video_68', 'video_70'];

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
        if (needed.indexOf(file.slice(0, -4)) === -1) fs.unlinkSync(path.join(directoryPath, file));
    });
});