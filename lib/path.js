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
	
	/* Returns the full path and optional file */
	this.full = function() {
		return this.parts.join(sep);
	};
	
	/* Is path absolte */
	this.isAbsolute = function() {
		return (this.parts.length > 0 && this.parts[0] === '');
	};
	
	/* ... or is it relative. */
	this.isRelative = function() {
		return !this.isAbsolute();
	};
	
	/* Does it look like a file (have no trailing /) */
	this.isFile = function() {
		return (this.parts.length > 0 && this.parts[this.parts.length - 1] !== '');
	};
	
	/* ... or does it look like a directory (with trailing /) */
	this.isDirectory = function() {
		return !this.isFile();
	};
	
	/* Is the path another path? */
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
	
	/* Concat two paths */
	this.join = function(p) {
		if (!(p instanceof path)) return this.join(new path(p));
		return path(this.parts.concat(p.parts).join(sep));
	};
	
	/* Concat two paths - resolving their relativeness to each other. */
	this.relative = function(p) {
		if (!(p instanceof path)) return this.relative(new path(p));
		if (p.isRelative()) return this.join(p);
		return path(p);
	};
	
	/* If path is a file - returns the path */
	this.path = function() {
		if (this.isDirectory()) {
			return path(this.full());
		}
		return this.sub(0, this.parts.length - 1);
	};
	
	/* Get filename */
	this.name = function() {
		if (this.isFile()) return this.parts[this.parts.length - 1];
		return '';
	};
	
	/* Get file base (without ext). */
	this.base = function() {
		if (this.isFile()) return this.name().split('.')[0];
		return '';
	};
	
	/* Get the ext */
	this.ext = function() {
		if (this.isFile()) return this.name().split('.').splice(1).join('.');
		return '';
	};
	
	/* How deep is this path? */
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
	
	/* Slice path */
	this.slice = function() {
		return path(this.parts.slice.apply(this.parts, arguments).join(sep));
	};
	
	/* Get subpath (length is optional) */
	this.sub = function(start, length) {
		if (length === undefined) length = this.parts.length - start;
		var parts = [];
		for (var idx = start ; idx < this.parts.length && idx < start + length ; idx++) {
			parts.push(this.parts[idx]);
		}
		return path(parts.join(sep));
	};
	
	/* Does it exist? (sync and async) */
	this.exists = function(cb) {
		if (cb === undefined) return fs.existsSync(this.full());
		fs.exists(this.full(), cb);
	};
	
	/* Stat the file (sync and async) */
	this.stat = function(cb) {
		if (cb === undefined) return fs.statSync(this.full());
		fs.stat(this.full(), function(err, stats) {
			cb(err, stats);
		});
	};
	
	/* Is file newer than other file? (sync and async) */
	this.newer = function(other, cb) {
		if (cb === undefined) return (this.stat().mtime > other.stat().mtime);
		this.stat(function(err, tStat) {
			if (err) return cb(err);
			other.stat(function(err, oStat) {
				if (err) return cb(err);
				cb(null, (tStat.mtime > oStat.mtime));
			});
		});
	};
		
}

module.exports = exports = path;
