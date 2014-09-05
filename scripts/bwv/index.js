(function() {

import "bwv";

import "music-utils";
import "musicxml";

// thanks mbostock https://github.com/mbostock/d3/blob/master/src/end.js
if (typeof define === "function" && define.amd) define(bwv);
else if (typeof module === "object" && module.exports) module.exports = bwv;
this.bwv = bwv;

})();
