var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var LocalStorage = require('./local-puzon.js');

var Puzon = function(opts) {
    this.initialize.call(this, opts);
}

_.extend(Puzon.prototype, Backbone.Events, {
  initialize: function(options){
    this.element = $(options.element);
    this.idleTime = options.idleTime;
    this.lessonName = options.lessonName;
    this.clock = 0;
    options.getCallback(_.bind(this.continueCallBack, this));

    this.bindAll();
    this.start();
  },
  tick: function() {
    this.clock++;
    this.lessonTimer++;
    console.log(this.clock, this.lessonTimer);
    this.reportTiming();
    if(this.clock > this.idleTime) {
      console.log('Idle time reached, pausing lesson');
      this.trigger('lesson_paused')
      this.pause();
    }
  },
  reset: function() {
    console.log('resetting');
    this.clock = 0;
  },
  pause: function() {
    console.log('pausing');
    window.clearInterval(this.timer);
    this.timer = null;
    this.clock = 0;
  },
  start: function(offset) {
    console.log('starting');
    this.lessonTimer = LocalStorage.get('lessonTimer') || 0;
    if(!this.timer) {
      this.timer = setInterval(_.bind(function() {
        this.tick();
      }, this), 1000);
    }
  },
  continueCallBack: function() {
    this.pause();
    this.start();
  },
  handleWindowFocus: function(evt) {
    if(document.visibilityState === 'hidden') {
      this.pause();
    } else {
      this.start();
    }
  },
  reportTiming: function() {
    LocalStorage.set("lessonTimer", this.lessonTimer);
  },
  bindAll: function(){
    this.element.get(0).addEventListener("click", _.bind(this.reset, this), true);
    this.element.get(0).addEventListener("scroll", _.bind(this.reset, this), true);
    this.element.get(0).addEventListener("mousemove", _.bind(this.reset, this), true);
    this.element.get(0).addEventListener("keypress", _.bind(this.reset, this), true);
    this.setUpVisibilityHandlers();
  },
  setUpVisibilityHandlers: function() {
    $(window).get(0).addEventListener("visibilitychange", _.bind(this.handleWindowFocus, this), true);
  }
})
module.exports = Puzon;