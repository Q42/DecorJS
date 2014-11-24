/*
** DecorJS - v0.7
** https://github.com/Q42/DecorJS
**
** (c) 2014 Q42, Marcel Duin <marcel@q42.nl>
**
** MIT Licensed, https://github.com/Q42/DecorJS/blob/master/LICENSE
**
*/

//DecorJS uses some jQuery functionality.
//No jQuery? No problem! Here's a weighed down version.
//This is also available on https://github.com/marcelduin/miniQuery
if(!window.$) {

	$ = function(s){return new _$(s)};

	$.extend = function(){
		var a = arguments, r = a[0]===true, o = a[r&&1||0], concatStrings = a[r&&3||2];
		function cp(i,o) { for(var x in i) { var p = i[x], c = p&&p.constructor; o[x] = (r&&c&&(c==Array||c==Object)) ? cp(p,new c) : (c&&(c==Number||c==String)) ? (concatStrings&&c==String&&o[x]&&o[x].constructor==String)? o[x]+' '+p : c(p) : p; } return o };
		for(var i=(r?2:1);i<a.length;i++) cp(a[i],o);
		return o;
	};

	function _getEls(sel,par){
		if(sel==window) return [window];
		if(sel instanceof Element) return [sel];
		if(sel instanceof Array || sel instanceof _$) return sel;
		if(/^\</.test(sel)) {var fr = document.createElement('div');fr.innerHTML = sel;return fr.childNodes;}
		if(sel) return (par||document).querySelectorAll(sel);
		return [];
	};

	function _$(sel,par){ var _=_getEls(sel,par); for(var x in _) this[x]=_[x]; if(!this.length) this.length = _.length; };
	_$.prototype = {
		each        : function(f)    { for(var i=0;i<this.length;i++) f.call(this[i]); return this },
		remove      : function()     { this.each(function(){if(this.parentNode) this.parentNode.removeChild(this)}); return this },
		clone       : function(noc)  { var r = [];this.each(function(){var cl=this.cloneNode(!noc);cl._originalNode=this;r.push(cl)});return $(r) },
		replaceWith : function(el)   { var me = this; if(me[0]) { if(el.each) el.each(function(){ me[0].parentNode.insertBefore(this,me[0]); }); else me[0].parentNode.insertBefore(el,me[0]); me.remove(); } return this },
		insertBefore: function(el)   { el=el.length?el[0]:el; this.each(function(){el.parentNode.insertBefore(this,el)})},
		appendTo    : function(el)   { el=el.length?el[0]:el; this.each(function(){el.appendChild(this)}); return this },
		append      : function(el)   { if(this[0]) $(el).appendTo(this[0]); return this },
		parent      : function()     { var r = [];this.each(function(){if(r.indexOf(this.parentNode)<0) r.push(this.parentNode)}); return new _$(r) },
		closest     : function(sel)  { var r = [];this.each(function(){var pn = this; while(pn=pn.parentNode) if($(pn).filter(sel)[0]) return r.indexOf(pn)<0&&r.push(pn)}); return new _$(r) },
		children    : function(vsel) { var sel = typeof vsel == 'string' ? vsel : '*';var ce = [];this.each(function(){ var e = this.querySelectorAll(sel);for(var i=0;i<e.length;i++) if(e[i].parentNode==this && (vsel instanceof _$?vsel.has(e[i]):1)) ce.push(e[i]) }); return new _$(ce) },
		siblings    : function(sel)  { var r = [], me = this; this.parent().children().filter(sel).each(function(){ if(!me.has(this)&&r.indexOf(this)<0) r.push(this) }); return new _$(r) },
		find        : function(sel)  { return new _$(sel,this[0]) },
		filter      : function(s,iv) { s = $('<div>').append(this.clone(true)).children(s); return new _$([].filter.call(this,function(n){ for(var i=0;i<s.length;i++) if(s[i]._originalNode==n) return !iv; return !!iv })) },
		not         : function(sel)  { return this.filter(sel,true) },
		eq          : function(i)    { return new _$(this[i]) },
		has         : function(el)   { for(var i=0;i<this.length;i++) if(this[i]._originalNode==el||this[i]==el._originalNode||this[i]==el) return true; return false },
		add         : function(sel)  { sel = _getEls(sel); var me = this, cu = []; for(var i=0;i<this.length;i++) cu.push(this[i]); var ta = cu.concat([].filter.call(sel,function(n){return cu.indexOf(n)==-1})); return ta.length==this.length?this:new _$(ta) },
		attr        : function(k,v)  { if(v===undefined) return this[0]&&this[0].getAttribute(k); this.each(function(){this[((v===null)?'remove':'set')+'Attribute'](k,v)}); return this },
		trigger     : function(e,v)  { this.each(function(){var evt = !$.browser.ie&&window.CustomEvent?new CustomEvent(e,{detail:v}):document.createEvent('CustomEvent');if($.browser.ie||!window.CustomEvent) evt.initCustomEvent(e, false, false, v);this.dispatchEvent(evt)}); return this },
		on          : function(e,f)  { e=e.split(' '); this.each(function(){for(var x in e) this.addEventListener(e[x],f)}); return this },
		off         : function(e,f)  { e=e.split(' '); this.each(function(){for(var x in e) this.removeEventListener(e[x],f)}); return this },
		click       : function(f)    { if(f instanceof Function) this.on('click',f); else this.trigger('click'); return this },
		text        : function(t)    { if(t===undefined) return this[0]&&this[0].textContent; this.each(function(){this.textContent=t}); return this },
		html        : function(h)    { if(h===undefined) return this[0]&&this[0].innerHTML; this.each(function(){this.innerHTML=h}); return this },
		hasClass    : function(cl,h) { h=0;this.each(function(){h+=this.classList.contains(cl)&&1||0});return !!h },
		addClass    : function(cl)   { cl=cl.split(' ');this.each(function(){for(var i in cl) if(cl[i]) this.classList.add(cl[i])});return this },
		removeClass : function(cl)   { cl=cl.split(' ');this.each(function(){for(var i in cl) if(cl[i]) this.classList.remove(cl[i])});return this },
		toggleClass : function(cl)   { cl=cl.split(' ');for(var x in cl) if(cl[x]) this[(this.hasClass(cl[x])?'remove':'add')+'Class'](cl[x]); return this },
		setcss      : function(v,p)  { this.each(function(){this.style.setProperty(v,p)}); return this },
		getcss      : function(p)    { return this[0]&&this[0].style.getPropertyValue(p); },
		css         : function(a,b)  { if(typeof a == 'string') if(b===undefined) return this.getcss(a); else this.setcss(a,b);else for(var x in a) this.setcss(x,a[x]); return this },
		hide        : function()     { this.setcss('display','none'); return this },
		show        : function()     { this.setcss('display','block'); return this },
		width       : function()     { return this[0]&&this[0].clientWidth },
		height      : function()     { return this[0]&&this[0].clientHeight }
	};
}

