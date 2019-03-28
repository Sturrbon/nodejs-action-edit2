
// 2-9
// const net = require('net');
// const server = net.createServer(socket => {
// 	socket.on('data', data => {
// 		socket.write(data);
// 	});
// });
// server.listen(8888);

// 2-11
// const events = require('events');
// const net = require('net');
// const channel = new events.EventEmitter();
// channel.clients = {};
// channel.subscriptions = {};
// channel.on('join', function(id, client) {
// 	const welcome = `
// 	Welcome!
// 		Guests online: ${this.listeners('broadcast').length}
// 	`;
// 	client.write(`${welcome}\n`)
// 	this.clients[id] = client;
// 	this.subscriptions[id] = (senderId, message) => {
// 		if (id != senderId) {
// 			this.clients[id].write(message);
// 		}
// 	}
// 	this.on('broadcast', this.subscriptions[id]);
// });
// channel.on('leave', function(id) {
// 	channel.removeListener('broadcast', this.subscriptions[id])
// 	channel.emit('broadcast', id, `${id} has left the chatroom.\n`);
// })
// channel.on('shutdown', () => {
// 	channel.emit('broadcast', '', 'The server has shut down.\n')
// 	channel.removeAllListeners('broadcast')
// })
// const server = net.createServer(client => {
// 	const id = `${client.remoteAddress}:${client.remotePort}`;
// 	channel.emit('join', id, client);
// 	client.on('data', data => {
// 		data = data.toString();
// 		if (data === 'shutdown') {
// 			channel.emit('shutdown');
// 		}
// 		channel.emit('broadcast', id, data)
// 	});
// 	client.on('close', () => {
// 		channel.emit('leave', id)
// 	})
// });
// server.listen(8888)

// 2-13 
// const fs = require('fs')
// const events = require('events')

// class Watcher extends events.EventEmitter {
// 	constructor(watchDir, processedDir) {
// 		super();
// 		this.watchDir = watchDir;
// 		this.processedDir = processedDir;
// 	}

// 	watch() {
// 		fs.readdir(this.watchDir, (err, files) => {
// 			if (err) throw err;
// 			for (var index in files) {
// 				this.emit('process', files[index])
// 			}
// 		});
// 	}

// 	start() {
// 		fs.watchFile(this.watchDir, () => {
// 			this.watch();
// 		});
// 	}
// }

// module.exports = Watcher;
// const watchDir = './watch';
// const processedDir = './done';
// const watcher = new Watcher(watchDir, processedDir);

// watcher.on('process', (file) => {
// 	const watchFile = `${watchDir}/${file}`;
// 	const processedFile = `${processedDir}/${file.toLowerCase()}`;
// 	fs.rename(watchFile, processedFile, err => {
// 		if (err) throw err;
// 	})
// })

// watcher.start()

// 2-17 串行化流程控制

// const fs = require('fs');
// const request = require('request');
// const htmlparser = require('htmlparser');
// const configFilename = './rss_feeds.txt';
// function checkForRSSFile() {
// 	fs.exists(configFilename, (exists) => {
// 		if (!exists) 
// 			return next(new Error(`Missing RSS file: ${configFilename}`));
// 		next(null, configFilename);
// 	});
// }
// function readRSSFile(configFilename) {
// 	fs.readFile(configFilename, (err, feedList) => {
// 		if (err) return next(err);
// 		feedList = feedList
// 			.toString()
// 			.replace(/^\s+|\s+$/g, '')
// 			.split('\n')
// 		const random = Math.floor(Math.random() * feedList.length);
// 		next(null, feedList[random]);
// 	})
// }
// function downloadRSSFeed(feedUrl) {
// 	request({ uri: feedUrl }, (err, res, body) => {
// 		if (err) next(err);
// 		if (res.statusCode !== 200)
// 			return next(new Error('Abnormal response status code'));
// 		next(null, body)
// 	});
// }
// function parseRSSFeed(rss) {
// 	const handler = new htmlparser.RssHandler();
// 	const parser = new htmlparser.Parser(handler);
// 	parser.parseComplete(rss);
// 	if (!handler.dom.items.length)
// 		return next(new Error('No RSS items found'));
// 	const item = handler.dom.items.shift();
// 	console.log(item.title);
// 	console.log(item.link);
// }
// const tasks = [
// 	checkForRSSFile,
// 	readRSSFile,
// 	downloadRSSFeed,
// 	parseRSSFeed
// ];
// function next(err, result) {
// 	if (err) throw err;
// 	const currentTask = tasks.shift();
// 	if (currentTask) {
// 		currentTask(result);
// 	}
// }
// next();

// 2-18 并行化流程控制
// const fs = require('fs');
// const tasks = [];
// const wordCounts = {};
// const filesDir = './done';
// let completedTasks = 0;

// function checkIfComplete() {
// 	completedTasks++;
// 	if (completedTasks === tasks.length) {
// 		for (let index in wordCounts) {
// 			console.log(`${index}: ${wordCounts[index]}`);
// 		}
// 	}
// }

// function addWordCount(word) {
// 	wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
// }

// function countWordsInText(text) {
// 	const words = text
// 		.toString()
// 		.toLowerCase()
// 		.split(/\W+/)
// 		.sort();
	
// 	words
// 		.filter(word => word)
// 		.forEach(word => addWordCount(word));
// }

// fs.readdir(filesDir, (err, files) => {
// 	if (err) throw err;
// 	files.forEach(file => {
// 		const task = (file => {
// 			return () => {
// 				fs.readFile(file, (err, text) => {
// 					if (err) throw err;
// 					countWordsInText(text);
// 					checkIfComplete();
// 				});
// 			};
// 		})(`${filesDir}/${file}`);
// 		tasks.push(task);
// 	})
// 	tasks.forEach(task => task());
// });