scp uploader
========

uploader scripts using scp

### 配置

```javascript

const config = {
        //自己的 docker Ip
        ip: '10.95.156.161',
        from: 'dist/',
        //远端目录，一般是nginx根目录
        to: '/usr/local/webserver/nginx/html',
        //上传到远程后的文件目录
        remoteDirName : 'passenger',
        //[暂不支持]不发布widget文件夹
        exclude : /\/widget\//i,
        //[暂不支持]文件进行字符串替换，可以先run test
        replace : {
            from : 'static.udache.com',
            to : '10.95.156.161'
        }
};

```


### 依赖

```bash
$ npm install archiver
```

### 使用

1. 使用前需要在虚拟机上添加SSH keys，[SSH 帮助](https://itbilu.com/linux/management/EJTmGG7re.html)，这一步是用来进行登陆认证的，如果已经添加过，可以跳过

2. copy deploy.js脚本到自己的build目录下，改一下配置config，然后

```bash
node ./build/deploy.js
```

3. 也可以在package.json中添加scripts

```javascript
    "scripts":{
        "deploy": "node ./build/deploy.js"
    }
```

然后执行

```
$ npm run test  # 测试时先生成测试代码

$ npm run deploy # 将dist上传到虚拟机

$ npm run deploy "price/price-rule" ## 先执行了 npm run test "price/price-rule" 然后deploy

```