$.browser = new function(){
	var ualc = navigator.userAgent.toLowerCase();

	this.webkit = /applewebkit/.test(ualc);
	this.firefox = /firefox/.test(ualc);
	this.safari = /safari/.test(ualc) && !/chrome/.test(ualc);
	this.ie = /msie/.test(ualc) || /trident/.test(ualc);
	this.iemobile = /iemobile/.test(ualc);
	this.iOS = /ipad|iphone|ipod/.test(ualc);
	this.android = /android/.test(ualc);
	this.mobile = this.iOS || this.android || this.iemobile;
	this.unknown = !this.webkit&&!this.firefox&&!this.ie&&!this.iOS&&!this.android;

	this.version = parseFloat(this.webkit?ualc.match(/applewebkit\/(\d+)\./)[1]
		: this.firefox?ualc.match(/firefox\/(\d+)\./)[1]
		: this.ie?ualc.match(/(msie\s|rv\:)(\d+)\./)[2]
		: -1);

	this.retina = (window.devicePixelRatio && window.devicePixelRatio >= 2) && this.iOS;

	var bc = document.documentElement.classList;
	if(this.webkit) bc.add('webkit');
	if(this.firefox) bc.add('firefox');
	if(this.ie) bc.add('ie');
	if(this.iOS) bc.add('ios');
	if(this.android) bc.add('android');
	if(this.mobile) bc.add('mobile');

	var prefixed = this.webkit||this.iOS;
	c3p = prefixed?'-webkit-':'';
	c3 = {
		perspective: c3p+'perspective',
		perspectiveOrigin: c3p+'perspective-origin',
		transform: c3p+'transform',
		transition: c3p+'transition',
		transitionD: c3p+'transition-duration',
		transitionTF: c3p+'transition-timing-function',
		animation: c3p+'animation'
	};

	c3d = {
		transform: (prefixed?'webkitT':'t')+'ransform',
		transition: (prefixed?'webkitT':'t')+'ransition',
		animation: (prefixed?'webkitA':'a')+'animation'
	};

};

if(!$.events) $.events = {
	getEvent: function(e) { return e.changedTouches&&e.changedTouches[0]||e.touches&&e.touches[0]||e },
	getPageX: function(e) { return $.events.getEvent(e).pageX },
	getPageY: function(e) { return $.events.getEvent(e).pageY },
	getClientX: function(e) { return $.events.getEvent(e).clientX },
	getClientY: function(e) { return $.events.getEvent(e).clientY }
};

//Main
_Decor = function() {
	this.Scenes = {};
	this.Things = {};
	this._scenes = {};

	this.init();
};

_Decor.prototype = {
	init: function(){
		this.compatible = ($.browser.webkit && $.browser.version>=530)
			||($.browser.firefox && $.browser.version>=21)
			||($.browser.ie && $.browser.version>=10)
			||$.browser.mobile;

		if(!this.compatible) incompatible();

		this.Frame = new _Decor._Frame;
		this.Audio = new _Decor._Audio;
	},

	incompatible: function(){
		document.documentElement.classList.add('no-decor');
	},

	reloadScene: function(){
		this.resetTo(this.currentScene.name)()
	},

	reset: function(){
		var primary = null;
		for(var x in this.Scenes) { primary=x; break; }
		this.resetTo(primary)();
	},

	resetTo: function(name){
		var self = this;
		return function(){
			if(self.currentScene) self.currentScene.hide(function(){
				localStorage.removeItem('currentScene');
				self.currentScene = null;
				for(var x in self._scenes) self.delete(x);
				self.goto(name)();
			});
		}
	},

	resetHard: function(){
		localStorage.removeItem('currentScene');
		if(this.currentScene) this.currentScene.hide(function(){
			location.reload()
		});
		else location.reload();
	},

	goto: function(n,del){
		var self = this;
		return function(e){
			if(!self.compatible) return;
			var cs = self.currentScene;
			if(cs&&cs.name==n) return;
			if(e&&e.target){e.stopPropagation();e.preventDefault()}
			var data = self.Scenes[n];
			if(!data) return console.error('Scene ['+n+'] not found');
			if((data.webkitOnly && !$.browser.webkit) ||
				(data.noIE && $.browser.ie)) return self.incompatible();

			function load(){(self._scenes[n]||(self._scenes[n]=new Decor.Scene(n,data))).show()};

			if(cs) cs[del?'delete':'hide'](load);
			else load();
		}
	},

	delete: function(n){
		if(!this._scenes[n]) return;
		function del(){ delete this._scenes[n]; };
		if(!this._scenes[n].deleted) this._scenes[n].delete(del);
		else del();
	}

};

