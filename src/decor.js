/*
** DecorJS - v0.4
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
		var a = arguments, r = a[0]===true, o = a[r&&1||0];
		function cp(i,o) { for(var x in i) { var p = i[x], c = p&&p.constructor; o[x] = (r&&c&&(c==Array||c==Object)) ? cp(p,new c) : (r&&c&&(c==Number||c==String)) ? c(p) : p; } return o };
		for(var i=(r?2:1);i<a.length;i++) cp(a[i],o);
		return o;
	};

	$.browser = new function(){
		var ualc = navigator.userAgent.toLowerCase();

		this.webkit = /applewebkit/.test(ualc);
		this.firefox = /firefox/.test(ualc);
		this.safari = /safari/.test(ualc) && !/chrome/.test(ualc);
		this.ie = /msie/.test(ualc) || /trident/.test(ualc);
		this.iOS = /ipad|iphone|ipod/.test(ualc);
		this.android = /android/.test(ualc);
		this.mobile = this.iOS || this.android;
		this.unknown = !this.webkit&&!this.firefox&&!this.ie&&!this.iOS&&!this.android;

		var vstr = this.webkit?ualc.match(/applewebkit\/(\d+)\./)[1]
			: this.firefox?ualc.match(/firefox\/(\d+)\./)[1]
			: this.ie?ualc.match(/(msie\s|rv\:)(\d+)\./)[2]
			: -1;

		this.version = parseFloat(vstr);
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
		remove      : function()     { this.each(function(){this.parentNode.removeChild(this)}); return this },
		replaceWith : function(el)   { var me = this; if(me[0]) { if(el.each) el.each(function(){ me[0].parentNode.insertBefore(this,me[0]); }); else me[0].parentNode.insertBefore(el,me[0]); me.remove(); } return this },
		appendTo    : function(el)   { el=el.length?el[0]:el;this.each(function(){el.appendChild(this)}); return this },
		parent      : function()     { var r = [];this.each(function(){if(r.indexOf(this.parentNode)<0) r.push(this.parentNode)});return new _$(r); },
		children    : function(sel)  { sel = sel || '*';var ce = [];this.each(function(){var e = this.querySelectorAll(sel);for(var i=0;i<e.length;i++) if(e[i].parentNode==this) ce.push(e[i]);}); return new _$(ce) },
		find        : function(sel)  { return new _$(sel,this[0]) },
		filter      : function(s,iv) { s = _getEls(s); return new _$([].filter.call(this,function(n){ for(var i=0;i<s.length;i++) if(s[i]==n) return !iv; return !!iv })) },
		not         : function(sel)  { return this.filter(sel,true) },
		eq          : function(i)    { return new _$(this[i]) },
		has         : function(el)   { for(var i=0;i<this.length;i++) if(this[i]==el) return true },
		add         : function(sel)  { sel = _getEls(sel); var me = this, cu = []; for(var i=0;i<this.length;i++) cu.push(this[i]); var ta = cu.concat([].filter.call(sel,function(n){return cu.indexOf(n)==-1})); return ta.length==this.length?this:new _$(ta) },
		attr        : function(k,v)  { if(v===undefined) return this[0]&&this[0].getAttribute(k); this.each(function(){this[((v===null)?'remove':'set')+'Attribute'](k,v)}); return this },
		trigger     : function(e,v)  { this.each(function(){var evt = !isIE?new CustomEvent(e,{detail:v}):document.createEvent('CustomEvent');if(isIE) evt.initCustomEvent(e, false, false, v);this.dispatchEvent(evt)}); return this },
		on          : function(e,f)  { e=e.split(' '); this.each(function(){for(var x in e) this.addEventListener(e[x],f)}); return this },
		off         : function(e,f)  { e=e.split(' '); this.each(function(){for(var x in e) this.removeEventListener(e[x],f)}); return this },
		click       : function(f)    { if(f instanceof Function) this.on('click',f); else this.trigger('click'); return this },
		text        : function(t)    { if(t===undefined) return this[0]&&this[0].textContent; this.each(function(){this.textContent=t}); return this },
		html        : function(h)    { if(t===undefined) return this[0]&&this[0].innerHTML; this.each(function(){this.innerHTML=h}); return this },
		hasClass    : function(cl,h) { h=0;this.each(function(){h+=this.classList.contains(cl)&&1||0});return !!h },
		addClass    : function(cl)   { cl=cl.split(' ');this.each(function(){for(var i in cl) this.classList.add(cl[i])});return this },
		removeClass : function(cl)   { cl=cl.split(' ');this.each(function(){for(var i in cl) this.classList.remove(cl[i])});return this },
		toggleClass : function(cl)   { cl=cl.split(' ');for(var x in cl) this[(this.hasClass(cl[x])?'remove':'add')+'Class'](cl[x]); return this },
		setcss      : function(v,p)  { this.each(function(){this.style.setProperty(v,p)}); return this },
		getcss      : function(p)    { return this[0]&&this[0].style.getPropertyValue(p); },
		css         : function(a,b)  { if(typeof a == 'string') if(b===undefined) return this.getcss(a); else this.setcss(a,b);else for(var x in a) this.setcss(x,a[x]); return this },
		hide        : function()     { this.setcss('display','none'); return this },
		show        : function()     { this.setcss('display','block'); return this },
		width       : function()     { return this[0]&&this[0].clientWidth },
		height      : function()     { return this[0]&&this[0].clientHeight }
	};

};

//Main
Decor = new function(){
	var me = this;

	isWebkit = $.browser.webkit;
	isFirefox = $.browser.firefox;
	isSafari = $.browser.safari;
	isIE = $.browser.ie;
	isIOS = $.browser.iOS;
	isAndroid = $.browser.android;
	isMobile = $.browser.mobile;

	var bc = document.documentElement.classList;
	if(isWebkit) bc.add('webkit');
	if(isFirefox) bc.add('firefox');
	if(isIE) bc.add('ie');
	if(isIOS) bc.add('ios');
	if(isAndroid) bc.add('android');
	if(isMobile) bc.add('mobile');

	this.compatible = (isWebkit && $.browser.version>=530)
		||(isFirefox && $.browser.version>=21)
		||(isIE && $.browser.version>=10)
		||isMobile;

	c3p = isWebkit||isIOS?'-webkit-':'';
	c3 = {
		transform: c3p+'transform',
		transition: c3p+'transition',
		transitionD: c3p+'transition-duration',
		transitionTF: c3p+'transition-timing-function',
		animation: c3p+'animation'
	};

	c3d = {
		transform: (isWebkit||isIOS?'webkitT':'t')+'ransform',
		transition: (isWebkit||isIOS?'webkitT':'t')+'ransition',
		animation: (isWebkit||isIOS?'webkitA':'a')+'animation'
	};

	$window = $(window);

	var _scenes = {};

	this.Scenes = {};
	this.Things = {};

	this.reloadScene = function(){
		me.resetTo(Decor.currentScene.name)()
	};
	this.reset = function(){
		var primary = null;
		for(var x in Decor.Scenes) { primary=x; break; }
		me.resetTo(primary)();
	};
	this.resetTo = function(name){return function(){
		if(Decor.currentScene) Decor.currentScene.hide(function(){
			localStorage.removeItem('currentScene');
			Decor.currentScene = null;
			for(var x in _scenes) me.delete(x);
			me.goto(name)();
		});
	}};
	this.resetHard = function(){
		localStorage.removeItem('currentScene');
		if(Decor.currentScene) Decor.currentScene.hide(function(){
			location.reload()
		});
		else location.reload();
	};

	this.goto = function(n){return function(e){
		var cs = Decor.currentScene;
		if(cs&&cs.name==n) return;
		if(e&&e.target){e.stopPropagation();e.preventDefault()}
		var data = Decor.Scenes[n];
		if(!data) return console.error('Scene ['+n+'] not found');
		function load(){(_scenes[n]||(_scenes[n]=new Decor.Scene(n,data))).show()};
		if(cs) cs.hide(load);
		else load();
	}};

	this.delete = function(n){
		if(!_scenes[n]) return;
		function del(){ delete _scenes[n]; };
		if(!_scenes[n].deleted) _scenes[n].delete(del);
		else del();
	};

};

Decor.Scene = function(name,data){
	data = $.extend(true,{},data);

	var me = this
		, format = 16/9
		, res = data.res || [innerWidth,innerHeight*format]
		, shown = false
		, inited = false
		, imgNum = 0
		, oImgNum = 0
		, presx = 0
		, rto = null
		;

	data.width=data.width||1;
	data.height=data.height||1;

	this.name = name;
	this.data = data;
	this.width = res[0];
	this.height = res[1];
	this.scale = 1;
	this.objects = [];
	this.collisionObjects = [];
	this.margin = [0,0];
	this.camera = new Decor.Camera(this);
	this.active = false;
	this.deleted = false;

	this.$ = $('<scene>').addClass(name)
		.css({width:res[0]+'px',height:res[1]+'px'})
		.appendTo(document.body);

	if(data.scrolling){
		if(data.width>1)
			$('<div class="canvas">').css('width',data.width*100+'%').appendTo(this.$);
		if(data.height>1)
			$('<div class="canvas vert">').css('height',data.height*100+'%').appendTo(this.$);
	}

	function getAttr(o){
		o=o||{};
		o.dims = o.dims||[1,1];
		o.pos = o.pos||[0,0,0];
		o.rot = o.rot||[0,0,0];
		return o;	
	};

	function init(){
		if(inited) return;
		$(document.body).removeClass('done-loading');
		inited = true;
		me.$[0].scrollLeft = 0;
		resize();
		for(var i=0;i<data.objects.length;i++) {
			var o = data.objects[i];
			o.o=o.o||{};
			if(o.o.noIE&&isIE) continue;
			var type,name;
			for(var x in o){type=x,name=o[x];break;}
			if(data.prototypes&&/^\$/.test(name)) {
				name=name.substr(1);
				o.o=$.extend(o.o,data.prototypes[name]);
				name=name.toLowerCase();
			}
			if(o.o.img) imgNum++;
			var cons = Decor.Things[type];
			if(!cons) console.error('Object type '+type+' not found');
			else {
				var t = new cons(me,name,getAttr(o.o));
				t.name = name;
				me.objects.push(t);
			}
		}
		if(data.oninit) data.oninit(me);
		if(!imgNum) loaded();
		oImgNum = imgNum;
	};

	function loaded(){
		if(data.scrollLeft) me.camera.setPosition([(data.scrollLeft||0)*10,0,0]);
		me.$.addClass('loaded');
		me.show();
	};

	function resize(){
		clearTimeout(rto);
		rto = setTimeout(postResize,20);
		me.$.addClass('resizing');
		if(!presx) presx = me.$[0].scrollLeft/me.$[0].scrollWidth;

		var size = [innerWidth, innerWidth / format];
		if(size[1]>innerHeight) size = [innerHeight * format, innerHeight];

		var css = {
			'margin-left': (me.margin[0]=data.fullWidth?0:Math.round((innerWidth-size[0])/2))+'px',
			'margin-top': (me.margin[1]=Math.round((innerHeight-size[1])/2))+'px'
		};

		if(data.fixedSize && data.res)
			me.$.css(c3.transform,'scale('+(me.scale=size[0]/res[0])+')');
		else {
			me.width = Math.round(size[0]);
			css.width = (data.fullWidth?innerWidth:me.width)+'px';
			css.height = (me.height = Math.round(size[1]))+'px';
		}

		me.$.css(css).trigger('scene-resize');
	};

	function postResize(){
		me.$.removeClass('resizing')
		if(presx) me.$[0].scrollLeft = me.camera.position[2]?0:Math.round(presx*me.$[0].scrollWidth);
		presx = 0;
	};

	this.imageLoaded = function(){
		if(!--imgNum) loaded();
		if(oImgNum) {
			var p = Math.round((oImgNum-imgNum)/oImgNum*5)*20;
			$(document.body).addClass('loaded-'+p);
		}
	};

	this.addLoadImage = function(){
		imgNum++; oImgNum++;
	};

	this.getThing = function(n){
		for(var x in me.objects)
			if(me.objects[x].name==n) return me.objects[x];
	};

	this.show = function(){
		if(shown) return;
		if(!inited) return init();
		else resize();
		if(Decor.currentScene) Decor.delete(Decor.currentScene.name);
		Decor.currentScene = this;
		localStorage.setItem('currentScene',name);
		me.$.addClass('placed');
		shown = true;
		me.active = true;
		addEventListener('resize',resize);
		if(data.audio) Decor.Audio.play(data.audio.src,data.audio);
		me.$.trigger('scene-show',name);
		onbeforeunload = function(){me.delete(null,0)};
		setTimeout(function(){
			me.$.addClass('shown');
			$(document.body)
				.addClass('done-loading scene-shown')
				.removeClass('loaded-'+[0,20,40,60,80,100].join(' loaded-'));
		});
	};

	this.hide = function(cb,dur){
		if(!shown) return cb&&cb();
		shown = false;
		me.active = false;
		me.$.removeClass('shown');
		$(document.body).removeClass('scene-shown');
		$window.add(me.$).trigger('scene-hide',name);
		removeEventListener('resize',resize);
		if(data.audio) Decor.Audio.stop(data.audio.src);
		setTimeout(function(){
			me.$.removeClass('placed');
			if(cb) cb();
		},isNaN(dur)?1000:dur);
	};

	function del(cb){
		for(var x in me.objects)
			if(me.objects[x].destroy)
				me.objects[x].destroy();
		me.$.remove();
		delete me.$;
		me.deleted = true;
		if(cb)cb();
	};

	this.delete = function(cb,dur){
		if(!shown) del(cb);
		else me.hide(function(){del(cb)},dur);
	};

};

Decor.Camera = function(scene){
	var me = this
		, oY = scene.data.height-1
		, pos = [0,0,0]
		, ppos = pos+''
		, aniTo = null
		, r = [0,0,0]
		;

	this.offset = [0,oY,0];
	this.position = [0,0,0];

	function insideView(cb){
		if(!cb instanceof Function) return;
		var sq = {
			l: me.position[0]-1,
			r: me.position[0]+2,
			t: me.position[1]-.5,
			b: me.position[1]+1
		};
		for(var x in scene.objects) {
			var o = scene.objects[x];
			if(!o.matrix) continue;
			if(!o.attr.main) {
				//if(scene.data.renderAll||o.matrix.intersects(sq)) {
					//o.setNotInView(false);
					cb.call(o);
				//}
				//else o.setNotInView(true);
			}
		}
	};

	function resetAnimation(){
		var css = {};
		css[c3.transitionTF] = '';
		css[c3.transitionD] = '';
		insideView(function(){
			this.$cnt.css(css);
		});
	};

	this.panTo = function(coo,duration,fn,reset) {
		if(!(coo instanceof Array)) return;
		clearTimeout(aniTo);
		var css = {};
		css[c3.transitionTF] = fn||'ease-in-out';
		css[c3.transitionD] = (duration||0)/1000+'s';
		insideView(function(){
			this.$cnt.css(css);
		});
		me.setPosition(coo,reset);
		setTimeout(resetAnimation,duration+50);
	};

	this.setPosition = function(c,reset) {
		var cp = c+'';
		if(ppos==cp) return;
		ppos=cp;
		me.position[0] = Math.min(scene.data.width,Math.max(-1,c[0]));
		me.position[1] = Math.min(oY,Math.max(0,c[1]));
		me.position[2] = c[2];
		insideView(function(){
			this.place(reset)
		});
	};

	this.reset = function(){
		me.setPosition([0,0,0],true);
	};
	this.resetZ = function(dur){
		me.panTo([me.position[0],me.position[1],0],dur,null,null,true);
	};

};

Decor.Object3D = function(scene,$el,o) {
	var me = this;

	this.matrix = new Decor.Mat3D(this,o.pos,o.rot,o.scale);
	this.notInView = false;

	this.reset = function(){
		me.matrix.translate(null,true);
		return me;
	};

	this.setPosition = function(coo) {
		o.pos[0]=coo[0];
		o.pos[1]=-coo[1];
		o.pos[2]=coo[2];
		me.reset().place();
	};

	this.translate = function(coo,res) {
		me.matrix.translate(coo);
		me.place();
		return me;
	};

	this.setNotInView = function(b){
		if(me.notInView==b) return;
		if(me.notInView=b) $el.hide();
		else $el.show();
	};

	this.place = function(noscr){
		$el[0].style[c3d.transform] = me.matrix.getCSS(noscr);
	};

	this.focus = function(){
		var evt = 'zoom-out';
		if($el.toggleClass('open').hasClass('open')) {
			evt = 'zoom-in';
			scene.$.find('.open').not($el).removeClass('open');

			var pos = me.matrix.getPosition()
				, w = me.$.width()
				, h = me.$.height()
				;

			if(h>scene.height) pos[2]-=scene.height-h*1.05;
			else if(w>scene.width) pos[2]-=(scene.width-w)/2;

			pos[0]-=(1-(o.width||0))/2;
			pos[2]*=-1;

			scene.camera.panTo(pos,scene.data.focusDuration||0);
		}
		else scene.camera.resetZ(scene.data.focusDuration||0);

		scene.$.trigger(evt,me.name);
	};

	this.place();
	scene.$.on('scene-resize',me.place);

};

Decor.Mat3D = function(thing,xyz,rot,scale) {
	xyz = xyz||[0,0,0];
	rot = rot||[0,0,0];
	scale = scale?scale.length?scale:[scale||1,scale||1,1]:[1,1,1];
	if(scale.length==2) scale.push(1);

	var me = this
		, scene = thing.scene
		, cpos = scene.camera.position
		, rel = [0,0,0]
		, size = [thing.rwidth,thing.rheight]
		;

	this.getQuad = function(c){
		c=c||[0,0,0];
		var p = me.getPosition();
		return {
			l: p[0]+c[0],
			r: p[0]+c[0]+size[0],
			t: -(p[1]-c[1]),
			b: -((p[1]-c[1])-size[1])
		};
	};

	this.intersects = function(cq) {
		var q = me.getQuad();
		return !(cq.l > q.r || 
			cq.r < q.l || 
			cq.t > q.b ||
			cq.b < q.t);
	};

	this.getCSS = function(noscr){
		var co = thing.scene.camera.offset
			, tx = thing.attr.relative?0:cpos[0]
			, ty = thing.attr.relative?0:co[1]-(scene.data.height-1)-cpos[1]
			, fact = [scene.width,scene.height]
			, att = []
			, sd = .3
			;

		if(!noscr) tx-=scene.$[0].scrollLeft/scene.width;

		var coo = [
			Math.round(fact[0]*(xyz[0]+rel[0]+co[0]-tx)),
			-Math.round(fact[1]*(xyz[1]+rel[1]+ty)),
			Math.round(sd*(xyz[2]+rel[2]+cpos[2]))+co[2]
		];

		att.push('translate3d('+coo.join('px,')+'px)');
		if(rot[0]) att.push('rotateX('+rot[0]+'deg)');
		if(rot[1]) att.push('rotateY('+rot[1]+'deg)');
		if(rot[2]) att.push('rotateZ('+rot[2]+'deg)');
		if(scale[0]!=1||scale[1]!=1||scale[2]!=1)
			att.push('scale3d('+scale.join(',')+')');

		return att.join(' ');
	};

	this.getPosition = function(nocenter){
		return [xyz[0]+rel[0],-(xyz[1]+rel[1]),xyz[2]+rel[2]];
	};

	this.getElementPosition = function(){
		var p = me.getPosition();
		var rels = getComputedStyle(thing.$[0])[c3.transform];
		if(/^matrix\(/.test(rels)) {
			var pts = rels.substr(0,rels.length-1).split(',')
			p[0]+=parseFloat(pts[4])/scene.width;
			p[1]+=parseFloat(pts[5])/scene.height;
		}
		return p;
	};

	this.getX = function(){return xyz[0]+rel[0]};
	this.getY = function(){return (xyz[1]+rel[1])};
	this.getZ = function(){return xyz[2]+rel[2]+cpos[2]};

	this.translate = function(coo,reset) {
		if(reset) rel = [0,0,0];
		if(coo) {
			rel[0]+=coo[0];
			rel[1]+=coo[1];
			rel[2]+=coo[2];
		}
		return me;
	};

};

Decor.Frame = new function(){
	var q = []
		, started = false
		, raf = null
		, fi = null
		;

	function start(){
		if(started) return;
		started = true;
		raf = requestAnimationFrame(cycle);
	};

	function stop(){
		if(!started) return;
		started = false;
		cancelAnimationFrame(raf);
	};

	function cycle(t){
		if(!q.length) return stop();
		while(q.length) q.shift()(t);
		raf = requestAnimationFrame(cycle);
	};

	this.request = function(cb){
		if(q.push(cb)==1) start()
	};

	this.cancel = function(cb){
		for(var i=0;i<q.length;i++)
			if(cb==q[i]) q.shift();
		if(!q.length) stop();
	};

};

Decor.Audio = new function(){
	var f = [];
	
	function Fragment(src,o){o=o||{};
		this.audio = new Audio;
		this.audio.volume	= o.volume||1;
		this.audio.src = this.src = src;
		this.play();
	};

	Fragment.prototype = {
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

	function getSrc(src){
		if((isIE || isIOS || isSafari) && /\.ogg$/.test(src))
			src = src.replace(/\.ogg/,'.mp3');
		return src;
	};

	function getIdle(src){
		for(var x in f)
			if(f[x].src==src && !f[x].playing)
				return f[x];
	};

	this.play = function(src,o) {
		src = getSrc(src);
		var fr = getIdle(src);
		if(fr) fr.play.call(fr);
		else f.push(fr=new Fragment(src,o));
		return fr.audio;
	};

	this.stop = function(src) {
		src = getSrc(src);
		for(var x in f) if(f[x].src==src) f[x].stop.call(f[x]);
	};

};

//Primitives
Decor.Things.Thing = function(scene,name,o){
	var me = this;

	this.attr = o;
	this.scene = scene;

	var $cnt = $(o.static?'<thing>':'<dud class="dud">');
	this.$cnt = $cnt;

	if(o.static) this.$ = $cnt;
	else this.$ = $('<thing>').appendTo($cnt);

	this.$[0].thing = $cnt[0].thing = this;

	if(o.static) $cnt.addClass('static');
	this.$.addClass(name+(o.class?' '+o.class:''));

	if(o.clickable) $cnt.addClass('clickable');

	if(o.textContent) this.$.text(o.textContent);

	function setDims(){
		var rat = o.isDepth?scene.height/1080:1;

		me.$.css({
			width: (me.width=o.px&&o.px[0]||Math.round(o.dims[0]*scene.width))+'px',
			height: me.height=o.px&&o.px[1]||Math.round((o.dims[1]/rat)*scene.height)+'px',
		});

		me.rwidth = o.px?o.px[0]/scene.width:o.dims[0];
		me.rheight = o.px?o.px[1]/scene.height:o.dims[1];
	};

	scene.$.on('scene-resize',setDims);

	setDims();

	this.show = function(){$cnt.appendTo(scene.$)};
	this.hide = function(){$cnt.remove()};
	this.destroy = function(){$cnt.remove()};

	Decor.Object3D.call(this,scene,$cnt,o);

	if(!o.noshow) this.show();
};

Decor.Things.Static = function(scene,name,o){ // :: Thing
	o.static = true;
	Decor.Things.Thing.call(this,scene,name,o);
};

Decor.Things.HTMLContain = function(scene,name,o){ // :: Static
	var me = this,
		oHeight = innerHeight
		;

	Decor.Things.Static.call(this,scene,name,o);
	$(o.selector).appendTo(this.$cnt);
	if(o.watch) {
		me.$cnt.addClass('hidden');
		scene.$.on('zoom-in zoom-out',function(e){
			if(e.type=='zoom-in' && e.detail == o.watch)
				me.$cnt.removeClass('hidden');
			else me.$cnt.addClass('hidden');
		});
	}

	function resize(){
		var px = Math.max(8,16/(oHeight/innerHeight));
		me.$cnt.css('font-size',px+'px');
	};

	if(o.relativeFontSize)
		scene.$.on('scene-show scene-resize',resize);

};

Decor.Things.ImageContain = function(scene,name,a) {
	a.width=a.width||1;
	a.dims=[a.width,0];

	var me = this
		, w = a.px?a.px[0]+'px':a.dims[0]*100+'%'
		, $cnt = $('<'+(a.tagName||'dud')+' class="dud">').css('width',w).appendTo(scene.$)
		;

	this.attr = a;
	this.scene = scene;

	var img = null;
	img = new Image;
	img.thing = me;
	img.onload = onload;
	img.onerror = scene.imageLoaded;
	img.src = a.img;

	me.$ = $(img);
	me.$cnt = $cnt;

	$cnt[0].thing = this;

	var $cl = $();
	var clickArea = a.clickable&&a.clickable.length;
	if(isIE&&$.browser.version<11) clickArea = false;
	var area = a.clickable&&a.clickable.length?a.clickable:[[0,0],[1,1]];
	if(a.clickable) {
		$cnt.addClass('clickable');
		if(clickArea) {
			$cnt.addClass('has-area');
			$cl = $('<div class="click">')
				.css({
					left: area[0][0]*100+'%',
					width: (area[1][0]-area[0][0])*100+'%'
				})
				.appendTo($cnt);
		}
	}

	function resArea(){
		var h = img.offsetHeight*$cnt.width()/img.offsetWidth;
		var b = Math.round(h*area[0][1]);
		$cl.css({height:h-b,bottom:b});
	};
	if(clickArea) scene.$.on('scene-resize',resArea);

	function onload(silent){
		a.dims[1] = a.dims[0]*img.height/img.width;
		me.rwidth = a.dims[0];
		me.rheight = a.dims[1];
		if(clickArea) resArea();
		me.$.addClass('image '+name);
		if(a.static) {
			me.$.css('width',w);
			me.$cnt.replaceWith(me.$);
			me.$cnt = $cnt = me.$;
		}
		if(a.class) $cnt.addClass(a.class);
		Decor.Object3D.call(me,scene,$cnt,a);
		if(a.clickable && a.clickToFocus) (clickArea?$cl:me.$).click(me.focus);
		if(!a.static) me.$.appendTo(me.$cnt);
		if(me.onload) me.onload();
		scene.imageLoaded(name);
	};

	this.destroy = function(){$cnt.remove()};

};

Decor.Things.Image = function(scene,name,a){ // :: ImageContain
	a.static = true;
	Decor.Things.ImageContain.call(this,scene,name,a);
};

Decor.Things.ImageLink = function(scene,name,a){ // :: ImageContain
	a.tagName = 'a';
	Decor.Things.ImageContain.call(this,scene,name,a);
	this.$cnt[0].href = a.href;
	this.$cnt[0].target = '_blank';
	if(a.title) this.$cnt[0].title = a.title;
};

Decor.Things.ImageBG = function(scene,name,o){ // :: Static
	Decor.Things.Static.call(this,scene,name,o);
	scene.imageLoaded();
	this.$cnt.css('background-image','url('+o.img+')');
};

Decor.Things.ImageRep = function(scene,name,a){ // [:: Image]
	scene.imageLoaded();
	for(var i=0;i<a.repeat;i++) {
		scene.addLoadImage();
		scene.objects.push(new Decor.Things.Image(scene,name,{
			img: a.img,
			width: a.width,
			pos: [a.pos[0]+i*a.width,a.pos[1],a.pos[2]]
		}));
	}
};

Decor.Things.ThingRep = function(scene,name,a){ // [:: Thing]
	for(var i=0;i<a.repeat;i++) {
		scene.objects.push(new Decor.Things.Thing(scene,name,{
			dims: a.dims,
			px: a.px,
			pos: [a.pos[0]+i*a.trans[0],a.pos[1]+i*a.trans[1],a.pos[2]-i*a.trans[2]]
		}));
	}
};
