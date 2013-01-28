enforce.js
==========

WARNING
-------
This new version does not compile. It uses a custom modified version of node-opencv. Please wait until this modification is pushed to the official npm package.

What is this?
-------------
enforce.js is a server to process calculations for images taken on the field. It is
designed to run on a linux system co-processor, and communicates through a TCP
socket on port 178.

What is Image Analysis
----------------------
The Image Analysis portion of the 2013 game, Ultimate Ascent is software designed to
calculate the distance and location of shooting targets on the field, given a camera
image of retro reflective material bounding the targets.

For more, see the [Vision Targets White Paper](https://decibel.ni.com/content/docs/DOC-20173)
for a general idea.

Setup and Configuration
-----------------------
wolf.js requires at least Node.js 0.8. Please refer to [http://nodejs.org](http://nodejs.org)
for the Node.js installation. After standard git checkout/clone, run the following command to
automatically download and install all required dependencies.

```
npm install
```

Then start enforce.js with Node.js

```
node enforce.js
```

License
-------
This is licensed [GPLv3](http://www.gnu.org/licenses/gpl.html).

> enforce.js is a server to process calculations for images taken on the field
> Copyright (C) 2012 Brandon Cheng (gluxon)

> This program is free software: you can redistribute it and/or modify
> it under the terms of the GNU General Public License as published by
> the Free Software Foundation, either version 3 of the License, or
> (at your option) any later version.

> This program is distributed in the hope that it will be useful,
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
> GNU General Public License for more details.

> You should have received a copy of the GNU General Public License
> along with this program.  If not, see <http://www.gnu.org/licenses/>.

Status
------------
Version 0.3 is a almost complete concept of what has been done. You can
start the server and navigate to a file on the corresponding filesystem
(from the repo dir) and it will appear in processed form in yoru web
browser.

> http://localhost:1780/images/1.jpg

Red: Outline of particle  
Green: Rectangle of the particle's boundaries  
Blue: Center of particle  
