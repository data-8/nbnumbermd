define([
  'base/js/namespace',
  'jquery',
  'require',
  'base/js/events',
], function(Jupyter, $, require, events) {
  'use strict';

  // Finds num of leading #'s in a given string'
  function get_heading_level (text) {
    return text.match(/^#*/)[0].length - 1;
  }

  // Replaces 'before' with 'after' given the last index of 'before'
  function replace_by_index(str, before, after, last_index) {
    var begin = last_index - before.length;
    var end = last_index;
    return str.substring(0,begin) + after + str.substring(end);
  }

  // Removes previous numbers from headings
  function strip_numbers(str) {
    return str.replace(/^[\d. ]+ (.*)/g, '$1');
  }

  // Generate heading numbers as a string
  function generate_number(level, counts) {
    var rs ='';
    for (var i = 0; i <= level; i++) {
      rs += String(counts[i]) + '.';
    }
    return rs;
  }

  function number_cells() {
    // list to track heading numbers
    var heading_count = [];

    // headings can have a level up to 6
    for (var i = 0; i < 7; i++) {
      heading_count[i] = 0;
    }

    var re = /^\#* (.*)/gm;
    var cells = Jupyter.notebook.get_cells();

    for (var j = 0; j < cells.length; j++) {
      var text = cells[j].get_text();
      var match = re.exec(text);

      while (match) {
        var level = get_heading_level(match[0]);
        var content = match[1];

        // track numbering
        heading_count[level] += 1;
        for (var k = level + 1; k < 7; k++) {
          heading_count[k] = 0;
        }

        // handle content
        var new_content = generate_number(level, heading_count) + ' ' + strip_numbers(content);
        text = replace_by_index(text, content, new_content, re.lastIndex);

        match = re.exec(text);
      }
      
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
