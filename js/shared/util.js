(function(exports){
  if (typeof window == 'undefined') {
    var _ = require('underscore');
  } else {  // NOTE: take care that corresponding modules are included in the embedding html page
    var _ = window._;
  }

  var debug = true; // set to false on deployment
  
  function log(msg) {
    if (debug)
      console.log(msg);
  }

  // NOTE: replicated objects are only cloned on top-level
  function replicate(n,x) {
    var xs = [];
    for (var i=0; i<n; i++) 
      xs.push(_.clone(x));
    return xs;
  }

  // pad integer with leading 0's when necessary 
  function padZero(l, n) {
    return ('0000000000000000000000'+n).slice(-l);
  }

  // depth is to prevent hanging on circular objects
  function showJSON(json,indent,depth) {
    indent = indent || '';
    depth = depth || 0;
    var str = '';
    
    if (depth>=10) // max depth
      str += typeof json != 'object' ? json : Array.isArray(json) ? '[...]' : '{...}';
    else {   
      if (Array.isArray(json)) {
        if (json.length ==0 )
          str += '[]';
        else {
          for (var i = 0; i<json.length; i++)
            str += (i==0?'[ ':indent + ', ') + showJSON(json[i],'  '+indent, depth+1)+'\n';
          str += indent + ']';
        }
      } 
      else {
        if (typeof json == 'object') {
          var keys = Object.keys(json); // TODO: use underscore version for safety
          if (keys.length ==0 )
            str += '{}';
          else {
            for (var i = 0; i<keys.length; i++)
              str += (i==0?'{ ':indent + ', ') + keys[i] + ':' +
              (typeof json[keys[i]] == 'object' ? '\n' + indent +'  ' : ' ') + // for object children start new line
              showJSON(json[keys[i]],'  '+indent, depth+1)+'\n';
            str += indent + '}';
          }
        }
        else
          str += json;
      }
    }
    return str;
  }
  
  function showTime(date) {
    return padZero(2, date.getHours()) + ':' + padZero(2, date.getMinutes()) + ':' + padZero(2, date.getSeconds());
  }

  function showDate(date) {
    return padZero(2, date.getDate()) + '-' + padZero(2, date.getMonth()+1) + '-' + padZero(4, date.getFullYear());
  }

  function readDate(dateStr) {
    var parts = dateStr.split('-');
    if (parts.length == 3)
      return new Date(parts[2], parts[1]-1, parts[0]);
    else
      throw 'Exception: Incorrect date: "'+dateStr+'"';
  }

  /* Set boolean DOM attribute for jQuery object $elt according to HTML standard.
   * (absence denotes false, attrName=AttrName denotes true) */
  function setAttr($elt, attrName, isSet) {
    if (isSet) 
      $elt.attr(attrName, attrName);
    else
      $elt.removeAttr(attrName);  
  }

  exports.debug = debug;
  exports.log = log;
  exports.padZero = padZero;
  exports.replicate = replicate;
  exports.showJSON = showJSON;
  exports.showTime = showTime;
  exports.showDate = showDate;
  exports.readDate = readDate;
  exports.setAttr = setAttr;

})(typeof exports == 'undefined'? this.util={}: exports);
// Module for loading by Node.js as well as browser.
// Closure is to prevent declaring globals in browser.
// in Browser, exports is bound to global util variable.

if (typeof jQuery != 'undefined') {
  // Extend jQuery objects with a method to scroll a minimum amount to make the object visible.
  // Adapted from http://stackoverflow.com/questions/4217962/scroll-to-an-element-using-jquery
  // to work for arbitrary elements rather than document.
  // NOTE scrolling div needs: position: relative;
  // TODO: figure out a way to do this without
  jQuery.fn.scrollMinimal = function(target, smooth) {
    //console.log(target);
    var tTop = $(target).position().top;
    var tHeight = target.outerHeight(true);
    var sTop = this.scrollTop();
    var sHeight = this.height();
    //console.log('minscroll s:'+sTop+'x'+sHeight+' t:'+tTop+'x'+tHeight);
    
    if (tTop < 0) {
      if (smooth) {
        $(this).animate({'scrollTop': sTop + tTop},'fast','linear');
      } else {
        $(this).scrollTop(sTop + tTop);
      }
    } else if (tTop + tHeight > sHeight) {
      //util.log('need to scroll: '+(tTop + tHeight-sHeight));
      if (smooth) {
        $(this).animate({'scrollTop': sTop + tTop + tHeight-sHeight},'fast','linear');
      } else {
        $(this).scrollTop(sTop +    tTop + tHeight-sHeight);
      }
    }
  };
 }
