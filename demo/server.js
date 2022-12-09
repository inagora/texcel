const url = require('node:url');
const http = require('node:http');
const fs = require('fs');
const path = require('path');


// Server has a 5 seconds keep-alive timeout by default
http
  .createServer((req, res) => {
		const reqUrl = url.parse(req.url);
		switch(reqUrl.pathname) {
			case '/': {
				res.setHeader('content-type', 'text/html');
				res.write(fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8'));
				break;
			}
			default: {
				const filePath = path.resolve(__dirname, '..', '.'+reqUrl.pathname);
				// console.log(__dirname, reqUrl.pathname, path.resolve(__dirname, '..'), path.resolve(__dirname, '..', reqUrl.pathname))
				console.log(filePath)
				if(fs.existsSync(filePath)){
					res.write(fs.readFileSync(filePath, 'utf-8'));
				}
			}
		}
    res.end();
  })
  .listen(3000);
