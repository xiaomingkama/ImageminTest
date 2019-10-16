const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const fs = require("fs");
const pathS = require('path')
const sourcePath = 'src/art'
const targetPath = 'src/art_compress'
const compressOption = {
    quality: [0.6, 0.8]
}
const color = require('colors');

start()
function start() {
    delDir(targetPath)
    readDir(sourcePath, targetPath)
}
function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}
function readDir(path, target) {
    var dirs = fs.readdirSync(path)
    // if (!fs.existsSync(target)) {
    //     fs.mkdirSync(target)
    // }
    var stat = fs.statSync(path)
    if (stat.isDirectory())
        compress(path, target)
    if (dirs && dirs.length > 0) {
        dirs.forEach(element => {
            var p = path + '/' + element
            var stat = fs.statSync(p)
            if (stat.isDirectory()) {
                var t = target + '/' + element
                readDir(p, t)
            }
        });
    }

}

async function compress(dirPath, targetSubPath) {
    var arr = {}
    var dir = fs.readdirSync(dirPath)
    dir.forEach(element => {
        var filePath = pathS.resolve(dirPath, element)
        var info = fs.statSync(filePath)
        if (!info.isDirectory())
            arr[dirPath + '/' + element] = { before: Math.floor((info.size / 1024) * 1000) / 1000 + 'k', after: '' }
    });
    const files = await imagemin([dirPath + '/*.png'], {
        destination: targetSubPath,
        plugins: [
            imageminPngquant(compressOption)
        ]
    });

    var dir2 = fs.readdirSync(targetSubPath)
    dir2.forEach(element => {
        var filePath = pathS.resolve(targetSubPath, element)
        var info = fs.statSync(filePath)
        if (!info.isDirectory())
            arr[dirPath + '/' + element]['after'] = (Math.floor((info.size / 1024) * 1000) / 1000 + 'k')

    });
    for (var k in arr) {
        console.log(k.green + '  ' + arr[k].before.yellow + ' ====> ' + ((arr[k].after ? arr[k].after : arr[k].before)).yellow)
    }
}

