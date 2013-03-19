# oculus.js

oculus.js is a vision processing application designed to calculate the
positions of vision targets on the [FRC 2013 Ultimate Ascent](http://www.usfirst.org/roboticsprograms/frc/2013-game)
playing field. This program creates a server to pass decimals back to the cRIO
and uses [node-vapix](http://github.com/gluxon/node-vapix) for getting images
from the camera. [node-opencv](http://github.com/peterbraden/node-opencv) is
then used to process and detect the centers of targets. It is designed to run
on a linux system coprocessor, and communicates to the cRIO through a TCP
socket on port 1780. A Java ME IO client is in the works, and Team 178 would
like to distribute this as a vision solution for all teams.

## What is  Vision Processing?

For the 2013 FRC game, software on the robot has the task of automatically
positioning their wheels in-line with the frisbee/disk targets for shooting.
The targets are framed with retro-reflective material to allow software to
pick up these targets.

For more, see the [Vision Targets White Paper](https://decibel.ni.com/content/docs/DOC-20173)
for a general idea.

## Setup and Configuration

oculus.js requires at least Node.js 0.8. Please refer to [http://nodejs.org](http://nodejs.org)
for the Node.js installation. Refer to the below terminal commands to get
oculus.js running after setting up Node.js

Note: This has only been tested on a debian system. Other systems will work,
but operating specific instructions are not available.

Clone oculus.js from Git
```
git clone https://github.com/team178/oculus.js
```

Install OpenCV (only on Ubuntu)
```
sudo apt-get install libcv-dev libopencv-dev libhighgui-dev
```

Install Node.js packages and dependencies
```
npm install
```

Start oculus.js with Node.js
```
node oculus.js
```

## License

oculus.js is distributed under the [MPL 2.0](http://www.mozilla.org/MPL/2.0/).
If this does not work for you, please get in contact with us.

## Changelog

#### 0.5
oculus.js now uses the Video Stream API released in a new version of node-vapix.
Results are now parsed 30 times a second compared to a previous 7!

On a sad note, the HTTP debug server has been removed as it is unneeded for now
and increases maintenance. It may be restored in a later version.

- Video Streaming API used for greater speed
- HTTP debug server removed

#### 0.4
This version moves all yaml configuration files into one settings.yaml. A new
debug mode has been added to that will enable the HTTP server. The HTTP response
also now gives back centers of targets. A full list of changes can be seen below.

- server.yaml and detection.yaml moved to settings.yaml
- Debug switch added to toggle HTTP server
- Basic removal of duplicate targets created from canny dilation
- Distinguishing of top/mid/low targets based on rectangle size scoring

#### 0.3

Version 0.3 is a almost complete concept of what has been done. You can
start the server and navigate to a file on the corresponding filesystem
(from the repo dir) and it will appear in processed form in yoru web
browser.

> http://localhost:1780/images/1.jpg

Red: Outline of particle  
Green: Rectangle of the particle's boundaries  
Blue: Center of particle  
