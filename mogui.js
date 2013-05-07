// MOGUI.js
// Joshua Galvin
// 2013-05-23

// MIT License
var MOGUI = (function () {

  function fillStroke(moctx) {
    if (moctx.fill !== undefined) {
      moctx.setFillStyle(moctx.fill);
    }
    if (moctx.stroke !== undefined) {
      moctx.setStrokeStyle(moctx.stroke);
    }
  }

  // Should move this into an evented system
  var iconIMGs = new Image(), loaded = false;
  iconIMGs.src = "../images/glyphicons-halflings.png";
  iconIMGs.onload = function() {
    loaded = true;
    for(var i in fineUpstandingMaleCallers) {
      fineUpstandingMaleCallers[i]();
    }
  }
  var fineUpstandingMaleCallers = [];
  var icons = {
    "body": [7, 0],
    "support": [10, 5],
    "system": [16, 0],
    "equip": [3, 4],
    "bag": [4, 5]
  };


  // oh god this pattern.
  var MOITEM = XMONAD()
    .lift("up", function(mogui) {
      return mogui;
    })
    .lift("click", function(mogui, callback) {
      return MOITEM(
        mogui
          .onClick(MOITEM(mogui), callback)
      );
    });

  var MOGUI = XMONAD(function (monad, value) {
    if (value === undefined) {
      return MOCTX();
    }
    return value;
  })
    .lift("load", function(moctx, callback) {
      if(loaded) {
        callback();
      } else {
        fineUpstandingMaleCallers.push(callback);
      }
      return MOGUI(moctx);
    })  
    .lifts("setSize", "hide", "show")
    .lift_values("getCanvas")
    .lift("setColors", function (moctx, fill, stroke) {
      moctx.fill = fill;
      moctx.stroke = stroke;
      return MOGUI(moctx);
    })
    .lift_value("getColors", function (moctx) {
      return {"fill": moctx.fill, "stroke": moctx.stroke};
    })
    .lift("boxButton", function(moctx, num, text, icon) {
      var w = 500,
        h = 100,
        y = h*num+num*10;

      MOGUI(moctx)
        .box(0, y, w, h, 5)
        .ico(50, y+h/2, h/2, icon);

      moctx
        .setFont("50px sans-serif")
        .setFillStyle("black")
        .fillText(text, 100, y+h/1.5);

      return MOITEM(MOGUI(moctx));  
    })
    .lift("circleButton", function (moctx, num, radius, icon) {
      fillStroke(moctx);
      var x = moctx.getWidth() / 2,
        y =  radius + 5 + 2 * radius * num + num*radius/5;

      moctx
        .setLineWidth(5)
        .beginPath()
        .arc(x, y, radius-10, 0, Math.PI * 2, true)
        .closePath()
        .fill()

      moctx
        .beginPath()
        .arc(x, y, radius, 0, Math.PI * 2, true)
        .closePath()
        .stroke()

      MOGUI(moctx).ico(x, y, radius, icon);

      return MOITEM(MOGUI(moctx));
    })
    .lift("ico", function (moctx, x, y, radius, icon) {
      var ico = icons[icon];
      if(ico !== undefined) {
        moctx
          //.setGlobalCompositeOperation("xor")
          .drawImage(iconIMGs, 24*ico[0], 24*ico[1], 24, 24, x - 21, y - 21, radius*1.5, radius*1.5)
          //.setGlobalCompositeOperation("source-over");
      }
      return MOGUI(moctx);
    })
    .lift("circle", function (moctx, x, y, radius, fill, stroke) {
      fillStroke(moctx, fill, stroke);
      return MOGUI(moctx
        .beginPath()
        .arc(x, y, radius, 0, Math.PI * 2, true)
        .closePath()
        .fill().stroke()
        );
    })
    .lift("box", function (moctx, x, y, width, height, radius) {
      fillStroke(moctx);
      radius = radius === undefined ? 0 : radius;
      // This draws an optionally rounded corner box
      return MOGUI(moctx
        .beginPath()
        .moveTo(x + radius, y)
        .lineTo(x + width - radius, y)
        .quadraticCurveTo(x + width, y, x + width, y + radius)
        .lineTo(x + width, y + height - radius)
        .quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        .lineTo(x + radius, y + height)
        .quadraticCurveTo(x, y + height, x, y + height - radius)
        .lineTo(x, y + radius)
        .quadraticCurveTo(x, y, x + radius, y)
        .closePath()
        .fill().stroke());
    })
    .lift("onClick", function(moctx, moitem, callback) {
      moctx.getCanvas().onclick = function() {
        callback.call(undefined, moitem);
      };
      return MOGUI(moctx);
    })
    .lift("clear", function(moctx) {
      return MOGUI(moctx.clearRect(0, 0, moctx.getWidth(), moctx.getHeight()));
    })
    .lift("text", function (moctx, text, x, y, color, font) {
      fillStroke(moctx, color, color);
      if (font !== undefined) {
        moctx.setFont(font);
      }
      return MOGUI(moctx.fillText(text, x, y));
    });
  return MOGUI;
}());