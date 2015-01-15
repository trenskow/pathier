var expect = require('chai').expect;
var path = require('../lib/path.js');
var os = require('os');
var touch = require('touch');

describe('path', function() {
	it ('should make instance of path', function() {
		expect(path('/')).to.be.an.instanceof(path);
	});
	it ('should come back as parsed', function() {
		expect(path('/this/is/a/path').full()).to.be.equal('/this/is/a/path');
	});
	it ('should normalize relative paths', function() {
		expect(path('/this/is/./yet/../another/path').full()).to.be.equal('/this/is/another/path');
	});
	it ('should normalize double dash', function() {
		expect(path('/this//is/yet/another/path').full()).to.be.equal('/this/is/yet/another/path');
	});
	it ('should not normalize first level ..', function() {
		expect(path('..').full()).to.be.equal('..');
	});
	it ('should normalize first level .', function() {
		expect(path('.').full()).to.be.equal('');
	});
	it ('should join two paths', function() {
		expect(path('/this/is').join('/a/path').full()).to.be.equal('/this/is/a/path');
	});
	it ('should combine two absolute paths', function() {
		expect(path('/this/is').relative('/a/path').full()).to.be.equal('/a/path');
	});
	it ('should combine two relative paths', function() {
		expect(path('../this/is/yet').relative('../another/path').full()).to.be.equal('../this/is/another/path');
	});
	it ('should say it is relative', function() {
		expect(path('relative/path').isRelative()).to.be.true;
	});
	it ('should say it is absolute', function() {
		expect(path('/absolute/path').isAbsolute()).to.be.true;
	});
	it ('should assume it is a file', function() {
		expect(path('/this/is/a/file').isFile()).to.be.true;
	});
	it ('should assume it is a directory', function() {
		expect(path('/this/is/a/directory/').isDirectory()).to.be.true;
	});
	it ('base should be empty', function() {
		expect(path('/this/is/a/directory/').name()).to.be.equal('');
	});
	it ('base should not be undefined', function() {
		expect(path('/this/is/a/name').name()).to.be.equal('name');
	});
	it ('should come back with extension', function() {
		expect(path('/this/is/a/name.ext').ext()).to.be.equal('ext');
	});
	it ('should come back with long extension', function() {
		expect(path('/this/is/a/name.long.ext').ext()).to.be.equal('long.ext');
	});
	it ('should come back with base', function() {
		expect(path('/this/is/a/base.ext').base()).to.be.equal('base');
	});
	it ('should come back with base empty', function() {
		expect(path('/this/is/a/directory/').base()).to.be.equal('');
	});
	it ('should come back with extension empty', function() {
		expect(path('/this/is/a/name').ext()).to.be.equal('');
	});
	it ('should come back as true', function() {
		expect(path('/this/is/a/path').isIn('/this/is')).to.be.true;
	});
	it ('should come back as false', function() {
		expect(path('/this/is/a/path').isIn('/this/is/another')).to.be.false;
	});
	it ('should come back with level 2', function() {
		expect(path('/path/').level()).to.equal(2);
	});
	it ('should come back with level 1', function() {
		expect(path('/path').level()).to.equal(1);
	});
	it ('should come back sliced', function() {
		expect(path('/this/is/a/path').slice(2).full()).to.be.equal('is/a/path');
	});
	it ('should come back with the path', function() {
		expect(path('/this/is/a/path/to/file.ext').path().full()).to.be.equal('/this/is/a/path/to');
	});
	it ('should come back with sub path', function() {
		expect(path('/this/is/a/path').sub(1,2).full()).to.be.equal('this/is');
	});
	it ('should come back with sub path (unspecified length)', function() {
		expect(path('/this/is/a/path').sub(1).full()).to.be.equal('this/is/a/path');
	});
	it ('should come back with file existing', function(done) {
		path(__dirname).relative('../package.json').exists(function(exists) {
			expect(exists).to.be.true;
			done();
		});
	});
	it ('should come back with file non-existing', function(done) {
		path(__dirname).relative('package.json').exists(function(exists) {
			expect(exists).to.be.false;
			done();
		});
	});
	it ('should come back with newer and older', function(done) {
		console.log('    [i] Next should take around 1.5 secs.')
		var tmp = path(os.tmpdir());
		var newest = tmp.join('path_newest');
		var oldest = tmp.join('path_oldest');
		touch(oldest.full(), function() {
			setTimeout(function() {
				touch(newest.full(), function() {
					newest.newer(oldest, function(err, newer) {
						expect(err).to.be.null;
						expect(newer).to.be.to.true;
						oldest.older(newest, function(err, older) {
							expect(err).to.be.null;
							expect(older).to.be.false;
						});
						done();
					});
				});
			}, 1500);
		});
	});
});
