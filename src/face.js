/*
 * Face Detection Framework
 * http://www.christiangomez.me/projects/4
 *
 * Copyright (c) 2015
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 *
 * Author: Christian Gomez
 * Version: 1.0.0.1
 * Date: 24th April 2015
 */

var FaceDetect = function(el)
{
	//define globals + defaults
	var container = el;
	var _width = container.offsetWidth;
	var _height = container.offsetHeight;
	var _FPS = 24;
	var _dInterval = null;
	var frames = 0;
	var c = document.createElement('canvas');
	var v = document.createElement('video');
	c.className = "fd detectCanvas";
	v.className = "fd detectVideo";
	v.style.display = "none";
	//set height + width from parent
	c.width = _width;
	c.height =  _height;
	container.appendChild(c);
	container.appendChild(v);
	//context
	var ctx = c.getContext('2d');

	//request user media
	function requestCamera()
	{
		var opts = {
			audio: true,
			video: true
		}
		navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
        if(navigator.getUserMedia)
        {
        	navigator.getUserMedia(opts, handleStream, 
        		function(err){
        			error(err.name);
        		});
        }
        else
        {
        	error("getUserMedia not supported.");
        }
	}
	//handle getUserMedia stream
	function handleStream(s)
	{
		v.src = window.URL.createObjectURL(s);
		v.onloadedmetadata = function(e) {
			v.play();
		}
		_dInterval = setInterval(draw, _FPS);
	}

	//draw stream on canvas
	function draw()
	{ 
		var w = _width;
		var h = _height;
		ctx.drawImage(v,0,0,w,h);
		
		var pdata = ctx.getImageData(0,0,w,h);
		var p = pdata.data;
		//turn into grayscale
		//0 = r, 1 = g, 2 = b, 3 = a
		for(var i = 0; i < p.length; i+=4)
		{
			var r = p[i];
			var g = p[i+1];
			var b = p[i+2];
			//lumninace
			var gray = (r*.3)+(g*.59)+(b*.11);
			p[i] = p[i+1] = p[i+2] = gray;
		}
		pdata.data = p;
		ctx.putImageData(pdata,0,0);
		if(frames % 50 == 0)
		{
			detect(p);
		}
		frames++;
	}

	//detect 
	function detect(data)
	{
		//todo:
		//calculate integral image
		//use web workers?
		
	}

	//handle errors
	function error(reason)
	{
		if(reason){
			console.log("Error: " + reason)
		}
	}

	//calculate integral image
	function calcII(data)
	{

	}

	//initialize
	function init()
	{
		requestCamera();
	}

	init();
	return this;
}
