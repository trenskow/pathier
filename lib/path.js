var fs = require('fs');
var sep = (/^win/i.test(process.platform) ? '\\' : '/');

function path(p) {
	if (!(this instanceof path)) return new path(p);
	if (p instanceof path) return new path(p.full());
	
	this.parts = p.split(sep);
	
	var normalize = function() {
		for (var idx = 0 ; idx < this.parts.length ; idx++) {
			if (idx > 0 && idx < this.parts.length - 1 && this.parts[idx] === '') {
				this.parts.splice(idx, 1);
				idx--;
			} else if (this.parts[idx] == '.') {
				this.parts.splice(idx, 1);
				idx--;
			} else if (idx > 0 && this.parts[idx] == '..') {
				this.parts.splice(idx - 1, 2);
				idx -= 2;
			}
		}
	};
	
	normalize.call(this);
	
	this.full = function() {
		return this.parts.join(sep);
	};
	
	this.isAbsolute = function() {
		return (this.parts.length > 0 && this.parts[0] === '');
	};
	
	this.isRelative = function() {
		return !this.isAbsolute();
	};
	
	this.isFile = function() {
		return (this.parts.length > 0 && this.parts[this.parts.length - 1] !== '');
	};
	
	this.isDirectory = function() {
		return !this.isFile();
	};
	
	this.isIn = function(p) {
		if (!(p instanceof path)) return this.isIn(new path(p));
		if (p.parts.length <= this.parts.length) {
			for (var idx = 0 ; idx < p.parts.length - (p.isDirectory() ? 1 : 0) ; idx++) {
				if (p.parts[idx] != this.parts[idx]) {
					return false;
				}
			}
			return true;
		}
		return false;
	};
	
	this.join = function(p) {
		if (!(p instanceof path)) return this.join(new path(p));
		return path(this.parts.concat(p.parts).join(sep));
	};
	
	this.relative = function(p) {
		if (!(p instanceof path)) return this.relative(new path(p));
		if (p.isRelative()) return this.join(p);
		return path(p);
	};
	
	this.path = function() {
		if (this.isDirectory()) {
			return path(this.full());
		}
		var parts = this.parts;
		return path(parts.splice(0, parts.length - 1).join(sep));
	};
	
	this.name = function() {
		if (this.isFile()) return this.parts[this.parts.length - 1];
		return '';
	};
	
	this.base = function() {
		if (this.isFile()) return this.name().split('.')[0];
		return '';
	};
	
	this.ext = function() {
		if (this.isFile()) return this.name().split('.').splice(1).join('.');
		return '';
	};
	
	this.level = function() {
		var level = 0;
		for (var idx = 0 ; idx < this.parts.length ; idx++) {
			if (!(idx === 0 && this.parts[idx] === '') && this.parts[idx] !== '.') {
				if (this.parts[idx] == '..') level--;
				else level++;
			}
		}
		return level;
	};
	
	this.slice = function() {
		return path(this.parts.slice.apply(this.parts, arguments).join(sep));
	};
	
	this.exists = function(cb) {
		fs.exists(this.full(), cb);
	};
	
	this.stat = function(cb) {
		fs.stat(this.full(), function(err, stats) {
			cb(err, stats);
		});
	};
	
	this.sub = function(start, length) {
		if (length === undefined) length = this.parts.length - start;
		var parts = [];
		for (var idx = start ; idx < this.parts.length && idx < start + length ; idx++) {
			parts.push(this.parts[idx]);
		}
		return path(parts.join(sep));
	};
	
	this.newer = function(other, cb) {
		this.stat(function(err, tStat) {
			if (err) return cb(err);
			other.stat(function(err, oStat) {
				if (err) return cb(err);
				cb(null, (tStat.mtime > oStat.mtime));
			});
		});
	};
	
	this.older = function(other, cb) {
		return other.newer(this, function(err, newer) {
			if (err) return cb(err);
			cb(null, !newer);
		});
	};
	
}

module.exports = exports = path;
