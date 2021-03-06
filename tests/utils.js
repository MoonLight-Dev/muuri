(function (window) {

  var utils = window.utils = {};
  var supportsTouch = !!('TouchEvent' in window);
  var supportsPointer = !!('PointerEvent' in window);

  //
  // Methods
  //

  utils.createGridElements = function (options) {

    var opts = options || {};
    var container = opts.container || document.createElement('div');
    var itemCount = typeof opts.itemCount === 'number' && opts.itemCount >= 0 ? opts.itemCount : 10;
    var itemStyles = opts.itemStyles || {
      position: 'absolute',
      width: '50px',
      height: '50px',
      padding: '5px',
      border: '5px solid #ff0000',
      margin: '10px',
      background: '#000',
      boxSizing: 'border-box'
    };
    var containerStyles = opts.containerStyles || {
      position: 'relative'
    };
    var items = [];
    var item;

    utils.setStyles(container, containerStyles);

    for (var i = 0; i < itemCount; i++) {
      item = document.createElement('div');
      utils.setStyles(item, itemStyles);
      item.appendChild(document.createElement('div'));
      container.appendChild(item);
      items.push(item);
    }

    if (container !== document.body && !document.body.contains(container)) {
      (opts.appendTo || document.body).appendChild(container);
    }

    return {
      container: container,
      items: items
    };

  };

  utils.dragElement = function(options) {

    // Parse options.
    var opts = options || {};
    var noop = function () {};
    var element = opts.element;
    var move = opts.move;
    var onStart = opts.onStart || noop;
    var onStop = opts.onStop || noop;
    var onRelease = opts.onRelease || noop;

    // Calculate start and end points.
    var from = mezr.offset(element, window);
    from.left += mezr.width(element) / 2;
    from.top += mezr.height(element) / 2;
    var to = {
      left: from.left + move.left,
      top: from.top + move.top
    };

    // Create the hand and finger istances.
    var eventMode = supportsPointer ? 'pointer' : supportsTouch ? 'touch' : 'mouse';
    var pointerType = supportsTouch ? 'touch' : 'mouse';
    var hand = new Hand({timing: 'fastFrame'});
    var finger = hand.growFinger(eventMode, {
      pointerType: pointerType,
      down: false,
      width: 30,
      height: 30,
      x: from.left,
      y: from.top
    });

    // Do the drag.
    finger.down();
    window.setTimeout(function () {
      onStart();
      finger.moveTo(to.left, to.top, 100);
      window.setTimeout(function () {
        onStop();
        finger.up();
        window.setTimeout(function () {
          onRelease();
        }, 100);
      }, 200);
    }, 100);

  };

  utils.sortItemsById = function (items) {
    return items.sort(function (a, b) {
      return a._id - b._id;
    });
  };

  utils.setStyles = function (element, styles) {
    var props = Object.keys(styles);
    for (var i = 0; i < props.length; i++) {
      element.style[props[i]] = styles[props[i]];
    }
  };

  utils.matches = function (el, selector) {
    var p = Element.prototype;
    return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector).call(el, selector);
  };

  utils.isScrollEvent = function (e) {

    return e.type === 'scroll';

  };

  utils.isHammerEvent = function (e) {

    var ret = true;
    var eventKeys = Object.keys(e);
    var requiredKeys = [
      'type',
      'deltaX',
      'deltaY',
      'deltaTime',
      'distance',
      'angle',
      'velocityX',
      'velocityY',
      'velocity',
      'direction',
      'offsetDirection',
      'scale',
      'rotation',
      'center',
      'srcEvent',
      'target',
      'pointerType',
      'eventType',
      'isFirst',
      'isFinal',
      'pointers',
      'changedPointers',
      'preventDefault'
    ];

    requiredKeys.forEach(function (key) {
      if (eventKeys.indexOf(key) === -1) {
        ret = false;
      }
    });

    return ret;

  };

})(this);