(function() {

import "bwv";

import "music-utils";
import "musicxml";

// thanks mbostock https://github.com/mbostock/d3/blob/master/src/end.js
if (typeof define === "function" && define.amd) define(BWV);
else if (typeof module === "object" && module.exports) module.exports = BWV;
this.BWV = BWV;

})();
