define([
  'base/js/namespace',
  'jquery',
  'require',
  'base/js/events',
], function(Jupyter, $, require, events) {
  'use strict';

  // Finds num of leading #'s in a given string'
  function get_heading_level (text) {
    var error = 7;
    return text.match(/^#*/)[0].length || error;
  }

  function replace_by_index(str, before, after, last_index) {
    var begin = last_index - before.length;
    var end = last_index;
    return str.substring(0,begin) + after + str.substring(end);
  }

  function strip_numbers(str) {
    return str.replace(/^[\d. ]+ (.*)/g, '$1');
  }

  function number_cells() {
    // instantiate dictionary keeping track of what number to append to
    // each header
    var heading_count = {};
    // headings can have a level up to 6
    for (var i = 1; i < 7; i++) {
      heading_count[String(i)] = 1;
    }

    var re = /^\#* (.*)/gm;
    var cells = Jupyter.notebook.get_cells();

    for (var j = 0; j < cells.length; j++) {
      var text = cells[j].get_text();
      var match = re.exec(text);

      while (match) {
        var level = get_heading_level(match[0]);
        var content = match[1];

        // handle content
        var new_content = String(heading_count[String(level)]) + '. ' + strip_numbers(content);
        // I think this runs into problems if multiple heading are the same
        text = replace_by_index(text, content, new_content, re.lastIndex);

        // handle numbering
        heading_count[String(level)] += 1;
        for (var k = level + 1; k < 7; k++) {
          heading_count[String(k)] = 1;
        }

        match = re.exec(text);
      }
      console.log(text);
      cells[j].set_text(text);
      cells[j].render();
    }
  }



  var load_extension = function() {
    Jupyter.toolbar.add_buttons_group([action]);
  };

  var action = {
    'label'   : 'Number Markdown Cells',
    'icon'    : 'fa fa-rocket',
    'callback': number_cells
  };

  var extension = {
    load_jupyter_extension : load_extension,
    load_ipython_extension : load_extension
  };
  return extension;
});