_Decor._Frame = function(){
	this.started = false;
	this._q = [];
	this._raf = null;
	this._fi = null;
};

_Decor._Frame.prototype = {
	start: function(){
		if(this.started) return;
		this.started = true;

		var self = this;
		this._raf = requestAnimationFrame(this._cycle = function(){
			self.cycle()
		});
	},

	stop: function(){
		if(!this.started) return;
		this.started = false;
		cancelAnimationFrame(this._raf);
	},

	cycle: function(t){
		if(!this._q.length) return this.stop();

		var num = this._q.length;
		while(num--) this._q.shift()(t);

		this._raf = requestAnimationFrame(this._cycle);
	},

	request: function(cb){
		if(this._q.push(cb)==1) this.start()
	},

	cancel: function(cb){
		for(var i=0;i<this._q.length;i++)
			if(cb==this._q[i]) this._q.shift();
		if(!this._q.length) this.stop();
	}
};

_Decor._Audio = function(){
	this._f = [];
};

_Decor._Audio.prototype = {

	getSrc: function(src){
		if(($.browser.ie || $.browser.iOS || $.browser.safari) && /\.ogg$/.test(src))
			src = src.replace(/\.ogg/,'.mp3');
		return src;
	},

	getIdle: function(src){
		for(var x in this._f)
			if(this._f[x].src==src && !this._f[x].playing)
				return this._f[x];
	},

	play: function(src,o) {
		src = this.getSrc(src);
		var fr = this.getIdle(src);
		if(fr) fr.play.call(fr);
		else this._f.push(fr=new Decor._Audio.Fragment(src,o));
		return fr.audio;
	},

	stop: function(src) {
		src = this.getSrc(src);
		for(var x in this._f) if(this._f[x].src==src) this._f[x].stop.call(this._f[x]);
	}

};

_Decor._Audio.Fragment = function(src,o){
	o=o||{};
	this.audio = new Audio;
	this.audio.volume	= o.volume||1;
	this.audio.src = this.src = src;
	this.play();
};

_Decor._Audio.Fragment.prototype = {
	playing: false,
	play: function(){
		if(!this.audio||this.playing) return;
		this.playing = true;
		this.audio.load();
		this.audio.play();
		this.audio.addEventListener('ended',this.stop);
	},
	stop: function(){
		if(!this.playing) return;
		this.playing = false;
		this.audio.pause();
	}
};


Decor = new _Decor;

Decor.Scene = function(name,data){
	this.name = name;
	this.data = data = $.extend(true,{},data);

	// Internals
	this._format = data.aspectRatio||16/9;
	this._res = data.res || [innerWidth,innerHeight*this._format];
	this._imgNum = 0;
	this._oImgNum = 0;
	this._rto = null;
	this._presx = 0;
	this._checkFr = null;

	this.data.width=this.data.width||1;
	this.data.height=this.data.height||1;

	this.inited = false;
	this.width = this._res[0];
	this.height = this._res[1];
	this.scale = 1;
	this.perspective = 0;
	this.objects = [];
	this.shown = false;
	this.collisionObjects = [];
	this.margin = [0,0];
	this.camera = new Decor.Camera(this);
	this.active = false;
	this.deleted = false;

	this.init();
};

