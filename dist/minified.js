function bind(a,b){return function(){return b.apply(a,arguments)}}function generateRandomAlphaNum(a){for(var b="",c=0;c<a;++c)b+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"[Math.floor(62*Math.random())];return b};window.oncontextmenu=function(){return!1};
$(document).ready(function(){var a=new CursorAnimator(document.getElementById("cursor-canvas"));a.initialize();var b=1,c=0,d=setInterval(function(){9<=c&&clearInterval(d);$("#name").text("Alvin Lin".substr(0,c)+generateRandomAlphaNum(9-c));++b;10<b&&0==b%4&&c++},50);setTimeout(function(){a.setEventHandlers()},2500);$(".portfolio-link").click(function(){$(".portfolio-overlay").animate({top:"0"},1E3)});$(".portfolio-overlay > .close").click(function(){$(".portfolio-overlay").animate({top:"-100%"},1E3)});
$(".skills-link").click(function(){$(".skills-overlay").animate({top:"0"},1E3)});$(".skills-overlay > .close").click(function(){$(".skills-overlay").animate({top:"-100%"},1E3)})});function CursorAnimator(a){this.canvas_=a;this.cursorImage_=this.context_=null;this.cursorCurrent_=[0,0];this.cursorTarget_=[0,0];this.cursorRotationAngle_=0;this.isAnimating_=!1}CursorAnimator.RESPONSIVENESS=.1;CursorAnimator.UPDATE_DELAY=10;CursorAnimator.ROTATION_RATE=.025;CursorAnimator.IMAGE_SRC="data/img/cursor.png";CursorAnimator.LINE_COLOR="#00E4FF";
CursorAnimator.prototype.initialize=function(){this.canvas_.style.position="fixed";this.updateCanvasSize();this.cursorCurrent_=[this.canvas_.width/2,-10];this.cursorTarget_=[this.canvas_.width/2,this.canvas_.height/2];this.context_=this.canvas_.getContext("2d");this.cursorImage_=new Image;this.cursorImage_.src=CursorAnimator.IMAGE_SRC};
CursorAnimator.prototype.setEventHandlers=function(){window.addEventListener("mousemove",bind(this,this.onMouseMove));setInterval(bind(this,this.updateAnimation),CursorAnimator.UPDATE_DELAY);this.isAnimating_=!0};CursorAnimator.prototype.startAnimation=function(){this.isAnimating_=!0};CursorAnimator.prototype.suspendAnimation=function(){this.isAnimating_=!1};
CursorAnimator.prototype.updateCanvasSize=function(){this.canvas_.width=document.body.offsetWidth;this.canvas_.height=document.body.offsetHeight;this.canvas_.style.width=document.body.offsetWidth+"px";this.canvas_.style.height=document.body.offsetHeight+"px"};CursorAnimator.prototype.onMouseMove=function(a){this.cursorTarget_=[a.clientX,a.clientY]};
CursorAnimator.prototype.updateAnimation=function(){this.cursorCurrent_[0]+=(this.cursorTarget_[0]-this.cursorCurrent_[0])*CursorAnimator.RESPONSIVENESS;this.cursorCurrent_[1]+=(this.cursorTarget_[1]-this.cursorCurrent_[1])*CursorAnimator.RESPONSIVENESS;if(this.isAnimating_){this.updateCanvasSize();this.context_.clearRect(0,0,this.canvas_.width,this.canvas_.height);var a=this.cursorCurrent_[0],b=this.cursorCurrent_[1];this.drawCursorLine(0,0,a,b);this.drawCursorLine(this.canvas_.width,0,a,b);this.drawCursorLine(0,
this.canvas_.height,a,b);this.drawCursorLine(this.canvas_.width,this.canvas_.height,a,b);this.context_.save();this.context_.translate(this.cursorCurrent_[0],this.cursorCurrent_[1]);this.context_.rotate(this.cursorRotationAngle_);this.context_.drawImage(this.cursorImage_,-this.cursorImage_.width/2,-this.cursorImage_.height/2);this.context_.restore();this.cursorRotationAngle_+=.025}};
CursorAnimator.prototype.drawCursorLine=function(a,b,c,d){var e=this.context_.createLinearGradient(a,b,c,d);e.addColorStop(0,"#000000");e.addColorStop(.4,CursorAnimator.LINE_COLOR);e.addColorStop(.8,"#000000");this.context_.strokeStyle=e;this.context_.beginPath();this.context_.moveTo(a,b);this.context_.lineTo(c,d);this.context_.stroke()};
