var fs = require('fs');
var archiver = require('archiver');
var path = require("path");
var child_process = require("child_process");
var cwd = process.cwd()

const config = {
        ip: '10.95.156.161',
        from: 'dist/',
        //远端目录
        to: '/usr/local/webserver/nginx/html',
        //上传到远程后的文件目录
        remoteDirName : 'passenger',
        //widget目录下的那些文件就不要发布了
        exclude : /\/widget\//i,
        //支持对文件进行字符串替换
        replace : {
            from : 'static.udache.com',
            to : '10.95.156.161'
        }
};

init();

function init(){
    console.info('deploying to: '+config.ip)
    compress(config,function(){
        runUpload(config)
    })
}


function compress(config,cb){
    // create a file to stream archive data to.
    var output = fs.createWriteStream(cwd+'/pack.zip');

    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    archive.pipe(output);

    archive.directory(config.from, false);

// callbacks
    output.on('close', function() {
        cb();
        console.log(archive.pointer() + ' total bytes archived');
    });
    archive.on('error', function(err) {
        throw err;
    });

    archive.finalize();
}

function runUpload(config) {
    if (!config.to) {
        throw new Error('options.to is required!');
    } else if (!config.remoteDirName) {
        throw new Error('options.remoteDirName is required!');
    }
    var zipfile = 'pack.zip';
    var scp_cmd = 'scp '+zipfile+' root@'+config.ip+':'+config.to+';rm -rf '+ zipfile +';';

    var unzip_cmd = "ssh root@" + config.ip + " \"cd " + config.to +";mkdir "+config.remoteDirName+ ";unzip -ou " + zipfile +" -d "+config.remoteDirName+";rm -rf "+ zipfile +";exit;\"";
    child_process.exec(scp_cmd, function(e1, p1) {
        if (e1) {
            console.error(e1);
        } else {
            console.log("Upload complete.")
        }
        child_process.exec(unzip_cmd, function(e2, p2) {
            if (e2) {
                console.error(e2);
            } else {
                console.log("Remote unzip complete.")
            }
        })
    })
}
