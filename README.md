#imdb-grabber

![](https://i.imgur.com/vjZmXDP.png)

# Build from source

You will need [node.js](http://nodejs.org/). Then install grunt and bower:
```
$ npm install -g grunt-cli bower
```

### building
Run at least once to install dependencies.
```
$ npm install
$ grunt
```

# Know issues

##Error about missing libudev.so.0
once built cd into the release directory and run
```
$ sed -i 's/\x75\x64\x65\x76\x2E\x73\x6F\x2E\x30/\x75\x64\x65\x76\x2E\x73\x6F\x2E\x31/g' imdB-Grabber
```


