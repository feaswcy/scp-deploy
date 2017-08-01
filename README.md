scp uploader
========

uploader scripts using scp

### config

see details in build/deploy.js


### dependency

```bash
$ npm install archiver
```

### use
you must add SSH keys to your docker before use,see [SSH keys help](https://itbilu.com/linux/management/EJTmGG7re.html)

```bash
$ node deploy.js # in project you can decide on youself
```

### use in project
1. modify the domain in config/test.js

2. modify the config in build/deploy.js

3. add npm scripts in package.json

```javascript
    "scripts":{
        "deploy": "node ./build/deploy.js"
    }
```
4. npm run deploy



