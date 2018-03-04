var http=require('http');
http.createServer(function(req,res){
	res.writeHead(200,{"Content-Type":"text/plain"});
	res.end("hello world!");
}).listen(8080,'127.0.0.1');
console.log("node.js server running at localhost:8080");