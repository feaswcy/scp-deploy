var fs = require('fs');
var archiver = require('archiver');
var path = require("path");
var child_process = require("child_process");
var cwd = process.cwd();
var project = process.argv[2] //price/fee-detail

const config = {
    ip: '10.95.156.161',
    from: 'dist/',
    //远端目录
    to: '/usr/local/webserver/nginx/html',
    //上传到远程后的文件目录,可以根据线上实际路径来处理
    remoteDirName : 'driver',
    //[暂不支持]不发布widget文件夹
    exclude : /\/widget\//i,
    //[暂不支持]文件进行字符串替换，可以先run test
    replace : {
        from : 'static.udache.com',
        to : '10.95.156.161'
    }
};

init();

function init(){
    console.info('deploying to: '+config.ip);
    if(project){
        var test_cmd = 'npm run test '+project;
        try{
            var data = child_process.execSync(test_cmd);
            console.log('test task for: '+project+' complete');
        }catch (e){
            console.log(e);
        }
    }
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
    });
    archive.on('error', function(err) {
        throw err;
    });

    archive.finalize();
}

function runUpload(config) {
    if (!config.to) {
        throw new Error('config.to is required!');
    } else if (!config.remoteDirName) {
        throw new Error('config.remoteDirName is required!');
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
