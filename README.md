# Oculus.js

Oculus.js is a computer vision application designed for
[FIRST Robotics Competition](http://en.wikipedia.org/wiki/FIRST_Robotics_Competition) games. This program creates a server to pass decimals back to the cRIO
and uses [node-vapix](http://github.com/gluxon/node-vapix) to get images
from the camera. [node-opencv](http://github.com/peterbraden/node-opencv) is
then used to process and analyze the center of targets. It is designed to run
on a linux-based coprocessor, and communicates to the cRIO through a TCP
socket on port `1780` (by default). A Java ME IO client is in the works.

## What is  Vision Processing?

For FRC games, software on the robot must autonomously modify their positioning
to be inline with goals and score. These goals/targets are framed with
retro-reflective material to allow software to pick up these targets.

For more, see the
[Vision Targets White Paper](https://decibel.ni.com/content/docs/DOC-20173)
for a general idea.

## Setup and Configuration

Oculus.js requires at least Node.js 0.10. Please refer to
[http://nodejs.org](http://nodejs.org)
for the Node.js installation. The below terminal commands are to help get
Oculus.js running after setting up Node.js

Note: This has only been tested on a debian system. Other systems will work,
but these instructions are OS specific.

Clone oculus.js from Git

```bash
$ git clone https://github.com/team178/oculus.js
```

Install OpenCV (only on Ubuntu)

```bash
$ sudo apt-get install libcv-dev libopencv-dev libhighgui-dev
```

Install Node.js packages and dependencies

``` bash
$ npm install
```

Start oculus.js with Node.js

``` bash
$ node oculus.js
```

## License

oculus.js is distributed under the [MPL 2.0](http://www.mozilla.org/MPL/2.0/).

## Changelog

#### 0.6
Note: This version is dysfunctional and incomplete. The UDP server has not been
finished yet. A finished 1.0 will be pushed out soon.

Complete refactor with a rewrite of the majority of the core. This rewrite
takes advantage of Node.js 0.10 streams2 for piping data between the image
retrieval, image processing, image analysis, and server components of the code.
It revives the HTTP server to provide live debugging and switches to using UDP
(from TCP) for communicating data between.

- Rewrite of:
  - Image Analysis
  - Image Processing
  - UDP Server (incomplete)
- Use new streams2 based mjpeg-consumer 0.3
- Reintroduction of HTTP server for live debugging
  - Uses mjpeg-server to serve an mjpeg of live processing results

#### 0.5
Oculus.js now uses the Video Stream API released in a new version of node-vapix.
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