Decor.Scene.prototype = {
	init: function(){
		this.$ = $('<scene>').addClass(this.name)
			.css({width:this.width+'px',height:this.height+'px'})
			.appendTo(document.body);

		if(this.data.class) this.$.addClass(this.data.class);
		if(this.data.fullWindow) this.data.fullWidth = this.data.fullHeight = true;
		if(this.data.fullHeight) this.$.addClass('full-height');

		if(this.data.scrolling){
			if(this.data.width>1)
				this.$hCanvas = $('<div class="canvas">').css('width',this.data.width*100+'%').appendTo(this.$);
			if(this.data.height>1)
				this.$vCanvas = $('<div class="canvas vert">').appendTo(this.$);
		}

		var self = this;
		this.addLoadImage = function(){
			this._imgNum++;
		};

		this.imageLoaded = function(){
			if(!--self._imgNum) self.loaded();
			if(self._oImgNum) {
				var p = Math.round((self._oImgNum-self._imgNum)/self._oImgNum*5)*20;
				$(document.body).addClass('loaded-'+p);
			}
		};

	},

	load: function(){
		if(this.inited) return;
		$(document.body).removeClass('done-loading');
		this.inited = true;
		this.$[0].scrollLeft = 0;
		this.resize();
		for(var i=0;i<this.data.objects.length;i++)
			this.addThing(this.data.objects[i], true);

		var self = this;
		requestAnimationFrame(function(){
			if(self.data.oninit) self.data.oninit(self);
			if(!self._imgNum) self.loaded();
			self._oImgNum = self._imgNum;
		});
	},

	loaded: function(){
		if(this.data.scrollLeft) this.camera.setPosition([(this.data.scrollLeft||0)*10,0,0]);
		this.$.addClass('loaded');
		this.show();
	},

	getAttr: function(o){
		o=o||{};
		o.dims = o.dims||[1,1];
		o.pos = o.pos&&o.pos.length&&[o.pos[0]||0,o.pos[1]||0,o.pos[2]||0]||[0,0,0];
		o.rot = o.rot||[0,0,0];
		return o;
	},

	// Show/hide objects that have the .onlyShowInside attr
	updateViewable: function(){
		var m = this.margin
			, scr = [this.$[0].scrollLeft,this.$[0].scrollTop]
			, fullHeight = this.data.fullHeight&&innerHeight||this.height
			, view = [
				this.getCooFromPx(m[0]+scr[0],m[1]+scr[1]),
				this.getCooFromPx(m[0]+scr[0]+this.width,m[1]+scr[1]+fullHeight)
			]
			, q = {l: view[0][0], t: -view[0][1], r: view[1][0], b: -view[1][1]}
			;

		for(var i in this.objects)
			if(this.objects[i].attr.showOnlyInView) {
				var area = this.objects[i].attr.showOnlyInView
					, qo = {l: area[0][0], b: -area[0][1], r: area[1][0], t: -area[1][1] }
					, intersects = this.objects[i].matrix.intersects(qo,q)
					;
				if(this.objects[i].notInView == intersects)
					this.objects[i].setNotInView(!intersects);
			}
	},

	resize: function(){
		clearTimeout(this._rto);

		var self = this;
		this._rto = setTimeout(function(){
			self.postResize();
		},20);
		this.$.addClass('resizing');
		if(!this._presx) this._presx = this.$[0].scrollLeft/this.$[0].scrollWidth;

		var size = [innerWidth, innerWidth / this._format];
		if(size[1]>innerHeight) size = [innerHeight * this._format, innerHeight];

		var css = {};

		if(!this.data.fullWidth) css['margin-left'] = (this.margin[0]=Math.round((innerWidth-size[0])/2))+'px';
		if(!this.data.fullHeight) css['margin-top'] = (this.margin[1]=Math.round((innerHeight-size[1])/2))+'px';

		if(this.data.fixedSize && this.data.res)
			this.$.css(c3.transform,'scale('+(this.scale=size[0]/res[0])+')');
		else {
			css.width = (this.width = Math.round(this.data.fullWidth?innerWidth:size[0]))+'px';
			css.height = (this.height = Math.round(size[1]))+'px';
			var per =	2*Math.round(Math.sqrt(Math.pow(this.width/2,2)+Math.pow(this.height/2,2)));
			css[c3.perspective] = (this.perspective=this.data.fixedPerspective||Math.max(this.data.minPerspective||0,per))+'px';
			if(this.data.perspectiveOrigin) css[c3.perspectiveOrigin] = [
					Math.round(this.data.perspectiveOrigin[0]*this.width),
					Math.round(this.data.perspectiveOrigin[1]*this.height)
				].join('px ')+'px';
		}

		if(this.$vCanvas) this.$vCanvas.css('height',this.height*this.data.height+'px');

		this.$.css(css).trigger('scene-resize');
	},

	postResize: function(){
		this.$.removeClass('resizing')
		if(this._presx) this.$[0].scrollLeft = this.camera.position[2]?0:Math.round(this._presx*this.$[0].scrollWidth);
		this._presx = 0;
	},

	getThing: function(n){
		for(var x in this.objects)
			if(this.objects[x].name==n) return this.objects[x];
	},

	getThings: function(n){
		return this.objects.filter(function(o) { return o.name == n });
	},

	addThing: function(o, noAdd) {
		o.o=o.o||{};
		if((o.o.noIE&&$.browser.ie) ||
			(o.o.noWebkit&&$.browser.webkit)) return null;
		var type,name;
		for(var x in o){type=x,name=o[x];break;}
		if(this.data.prototypes&&/^\$/.test(name)) {
			name=name.substr(1);
			o.o=$.extend(o.o,this.data.prototypes[name],true);
			name=name.toLowerCase();
		}
		if(o.o.name) name = o.o.name;
		if(o.o.img) this._imgNum++;
		var cons = Decor.Things[type];
		if(!cons) return console.error('Object type '+type+' not found');

		var t = new cons(this,name,o.o=this.getAttr(o.o));
		t.name = name;
		t.attr = o.o;

		if(!noAdd) this.data.objects.push(o);

		this.sortThing(t);
		return t;
	},

	sortThing: function(thing, autoPlace) {
		var index = this.objects.indexOf(thing);
		if(index>=0) this.objects.splice(index,1);

		var newidx = this.objects.length;
		for(var i in this.objects)
			if((thing.attr.forceZOrder||thing.attr.pos[2])<(this.objects[i].attr.forceZOrder||this.objects[i].attr.pos[2])) {
				newidx = i;
				break;
			}

		this.objects.splice(newidx,0,thing);

		if(autoPlace && ((index>=0 && newidx != index) || index<0))
			this.placeThing(thing);

		return newidx;
	},

	placeThing: function(thing) {
		if(!thing.$cnt) return console.warn('Trying to place thing without container');

		var self = this;
		requestAnimationFrame(function(){
			var index = self.objects.indexOf(thing);
			if(index<0) return console.warn('Trying to place object not in scene');
			for(var i=index+1;i<self.objects.length;i++)
				if(self.objects[i].$cnt && self.objects[i].$cnt.parent()[0] == self.$[0]) {
					thing.$cnt.insertBefore(self.objects[i].$cnt);
					break;
				}

			if(thing.$cnt.parent()[0] != self.$[0])
				thing.$cnt.appendTo(self.$);

			thing.placed = true;
		});
	},

	removeThing: function(thing) {
		var idx = this.objects.indexOf(thing);
		if(idx>=0) {
			this.objects.splice(idx,1);
			if(thing.remove) thing.remove();
		}
	},

	getCooFromPx: function(x,y) {
		var perc = [(x-this.margin[0])/this.width,(y-this.margin[1])/this.height];
		return [perc[0]+this.camera.position[0],1-perc[1]+this.camera.position[1],this.camera.position[2]];
	},

	updateViewable: function(){
		if(!this.data.checkInsideView) return;
		cancelAnimationFrame(this._checkFr);
		var self = this;
		this._checkFr = requestAnimationFrame(function(){
			self.updateViewable()
		});
	},

	show: function(){
		if(this.shown) return;
		if(!this.inited) return this.load();
		else this.resize();

		if(Decor.currentScene) Decor.currentScene.hide();
		Decor.currentScene = this;
		localStorage.setItem('currentScene',name);

		this.$.show().addClass('placed');
		this.shown = true;
		this.active = true;

		var self = this;
		addEventListener('resize',
			this._resize = function(){
				self.resize();
			}
		);

		if(this.data.checkInsideView) this.$[0].addEventListener('scroll',
			this._updateViewable = function(){
				self.updateViewable()
			}
		);

		onbeforeunload = function(){self.delete()};

		if(this.data.audio) Decor.Audio.play(this.data.audio.src,this.data.audio);

		setTimeout(function(){
			self.$.addClass('shown');
			$(document.body)
				.addClass('done-loading scene-shown')
				.removeClass('loaded-'+[0,20,40,60,80,100].join(' loaded-'));
			self.$.trigger('scene-show',self.name);
			if(self.data.onshow) self.data.onshow(self);
		});
	},

	hide: function(cb,dur){
		if(!this.shown) return cb&&cb();
		this.shown = false;
		this.active = false;

		this.$[0].removeEventListener('scroll',this._updateViewable);
		removeEventListener('resize',this._resize);

		this.$.removeClass('shown').addClass('hiding');
		$(document.body).removeClass('scene-shown');

		if(this.data.audio) Decor.Audio.stop(this.data.audio.src);

		setTimeout(function(self){
			self.$.removeClass('placed hiding').hide();
			$(window).add(self.$).trigger('scene-hide',self.name);
			if(cb) cb();
		},data.hideDuration||0,this);
	},

	delete: function(cb){
		var self = this;
		function del(cb){
			for(var x in self.objects)
				if(self.objects[x].remove)
					self.objects[x].remove();
			self.$.remove();
			delete self.$;
			self.deleted = true;
			if(cb)cb();
		};

		if(!self.shown) del(cb);
		else self.hide(function(){del(cb)});
	}

};

