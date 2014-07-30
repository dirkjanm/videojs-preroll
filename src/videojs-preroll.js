/*! videojs-preroll - v0.1.0 - 2014-07-16
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
    player.on('contentupdate', function() {
      player.trigger('adsready');
    });
    player.preroll = {adDone:false};
    player.on('readyforpreroll', function() {
      // No video? No ad.
      if (settings.src === ''){
        return;
      }
      if (player.preroll.adDone === true){
        return;
      }

      // Initialize ad mode
      player.ads.startLinearAdMode();
      // Change player src to ad src
      player.src(settings.src);
      player.one('durationchange', function() {
        player.play();
      });

      // link overlay
      var blocker = document.createElement('a');
      blocker.className = 'preroll-blocker';
      blocker.href = settings.href || '#';
      blocker.target = settings.target || '_blank';
      blocker.onclick = function() {
        player.trigger('adclick');
      };
      player.preroll.blocker = blocker;
      player.el().insertBefore(blocker, player.controlBar.el());
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
      }
      player.one('ended', player.preroll.exitPreroll);
      player.on('timeupdate', player.preroll.timeupdate);
    });
    player.preroll.exitPreroll = function() {
      player.preroll.skipButton.parentNode.removeChild(player.preroll.skipButton);
      player.preroll.blocker.parentNode.removeChild(player.preroll.blocker);
      player.off('timeupdate', player.preroll.timeupdate);
      player.off('ended', player.preroll.exitPreroll);
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
  };

  // register the plugin
  videojs.plugin('preroll', prerollPlugin);
})(window, window.videojs);
