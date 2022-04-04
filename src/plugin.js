import videojs from 'video.js';
import {version as VERSION} from '../package.json';
import window from 'global/window';

// Default options for the plugin.
const defaults = {
  src: '',
  href: '',
  target: '_blank',
  allowSkip: true,
  skipTime: 5,
  repeatAd: false,
  adSign: false,
  showRemaining: false,
  adsOptions: {},
  lang: {
    'skip': 'Skip Ad &#8811;',
    'skip in': 'Skip in ',
    'advertisement': 'Advertisement',
    'video start in': 'Video will start in: '
  }
};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function startPrerollAd
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const startPrerollAd = (player, options) => {
  player.addClass('vjs-preroll');
  player.preroll = {adDone: false, options};
  player.ads(player.preroll.options.adsOptions);
  player.on('contentupdate', function() {
    if (!player.preroll.shouldPlayPreroll()) {
      player.trigger('adscanceled');
    } else {
      player.trigger('adsready');
    }
  });
  player.on('readyforpreroll', function() {
    // No video? No ad.
    if (!player.preroll.shouldPlayPreroll()) {
      player.trigger('adscanceled');
      return;
    }

    // Initialize ad mode
    player.ads.startLinearAdMode();

    // Hide big play button when running ad
    player.bigPlayButton.hide();

    // Hide playback rate menu button
    player.controlBar.playbackRateMenuButton.hide();

    // Disable pointer events on progress control bar.
    const versionParts = videojs.VERSION.split('.');
    const major = parseInt(versionParts[0], 10);

    if (major <= 5) {
      window.document.querySelector('.vjs-progress-control').style.pointerEvents = 'none';
    } else if (major >= 6) {
      player.controlBar.progressControl.disable();
    }

    player.contentSrc = player.preroll.options.src;

    // Change player src to ad src
    player.src(player.preroll.options.src);

    player.one('durationchange', function() {
      player.play();
    });

    // Fallback in case preload = none
    player.one('progress', function() {
      player.play();
    });
    player.one('adloadstart', function() {
      player.play();
    });

    if (player.preroll.options.href !== '') {
      // link overlay
      const blocker = window.document.createElement('a');

      blocker.className = 'preroll-blocker';
      blocker.href = player.preroll.options.href;
      blocker.target = player.preroll.options.target || '_blank';
      blocker.onclick = function() {
        player.trigger('adclick');
      };
      player.preroll.blocker = blocker;
      player.el().insertBefore(blocker, player.controlBar.el());
    }

    if (player.preroll.options.adSign !== false) {
      const adBox = window.document.createElement('div');

      adBox.className = 'advertisement-box';
      player.preroll.adBox = adBox;
      player.el().appendChild(adBox);
      player.preroll.adBox.innerHTML = player.preroll.options.lang.advertisement;
    }

    if (player.preroll.options.showRemaining !== false && player.preroll.options.allowSkip === false) {
      const remainingTime = window.document.createElement('div');

      remainingTime.className = 'remaining-time';
      player.preroll.remainingTime = remainingTime;
      player.el().appendChild(remainingTime);
      player.preroll.remainingTime.innerHTML = player.preroll.options.lang['video start in'];
      player.on('adtimeupdate', player.preroll.timeremaining);
    }

    if (player.preroll.options.allowSkip !== false) {
      const skipButton = window.document.createElement('div');

      skipButton.className = 'preroll-skip-button';
      player.preroll.skipButton = skipButton;
      player.el().appendChild(skipButton);

      skipButton.onclick = function(e) {
        const Event = window.Event;

        if ((' ' + player.preroll.skipButton.className + ' ').indexOf(' enabled ') >= 0) {
          player.preroll.exitPreroll();
        }
        if (Event.prototype.stopPropagation !== undefined) {
          e.stopPropagation();
        } else {
          return false;
        }
      };
      player.on('adtimeupdate', player.preroll.timeupdate);
    }
    player.one('adended', player.preroll.exitPreroll);
    player.one('error', player.preroll.prerollError);
  });
  player.preroll.shouldPlayPreroll = function() {
    if (player.preroll.options.src === '') {
      return false;
    }
    if (player.preroll.adDone === true) {
      return false;
    }
    return true;
  };
  player.preroll.exitPreroll = function() {
    if (typeof player.preroll.skipButton !== 'undefined') {
      player.preroll.skipButton.parentNode.removeChild(player.preroll.skipButton);
    }
    if (typeof player.preroll.adBox !== 'undefined') {
      player.preroll.adBox.parentNode.removeChild(player.preroll.adBox);
    }
    if (typeof player.preroll.remainingTime !== 'undefined') {
      player.preroll.remainingTime.parentNode.removeChild(player.preroll.remainingTime);
    }
    if (typeof player.preroll.blocker !== 'undefined') {
      player.preroll.blocker.parentNode.removeChild(player.preroll.blocker);
    }
    // player.off('timeupdate', player.preroll.timeupdate);
    player.off('adended', player.preroll.exitPreroll);
    player.off('error', player.preroll.prerollError);
    if (player.preroll.options.repeatAd !== true) {
      player.preroll.adDone = true;
    }

    // Show Spinner to provide feedback of video loading status to user
    player.loadingSpinner.show();

    // Hide Poster Image to provide feedback of video loading status to user
    player.posterImage.hide();

    // Show big Play Button after ad ends
    player.bigPlayButton.show();

    // Show playbackRateMenuButton
    player.controlBar.playbackRateMenuButton.show();

    // Enable progressControl for interaction
    player.controlBar.progressControl.enable();

    // End linear ad mode
    player.ads.endLinearAdMode();
  };
  player.preroll.timeupdate = function(e) {
    player.loadingSpinner.hide();
    const timeLeft = Math.ceil(player.preroll.options.skipTime - player.currentTime());

    if (timeLeft > 0) {
      player.preroll.skipButton.innerHTML = player.preroll.options.lang['skip in'] + timeLeft + 's';
    } else if ((' ' + player.preroll.skipButton.className + ' ').indexOf(' enabled ') === -1) {
      player.preroll.skipButton.className += ' enabled';
      player.preroll.skipButton.innerHTML = player.preroll.options.lang.skip;
    }
  };
  player.preroll.timeremaining = function(e) {
    player.loadingSpinner.hide();
    const timeLeft = Math.ceil(player.remainingTime());

    if (timeLeft > 0) {
      player.preroll.remainingTime.innerHTML = player.preroll.options.lang['video start in'] + timeLeft + 's';
    }
  };
  player.preroll.prerollError = function(e) {
    player.preroll.exitPreroll();
  };
  if (player.currentSrc()) {
    if (player.preroll.shouldPlayPreroll()) {
      player.trigger('adsready');
    } else {
      player.trigger('adscanceled');
    }
  }
};

/**
* A video.js plugin.
*
* In the plugin function, the value of `this` is a video.js `Player`
* instance. You cannot rely on the player being in a "ready" state here,
* depending on how the plugin is invoked. This may or may not be important
* to you; if not, remove the wait for "ready"!
*
* @function preroll
* @param    {Object} [options={}]
*           An object of options left to the plugin author to define.
*/
const preroll = function(options) {
  startPrerollAd(this, videojs.mergeOptions(defaults, options));
};

// Register the plugin with video.js.
registerPlugin('preroll', preroll);

// Include the version number.
preroll.VERSION = VERSION;

export default preroll;
