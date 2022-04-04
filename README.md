<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Video.js Simple Prerolls](#videojs-simple-prerolls)
  - [Requirements](#requirements)
  - [Adding the plugin](#adding-the-plugin)
  - [Changing Advertisement source dynamically](#changing-advertisement-source-dynamically)
  - [Documentation](#documentation)
    - [Plugin Options](#plugin-options)
      - [src](#src)
      - [href](#href)
      - [target](#target)
      - [allowSkip](#allowskip)
      - [skipTime](#skiptime)
      - [repeatAd](#repeatad)
      - [adSign](#adsign)
      - [showRemaining](#showremaining)
      - [adsOptions](#adsoptions)
      - [lang](#lang)
  - [Credits](#credits)
  - [Release History](#release-history)
    - [v2.0.0](#v200)
    - [v1.1.1](#v111)
    - [v1.1.0](#v110)
    - [v1.0.0](#v100)
    - [v0.2.0](#v020)
    - [v0.1.0](#v010)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Video.js Simple Prerolls

Simple video.js plugin that uses the video.js' [videojs-contrib-ads](https://github.com/videojs/videojs-contrib-ads) plugin to display a preroll video before the main video starts.

## Requirements

This plugin works with VideoJS 6 and up. To use it with VideoJS 5, please use `videojs-contrib-ads@5.2.0-1`. This plugin also can be used with `videojs-playlist` and the source of ad can be changed dynamically by assigning new ad src in the `beforeplaylistitem` event hook of `videojs-playlist`. 

## Adding the plugin

Download the [videojs-contrib-ads](https://raw.githubusercontent.com/videojs/videojs-contrib-ads/master/src/videojs.ads.js) plugin or [build it yourself](https://github.com/videojs/videojs-contrib-ads) from the repository. Include videojs.ads.js and videojs-preroll after including video.js itself.

```html
<script src="video.js"></script>
<script src="videojs.ads.js"></script>
<script src="videojs-preroll.js"></script>
<link href="video-js.css" rel="stylesheet" type="text/css">
<link href="video.ads.css" rel="stylesheet" type="text/css">
<link href="videojs-preroll.css" rel="stylesheet" type="text/css">
```

Initialize the plugin:

```html
<video id="example_video_1" class="video-js vjs-default-skin" controls width="640" height="264" poster="http://video-js.zencoder.com/oceans-clip.png">
  <source src="http://video-js.zencoder.com/oceans-clip.mp4" type='video/mp4' />
  <source src="http://video-js.zencoder.com/oceans-clip.webm" type='video/webm' />
  <source src="http://video-js.zencoder.com/oceans-clip.ogv" type='video/ogg' />
</video>
<script>
videojs('example_video_1', {}, function(){
  var player = this;
  player.preroll({
    src:"advertisement.mp4"
  });
});
</script>
```

Using `npm`
```sh
npm install --save videojs-preroll-v2
```

There's also a [working example](example.html) of the plugin you can check out if you're having trouble.

## Changing Advertisement source dynamically

While using with `videojs-playist`, you can change the adverstisement source dynamically like this. Other options can also be changed by assigning corresponding value to corresponding properties like `player.options.[property]=[value]`

```js
      examplePlayer.on('beforeplaylistitem', function(){
        let currentVideoIndex = examplePlayer.playlist.currentIndex();
        console.log('Current Index: ', currentVideoIndex);
        examplePlayer.preroll.options.allowSkip = true;
        examplePlayer.preroll.adDone = false;
        examplePlayer.preroll.options.src = adSources[currentVideoIndex + 1];
        if(currentVideoIndex >= 1){
          examplePlayer.preroll.options.repeatAd = false;
        }
      });
```

## Documentation
### Plugin Options

You may pass in an options object to the plugin upon initialization. This
object may contain any of the following properties:

#### src
Type: `String` | `Object` | `Array`

`Required`. Source video file to play. Can be any valid [videojs src parameter](http://docs.videojs.com/docs/api/player.html#Methodssrc)

#### href
Type: `String`

Url to redirect to if user clicks on the ad. Can be left empty for no redirection.

#### target
Type: `String`
Default: _blank
Target to open the url in (eg _blank or _top)

#### allowSkip
Type: `Boolean`
Default: true

Allow the user to skip the ad when it has played for a number of seconds.

#### skipTime
Type: `Integer`
Default: 5

Number of seconds after which the video can be skipped.

#### repeatAd
Type: `Boolean`
Default: false

Whether the ad should be repeated if a new src is loaded to the player.

#### adSign
Type: `Boolean`
Default: false

Adds an "Advertisement" sign to the video.

#### showRemaining
Type: `Boolean`
Default: false

Show the remaining time of the ad (only if `allowSkip` is set to false.)

#### adsOptions
Type: `Object`
Default: {}

Settings object passed to the videjs-contrib-ads plugin.

#### lang
Type: `Object`
Default:
```javascript
{
    'skip':'Skip',
    'skip in': 'Skip in ',
    'advertisement': 'Advertisement',
    'video start in': 'Video will start in: '
}
```
Language strings for skip button, "Advertisement" sign and remaining ad time element.

## Credits

Uses javascript and css for video skipping and linking block from The Onions [videojs-vast-plugin](https://github.com/theonion/videojs-vast-plugin/)

## Release History

### v2.0.0
- Added cross-compatibility with VideoJS version 6 & 7
- For compatibility with VideoJS version 5, `videojs-contrib-ads@5.2.0-1` must be used
- Options, including advertisement source, can be changed dynamically

### v1.1.1
- Added cross-compatibility with Video.js version 5 and 6

### v1.1.0
- Added "Advertisement" sign option
- Added remaining time sign option
- Modified loadingSpinner behavior to use native hide/show functions
- Added loadingSpinner show, bigPlayButton hide and posterImage hide to exitPreroll to provide loading status feedback to user

### v1.0.0
- Updated videojs-contrib-ads library to v3.0.0 and made the preroll plugin compatible with it
- Changed plugin for video.js v5.0.0
- Added language to config
- Changed the recommended setup to ensure videojs-contrib-ads loads properly
- Fixed issue when preload was set to "none" which caused the player to require another click on the play button

### v0.2.0
- Updated videojs-contrib-ads library to v0.5.0 and made the preroll plugin compatible with it
- Fixed some of the loading events to start playback faster if there is no ad to be displayed

### v0.1.0
- Initial release

## License

MIT