Decor.Camera = function(scene){
	this._oY = scene.data.height-1;
	this._limit = scene.data.limitCamera;
	this._aniTo = null;
	this._ppos = [0,0,0]+'';
	this._startPos = scene.data.cameraPosition;

	var r = [0,0,0];

	this.scene = scene;
	this.offset = [0,this._oY,0];
	this.position = [0,0,0];

	this.init();

};

Decor.Camera.prototype = {
	init: function(){
		if(this._startPos) setTimeout(function(self){
			if(self._startPos.length==2) self._startPos.push(0);
			self.setPosition(self._startPos);
		},0,this);
	},

	panTo: function(coo,duration,fn,reset) {
		if(!(coo instanceof Array)) return;
		clearTimeout(this._aniTo);
		if(duration) {
			var css = {};
			css[c3.transitionTF] = fn||'ease-in-out';
			css[c3.transitionD] = (duration||0)/1000+'s';
			this.insideView(function(){
				this.$cnt.css(css);
			});

			var self = this;
			this._aniTo = setTimeout(function(){
				self.resetAnimation();
			},duration+50);
		}
		else this.resetAnimation();
		this.setPosition(coo,reset);
	},

	setPosition: function(c,reset) {
		var cp = c+'';
		if(this._ppos==cp) return;
		this._ppos=cp;
		this.position[0] = !this._limit?c[0]:Math.min(this.scene.data.width,Math.max(-1,c[0]));
		this.position[1] = !this._limit?c[1]:Math.min(this._oY,Math.max(0,c[1]));
		this.position[2] = c[2];
		this.scene.updateViewable();

		var self = this;
		requestAnimationFrame(function(){
			self.insideView(function(){
				this.place(reset)
			});
		});
	},

	reset: function(dur){
		this.panTo([0,0,0],dur,null,true);
	},

	resetZ: function(dur){
		this.panTo([this.position[0],this.position[1],0],dur,null,true);
	},

	resetAnimation: function(){
		var css = {};
		css[c3.transitionTF] = '';
		css[c3.transitionD] = '';
		this.insideView(function(){
			this.$cnt.css(css);
		});
	},

	insideView: function(cb){
		if(!cb instanceof Function) return;
		var sq = {
			l: this.position[0]-1,
			r: this.position[0]+2,
			t: this.position[1]-.5,
			b: this.position[1]+1
		};
		for(var x in this.scene.objects) {
			var o = this.scene.objects[x];
			if(!o.matrix) continue;
			if(!o.attr.main) {
				//if(scene.data.renderAll||o.matrix.intersects(sq)) {
					//o.setNotInView(false);
					cb.call(o);
				//}
				//else o.setNotInView(true);
			}
		}
	}
};

Decor.Object3D = function(scene,$el,o) {
	this.scene = scene;
	this.$el = $el;
	this._o = o;

	this.matrix = new Decor.Mat3D(this,o.pos,o.rot,o.scale);
	this.notInView = false;

	this._init();
};

