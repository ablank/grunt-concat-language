/**
 * @author Adam Blankenship
 */
'use strict';
exports.init = function (grunt) {
  // var util = require('util');
  var exports = {};

  exports.openTag = function (options) {
    if (!options) {
      return '';
    }
    if (options.opentag) {
      grunt.template.process(options.opentag + '\n');
    }

    var tag;

    grunt.log.writeln('Process as ' + options.type);

    if (options.type === 'html') {
      tag = '<!DOCTYPE html>\n<html>\n<body>';
    }

    if (options.type === 'php') {
      tag = '<?php';
    }

    if (options.type === 'xml') {
      // <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
      options.version = options.version ? options.version : '1.0';
      options.encoding = options.encoding ? options.encoding : 'UTF-8';
      options.standalone = options.doctype ? ' ' + 'no' : 'yes';


      // <!DOCTYPE root_element SYSTEM "DTD_location">
      options.doctype = options.doctype ? options.doctype : '[]';
      options.docroot = options.docroot ? options.docroot : 'document';

      tag = '<?xml version="' + options.version +
        '" encoding="' + options.version +
        '" standalone="' + options.standalone + '" ?>\n' +
        '<!DOCTYPE ' + options.docroot + ' SYSTEM "' + options.doctype + '">';
    }

    return grunt.template.process(tag + '\n');
  };


  exports.closeTag = function (options) {
    if (!options) {
      return '';
    }
    if (options.closetag) {
      return grunt.template.process('\n' + options.closetag);
    }

    var tag;
    if (options.type === 'html') {
      tag = '</body>\n</html>';
    }
    if (options.type === 'php' && options.closetag === true) {
      tag = '?>\n';
    }

    return grunt.template.process('\n' + tag);
  };

  exports.format = function (filepath, src, options) {
    if (!options) {
      return src;
    }
    var nichts = [];

    grunt.log.writeln('Looking for ' + options.type + ' tags in ' + filepath);

    if (options.type === 'html') {
      src = src.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im)[1];
      if (options.rmScript === true) {
        src = src.replace(/<script[^>]*>((.|[\n\r])*)<\/script>/igm, '');
      }
    }
    else {
      if (options.type === 'php') {
        // <?php ?>
        nichts.push('(\\<\\?php\\s)');
        if (options.rmClose === true) {
          nichts.push('(\\s\\?\\>)');
        }
        // Format docblock comments
        src = src.replace(/^\/\*\*\s{2,}\W\s\@file/gm, '/*\n * @see file: ' + filepath)
          .replace(/\@return/g, '\@return')
          .replace(/\@param/g, '\@param');
      }
      if (options.type === 'xml') {
        // <?xml?>
        nichts.push('(\\<\\?xml.*)');
        nichts.push('(\\<\\!DOCTYPE.*)');
      }
    }

    if (options.rmLine === true) {
      src = src.replace(/([\r\n])+/gm, '\n');
    }
    if (options.rmSpace === true) {
      nichts.push('((^\\s+)|(\\s+$))|(\\s{2,})');
      src = src.replace(/ +/g, ' ');
    }

    // Flatten array to single regex & remove content
    src = src.replace(new RegExp('(?:' + nichts.join('|') + ')', 'ig'), '');

    // grunt.log.writeln(util.inspect(renix, false, null));
    return src;
  };

  return exports;
};
