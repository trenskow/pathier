# pathier

A Javascript path tool.

## Usage

### How to create

    var path = require('pathier');
    
    var mypath = path('/this/is/my/path');
    
### How to use

    mypath.full()              // Returns the path as a String.
    
    mypath.isAbsolute()        // Returns true if path is absolute.
                               // path('/absolute/path').isAbsolute() == true
    
    mypath.isRelative()        // Returns true if path is relative
                               // Opposite of isAbsolute().
    
    mypath.isFile()            // Returns true if path has no trailing '/'.
                               // path('/this/is/a/file').isFile() == true
                               // path('/this/is/a/directory/').isFile() == false
    
    mypath.isDirectory()       // Returns true if path has trailing '/'.
                               // Opposite of isFile().
    
    mypath.isIn(p)             // Returns true of mypath is within p.
                               // path('/this/is/a/path').isIn('/this/is') == true
    
    mypath.join(p)             // Returns a path with p appended to mypath.
                               // path('/this/is/').join('/a/path').full() == '/this/is/a/path'
    
    mypath.relative(p)         // Returns a path with p relative to might.
                               // path('/this/is/').relative('a/path').full() == '/this/is/a/path'
                               // path('/this/is/').relative('/a/path).full() == '/a/path'
    
    mypath.path()              // Returns a new path with the path of mypath.
                               // path('/this/is/a/file.ext').path().full() == '/this/is/a/'
    
    mypath.name()              // Returns the filename base name without extension.
                               // path('/this/is/a/file.ext').base() == 'file'
    
    mypath.ext()               // Returns the filename extension.
                               // path('/this/is/a/file.ext').ext() == 'ext'
    
    mypath.level()             // Returns the depth of the path.
                               // path('/this/is/a/path/').level() == 4
                               // path('/this/is/a/path').level() == 3
    
    mypath.sub(start, [level]) // Return a subpath.
                               // Level is optional. If level is omitted the full path from start is returned.
                               // path('/this/is/a/path').sub(1,2).full() == '/is/a/'
                               // path('/this/is/a/path/').sub(1).full() == '/is/a/path/'
    
    mypath.exists()            // Returns true if file exists.
    
    mypath.stat()              // Returns the stat of path.
                               // Equivalent of fs.statSync.
    
    mypath.newer(p)            // Returns true if p is newer than mypath.
    
> Both `exists`, `stat` and `newer` works asynchronously if a callback is supplied.

### Enjoy!

## License

In the original BSD license, both occurrences of the phrase "COPYRIGHT HOLDERS AND CONTRIBUTORS" in the disclaimer read "REGENTS AND CONTRIBUTORS".

Here is the license template:

Copyright (c) 2015, Kristian Trenskow
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.