Decor.Object3D.prototype = {
	_init: function(){
		this.place();
		this.scene.$.on('scene-resize',this.place);
	},

	reset: function(){
		this.matrix.translate(null,true);
		return this;
	},

	setPosition: function(coo) {
		this._o.pos[0]=coo[0];
		this._o.pos[1]=coo[1];
		if(this._o.pos[2]!=coo[2]) {
			this._o.pos[2]=coo[2];
			this.scene.sortThing(this,this.$cnt&&this.$cnt.parent()[0]==this.scene.$[0]);
		}
		this.reset().place();
	},

	translate: function(coo,res) {
		this.matrix.translate(coo);
		this.place();
		return this;
	},

	setNotInView: function(b){
		if(this.notInView==b) return;
		if(this.notInView=b) this.$el.hide();
		else this.$el.show();
	},

	place: function(noscr){
		if(!this.$el) return;
		this.$el[0].style[c3d.transform] = this.matrix.getCSS(noscr);
	},

	focus: function(offset){
		var evt = 'zoom-out';
		if(this.$el.toggleClass('open').hasClass('open')) {
			evt = 'zoom-in';
			this.scene.$.find('.open').not(this.$el).removeClass('open');

			var pos = this.matrix.getPosition()
				, w = this.$.width()
				, h = this.$.height()
				;

			if(h>this.scene.height) pos[2]-=this.scene.height-h*1.05;
			else if(w>this.scene.width) pos[2]-=(this.scene.width-w)/2;

			pos[0]-=(1-(this._o.width||0))/2;
			pos[1]*=-1;
			pos[2]*=-1;

			if(offset instanceof Array) {
				pos[0]+=offset[0];
				pos[1]+=offset[1];
				if(offset[2]) pos[2]+=offset[2];
			}

			this.scene.currentFocus = this;
			this.scene.camera.panTo(pos,this.scene.data.focusDuration||0);
		}
		else {
			this.scene.currentFocus = null;
			this.scene.camera.reset(this.scene.data.focusDuration||0);
		}

		this.scene.$.trigger(evt,this.name);
	}

};

Decor.Mat3D = function(thing,xyz,rot,scale) {
	this.thing = thing;
	this.scene = thing.scene;

	this._xyz = xyz||[0,0,0];
	this._rot = rot||[0,0,0];
	this._scale = this.getScale(scale);
	this._rel = [0,0,0];
};

