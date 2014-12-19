/*! videojs-preroll - v0.2.0 - 2014-12-08
* Copyright (c) 2014 Sano Webdevelopment;
* Copyright (c) 2014 The Onion
* Licensed MIT */
(function(window, videojs) {
  'use strict';

  var defaults = {
    src : '',
    href : '',
    target: '_blank',
    allowSkip: true,
    skipTime: 5,
    repeatAd: false
  }, prerollPlugin;

  /**
   * Initialize the plugin.
   *
   * @param options
   *            (optional) {object} configuration for the plugin
   */
  prerollPlugin = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options), player = this;
    player.preroll = {adDone:false};
    player.on('contentupdate', function() {
      if(!player.preroll.shouldPlayPreroll()){
        player.trigger('adscanceled');
      }else{
        player.trigger('adsready');
      }
    });
    player.on('readyforpreroll', function() {
      // No video? No ad.
      if(!player.preroll.shouldPlayPreroll()){
        player.trigger('adscanceled');
        return;
      }

      // Initialize ad mode
      player.ads.startLinearAdMode();

      // Change player src to ad src
      player.src(settings.src);
      player.one('durationchange', function() {
        player.play();
      });

      //Fallback in case preload = none
      player.one('progress', function() {
        player.play();
      });

      if(settings.href !== ''){
        // link overlay
        var blocker = document.createElement('a');
        blocker.className = 'preroll-blocker';
        blocker.href = settings.href;
        blocker.target = settings.target || '_blank';
        blocker.onclick = function() {
          player.trigger('adclick');
        };
        player.preroll.blocker = blocker;
        player.el().insertBefore(blocker, player.controlBar.el());
      }

      if (settings.allowSkip !== false){
        var skipButton = document.createElement('div');
        skipButton.className = 'preroll-skip-button';
        player.preroll.skipButton = skipButton;
        player.el().appendChild(skipButton);

        skipButton.onclick = function(e) {
          var Event = Event || window.Event;
          if((' ' + player.preroll.skipButton.className + ' ').indexOf(' enabled ') >= 0) {
            player.preroll.exitPreroll();
          }
          if(Event.prototype.stopPropagation !== undefined) {
            e.stopPropagation();
          } else {
            return false;
          }
        };
        player.on('timeupdate', player.preroll.timeupdate);
      }
      player.one('ended', player.preroll.exitPreroll);
      player.one('error', player.preroll.prerollError);
    });
    player.preroll.shouldPlayPreroll = function(){
      if (settings.src === ''){
        return false;
      }
      if (player.preroll.adDone === true){
        return false;
      }
      return true;
    };
    player.preroll.exitPreroll = function() {
      if(typeof player.preroll.skipButton !== 'undefined'){
        player.preroll.skipButton.parentNode.removeChild(player.preroll.skipButton);
      }
      if(typeof player.preroll.blocker !== 'undefined'){
        player.preroll.blocker.parentNode.removeChild(player.preroll.blocker);
      }
      player.off('timeupdate', player.preroll.timeupdate);
      player.off('ended', player.preroll.exitPreroll);
      player.off('error', player.preroll.prerollError);
      if (settings.repeatAd !== true){
        player.preroll.adDone=true;
      }
      player.ads.endLinearAdMode();
    };
    player.preroll.timeupdate = function(e) {
      player.loadingSpinner.el().style.display = 'none';
      var timeLeft = Math.ceil(settings.skipTime - player.currentTime());
      if(timeLeft > 0) {
        player.preroll.skipButton.innerHTML = 'Skip in ' + timeLeft + '...';
      } else {
        if((' ' + player.preroll.skipButton.className + ' ').indexOf(' enabled ') === -1){
          player.preroll.skipButton.className += ' enabled';
          player.preroll.skipButton.innerHTML = 'Skip';
        }
      }
    };
    player.preroll.prerollError = function(e){
      player.preroll.exitPreroll();
    };
    if (player.currentSrc()) {
      if(player.preroll.shouldPlayPreroll()){
        player.trigger('adsready');
      }else{
        player.trigger('adscanceled');
      }
    }
  };

  // register the plugin
  videojs.plugin('preroll', prerollPlugin);
})(window, window.videojs);
