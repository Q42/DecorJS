#DecorJS: 3Ding the web

The web is ever changing. In a few years time many websites will likely be 3D interfaces instead of flat HTML pages.
This framework is for experimenting with and building such environments.

####What is DecorJS?

DecorJS is a framework, or rather *engine* to provide easy JSON-object to HTML output.

It works in *scenes*, which are defined as a single JS Object. Each scene has a 3D-space where you can place arbitrary HTML elements based on `[x,y,z]` coordinates. Then you can use a *camera* to navigate through your scene.

####Features
* Minimal footprint, 30KB minified
* Monolithic engine which only does what it needs to do
* Camera and 3D scene based thinking, like in OpenGL/WebGL
* Define your scenes and object using JSON
* Easily extend available primitives for creating your own elements
* You still have total styling and event handling power over your scene objects
* Support for both native browser scrolling and camera-based viewports
* Works well alongside other frameworks
* Works in all modern browsers: Chrome, Firefox, Safari, Opera and IE10+, including mobile versions

####Performance

DecorJS is a very lean little JS file which uses the maximum available browser power for page rendering.
Performance is maximized and it provides minimal CPU overhead and memory footprints.

####Compatibility

DecorJS works seamlessly in Chrome, Firefox, Opera and Safari. Apart from a few minor technicalities
it works on IE10+. It's also platform independent and works on browsers in iOS, Android and MS Surface-devices.

####Getting started
All you need to get started is a little JS and CSS knowledge. Forget about HTML as a necessary component to build complex DOM structures.

####API documentation and examples
You can find a basic API documentation in `doc/API.html`. A few basic examples can be found in `examples/`.

####Todos
Writing more documentation and many other things.

####Known issues
When using scenes with many (hi-res) graphics, some browsers don't render everything. This is predominantly the case in IE and Chrome. There are also some IE-specific issues due to lack of support for cool stuff like CSS `pointer-events`.

####Demos
At the moment there are two DecorJS demos, built during earlier development stages:

* http://www.hallovenray.nl/ - Band website for Dutch band Hallo Venray
* http://juliaenmichiel.appspot.com/ - A small 8-bit like platform game as a wedding gift to friends (in Dutch)

####Website
On it's merry way.

####Acknowledgements
Sjoerd Visscher, Richard Lems, Roan Hageman and Remco Veldkamp for alpha testing, feature requests and bug reports. Also special thanks to Sjoerd for the API documentation and Natasha van Waardenburg for many ideas in early stages of development.

-- Marcel Duin, <marcel@q42.nl>