Decor.Mat3D.prototype = {

	getScale: function(v){
		v=v?v.length?v:[v||1,v||1,1]:[1,1,1];
		if(v.length==2) v.push(1);
		return v;
	},

	getQuad: function(c){
		c=c||[0,0,0];
		var p = this.getPosition()
			, size = [this.thing.rwidth,this.thing.rheight]
			;
		return {
			l: p[0]+c[0],
			r: p[0]+c[0]+size[0],
			t: -(p[1]-c[1]),
			b: -((p[1]-c[1])-size[1])
		};
	},

	intersects: function(cq,oq) {
		var q = oq&&'l' in oq&&oq||this.getQuad();
		return !(cq.l > q.r || 
			cq.r < q.l || 
			cq.t > q.b ||
			cq.b < q.t);
	},

	translate: function(coo,reset) {
		if(reset) this._rel = [0,0,0];
		if(coo) {
			this._rel[0]+=coo[0];
			this._rel[1]+=coo[1];
			this._rel[2]+=coo[2];
		}
		return me;
	},

	getCSS: function(noscr){
		var co = this.scene.camera.offset
			, cp = this.scene.camera.position
			, tx = this.thing.attr.relative?0:cp[0]
			, ty = this.thing.attr.relative?0:co[1]-(this.scene.data.height-1)-cp[1]
			, container = this.thing.container||this.scene
			, fact = [container.width,container.height]
			, att = []
			, sd = this.scene.data.depthFactor||1
			;

		if(!noscr) tx-=this.scene.$[0].scrollLeft/this.scene.width;

		var coo = [
			Math.round(fact[0]*(this._xyz[0]+this._rel[0]+co[0]-tx)),
			-Math.round(fact[1]*(this._xyz[1]+this._rel[1]+ty)),
			sd*(this._xyz[2]+this._rel[2]+cp[2])+co[2]
		];

		if(this.scene.data.fullHeight)
			coo[1]+=Math.round(Math.min(0,innerWidth/this.scene.data.aspectRatio-innerHeight));

		att.push('translate3d('+coo.join('px,')+'px)');

		if(this._rot[0]) att.push('rotateX('+this._rot[0]+'deg)');
		if(this._rot[1]) att.push('rotateY('+this._rot[1]+'deg)');
		if(this._rot[2]) att.push('rotateZ('+this._rot[2]+'deg)');

		if(this._scale[0]!=1||this._scale[1]!=1||this._scale[2]!=1)
			att.push('scale3d('+this._scale.join(',')+')');

		return att.join(' ');
	},

	getPosition: function(){
		return [this._xyz[0]+this._rel[0],this._xyz[1]+this._rel[1],this._xyz[2]+this._rel[2]];
	},

	getElementPosition: function(){
		var p = this.getPosition();
		var rels = getComputedStyle(this.thing.$[0])[c3.transform];
		if(/^matrix\(/.test(rels)) {
			var pts = rels.substr(0,rels.length-1).split(',')
			p[0]+=parseFloat(pts[4])/this.scene.width;
			p[1]+=parseFloat(pts[5])/this.scene.height;
		}
		return p;
	},

	getX: function(){return this._xyz[0]+this._rel[0]},
	getY: function(){return this._xyz[1]+this._rel[1]},
	getZ: function(){return this._xyz[2]+this._rel[2]},

	get xyz(){ return this.xyz },
	set xyz(v){ this._xyz = v },

	get rot(){ return this.rot },
	set rot(v){ this._rot = v },

	get scale(){ return this.scale },
	set scale(v){ this._scale = this.getScale(v) }

};


//Primitives
Decor.Things.Thing = function(scene,name,attr){
	this.name = name;
	this.attr = attr;
	this.scene = scene;

	this.$cnt = $('<thing class="thing">');

	if(!this.init) console.warn('oei!',this,name,attr);
	else this.init();
};

Decor.Things.Thing.prototype = Object.create(Decor.Object3D.prototype,{
	init: { value: function(){
		if(this.attr.static) this.$ = this.$cnt;
		else this.$ = $('<thing>').appendTo(this.$cnt);

		this.$[0].thing = this.$cnt[0].thing = this;

		if(this.attr.static) this.$cnt.addClass('static');
		this.$.addClass(this.name+(this.attr.class?' '+this.attr.class:''));
		this.$cnt.addClass(this.name+'-cnt');

		if(this.attr.clickable) this.$cnt.addClass('clickable');

		if(this.attr.textContent) this.$.text(this.attr.textContent);

		Decor.Object3D.call(this,this.scene,this.$cnt,this.attr);

		var self = this;
		this.scene.$.on('scene-resize',function(){
			self.setDims();
		});

		this.setDims();

		if(!this.attr.noshow) this.show();
	}},

	setDims: { value : function(dims){
		if(dims&&dims.length) for(var x in dims) o.dims[x] = dims[x];

		var rat = this.attr.isDepth?this.scene.height/1080:1;
		var container = this.attr.relativeSize&&this.container||this.scene;

		this.$.css({
			width: (this.width=this.attr.px&&this.attr.px[0]||Math.round(this.attr.dims[0]*container.width))+'px',
			height: (this.height=this.attr.px&&this.attr.px[1]||Math.round((this.attr.dims[1]/rat)*container.height))+'px'
		});

		this.rwidth = this.attr.px?this.attr.px[0]/this.scene.width:this.attr.dims[0];
		this.rheight = this.attr.px?this.attr.px[1]/this.scene.height:this.attr.dims[1];
	}},

	show: { value : function(){
		if(!this.placed) this.scene.placeThing(this);
		else this.$cnt.show();
	}},

	hide: { value : function(){
		this.$cnt.hide();
	}},

	remove: { value : function(){
		this.$cnt.remove();
		this.placed = false;
	}}

});

Decor.Things.Static = function(scene,name,o){ // :: Thing
	o.static = true;
	Decor.Things.Thing.call(this,scene,name,o);
};
Decor.Things.Static.prototype = Object.create(Decor.Things.Thing.prototype);

Decor.Things.Container = function(scene,name,o){
	Decor.Things.Thing.call(this,scene,name,o);
	this.children = [];
	for(var i=0;i<o.children.length;i++) {
		o.children[i].o.noshow = true;
		o.children[i].o.relativeSize = o.relativeSize;
		var t = scene.addThing(o.children[i]);
		t.container = this;
		this.$.append(t.$cnt);
		this.children.push(t);
	}
};
Decor.Things.Container.prototype = Object.create(Decor.Things.Thing.prototype);

Decor.Things.HTMLContain = function(scene,name,o){ // :: Static
	var me = this;

	Decor.Things.Static.call(this,scene,name,o);

	//Do not match selector inside scenes
	$('body>'+o.selector+',body>*:not(scene) '+o.selector).hide().clone().show().appendTo(this.$cnt);
	if(o.watch) {
		me.$cnt.addClass('hidden');
		scene.$.on('zoom-in zoom-out',function(e){
			if(e.type=='zoom-in' && e.detail == o.watch)
				me.$cnt.removeClass('hidden');
			else me.$cnt.addClass('hidden');
		});
	}

	function resize(){
		me.$cnt.css('font-size',o.relativeFontSize*scene.height+'px');
	};

	if(o.relativeFontSize) {
		scene.$.on('scene-show scene-resize',resize);
		if(scene.shown) resize();
	}

};
Decor.Things.HTMLContain.prototype = Object.create(Decor.Things.Static.prototype);

Decor.Things.ImageContain = function(scene,name,o) {
	if(o.width) o.dims=[o.width,0];

	var me = this
		, w = o.px?o.px[0]+'px':o.dims[0]*100+'%'
		, $cnt = $('<'+(o.tagName||'thing')+' class="thing">').css('width',w)
		;

	this.scene = scene;

	var img = null;
	img = new Image;
	img.thing = me;
	img.onload = onload;
	img.onerror = scene.imageLoaded;
	img.src = o.img;

	me.$ = $(img).addClass('thing');
	me.$cnt = $cnt;

	$cnt[0].thing = this;

	var $cl = $();
	var clickArea = o.clickable&&o.clickable.length;
	if($.browser.ie&&$.browser.version<11) clickArea = false;
	var area = o.clickable&&o.clickable.length?o.clickable:[[0,0],[1,1]];
	if(o.clickable && clickArea) {
		$cnt.addClass('has-area');
		$cl = $('<div class="click-area">')
			.css({
				left: area[0][0]*100+'%',
				width: (area[1][0]-area[0][0])*100+'%'
			})
			.appendTo($cnt);
	}

	function resArea(){
		var h = img.offsetHeight*$cnt.width()/img.offsetWidth;
		var b = Math.round(h*area[0][1]);
		$cl.css({height:h-b,bottom:b});
	};
	if(clickArea) scene.$.on('scene-resize',resArea);

	function onload(silent){
		o.dims[1] = o.dims[0]*img.height/img.width;
		me.rwidth = o.dims[0];
		me.rheight = o.dims[1];
		if(clickArea) resArea();
		me.$.addClass('image '+name);
		if(o.static) {
			me.$.css('width',w);
			me.$cnt.replaceWith(me.$);
			me.$cnt = $cnt = me.$;
		}
		$cnt.addClass(name+'-cnt');
		if(o.clickable) $cnt.addClass('clickable');
		if(o.class) $cnt.addClass(o.class);
		Decor.Object3D.call(me,scene,$cnt,o);
		if(o.clickable && o.clickToFocus) (clickArea?$cl:me.$).click(me.focus);
		if(!o.static) me.$.appendTo(me.$cnt);
		if(me.onload) me.onload();
		scene.imageLoaded(name);
	};

	this.show = function(){
		if(!me.placed) scene.placeThing(me);
		else $cnt.show();
	};
	this.hide = function(){$cnt.hide()};
	this.remove = function(){
		$cnt.remove();
		me.placed = false;
	};

	if(!o.noshow) this.show();

};
Decor.Things.ImageContain.prototype = Object.create(Decor.Object3D.prototype);

Decor.Things.Image = function(scene,name,a){ // :: ImageContain
	a.static = true;
	Decor.Things.ImageContain.call(this,scene,name,a);
};
Decor.Things.Image.prototype = Object.create(Decor.Things.ImageContain.prototype);

Decor.Things.ImageLink = function(scene,name,a){ // :: ImageContain
	a.tagName = 'a';
	Decor.Things.ImageContain.call(this,scene,name,a);
	this.$cnt[0].href = a.href;
	if(a.external) this.$cnt[0].target = '_blank';
	if(a.title) this.$cnt[0].title = a.title;
};
Decor.Things.ImageLink.prototype = Object.create(Decor.Things.ImageContain.prototype);

Decor.Things.ImageBG = function(scene,name,o){ // :: Static
	var me = this;
	o.class = 'imagebg '+(o.class||'');

	Decor.Things.Static.call(this,scene,name,o);

	if(o.width) {
		o.dims[0] = o.width;
		o.dims[1] = 0;
		var img = new Image;
		img.onload = function(){
			o.dims[1] = o.dims[0] * img.height/img.width / (scene.height/scene.width);
			me.setDims();
			scene.imageLoaded();
		};
		img.src = o.img;
	}
	else scene.imageLoaded();

	this.$.css('background-image','url('+o.img+')');
};
Decor.Things.ImageBG.prototype = Object.create(Decor.Things.Static.prototype);

Decor.Things.ImageRep = function(scene,name,a){ // [:: Image]
	scene.imageLoaded();
	for(var i=0;i<a.repeat;i++) scene.addThing({
		Image: name, o: $.extend(a,{
			img: a.img,
			width: a.width,
			pos: [a.pos[0]+i*a.width,a.pos[1],a.pos[2]]
		})
	});
};

Decor.Things.ThingRep = function(scene,name,a){ // [:: Thing]
	for(var i=0;i<a.repeat;i++) scene.addThing({
		Thing: name, o: $.extend(a,{
			dims: a.dims,
			px: a.px,
			pos: [a.pos[0]+i*a.trans[0],a.pos[1]+i*a.trans[1],a.pos[2]-i*a.trans[2]]
		})
	});
};

Decor.Things.Cube = function(scene,name,a) { // [:: Thing]
	var me = this
		, sides = {
			back: 1,
			bottom: 1,
			top: 1,
			right: 1,
			left: 1,
			front: 1
		}
		;

	if(a.sides) for(var x in a.sides) sides[x] = a.sides[x];
	a.dims[2]=a.dims[2]||a.dims[0];
	a.class=(a.class||'')+' cube';

	Decor.Things.Thing.call(this,scene,name,a);
	this.$cnt.add(this.$).addClass('preserve-3d');

	for(var x in sides) if(sides[x])
		$('<div class="side '+x+'">').appendTo(this.$)[0].sideType = x;

	function resize(){
		var depth = Math.sqrt(Math.pow(scene.width/2,2)+Math.pow(scene.height/2,2))*a.dims[2];

		me.$.children('.side:not(.front)').each(function(){
			var $t = $(this);

			if(this.sideType=='back')
				$t.css(c3.transform,'rotateY(180deg) translate3d(0,0,'+depth+'px');
			else $t.css(
				this.sideType=='bottom'||this.sideType=='top'?'height':'width',
				depth+'px'
			);
		});
	};

	scene.$.on('scene-resize',resize);
	setTimeout(resize);
};
Decor.Things.Cube.prototype = Object.create(Decor.Things.Thing.prototype);

Decor.Things.Overlay = function(scene,name,o){
	var me = this
		, $s = $('body>'+o.selector+',body>*:not(scene) '+o.selector).hide().clone().show()
		;

	this.$cnt = $('<div class="overlay '+name+(o.class?' '+o.class:'')+'">');
	this.$ = ($s[0]?$s:$('<div>')).appendTo(this.$cnt);

	function resize(){
		var css = {
			left: scene.$[0].offsetLeft+Math.round(scene.width*o.pos[0])+'px',
			top: scene.$[0].offsetTop+Math.round(scene.height*o.pos[1])+'px'
		};

		if(o.dims[0]>0||o.px&&o.px[0]>0)
			css.width = o.px?o.px[0]:Math.round(scene.width*o.dims[0])+'px';

		if(o.dims[1]>0||o.px&&o.px[1]>0)
			css.height = o.px?o.px[1]:Math.round(scene.height*o.dims[1])+'px';

		me.$cnt.css(css)
	};

	this.show = function(){
		if(me.$cnt[0].parentNode!=document.body)
			me.$cnt.appendTo(document.body);
		else me.$cnt.show();
	};
	this.hide = function(){me.$cnt.hide()};
	this.remove = function(){me.$cnt.remove()};

	scene.$.on('scene-show scene-resize',resize);
	if(scene.shown) resize();

	if(!o.noshow) this.show();

};
