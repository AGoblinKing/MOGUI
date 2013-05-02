// MOGUI.js
// Joshua Galvin
// 2013-05-23

// MIT License
var MOGUI = (function () {

  function fillStroke(moctx, fill, stroke) {
    if (fill !== undefined) {
        moctx.setFillStyle(fill);
      }
      if (stroke !== undefined) {
        moctx.setStrokeStyle(stroke);
      }
  }
  var MOGUI = XMONAD(function (monad, value) {
    if (value === undefined) {
      return MOCTX()
    }
    return value;
  })
    .lifts("setSize", "hide", "show")
    .lift_values("getCanvas")
    .lift("circle", function (moctx, x, y, radius, fill, stroke) {
      fillStroke(moctx, fill, stroke);
      return MOGUI(moctx
        .beginPath()
        .arc(x, y, radius, 0, Math.PI * 2, true)
        .closePath()
        .fill().stroke()
        );
    })
    .lift("box", function (moctx, x, y, width, height, fill, stroke, radius) {
      fillStroke(moctx, fill, stroke);
      radius = radius === undefined ? 0 : radius;

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