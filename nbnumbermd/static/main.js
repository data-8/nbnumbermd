define([
  'base/js/namespace',
  'jquery',
  'require',
  'base/js/events',
], function(Jupyter, $, require, events) {
  'use strict';

  function _get_cells () {
    return Jupyter.notebook.get_cells();
  }

  /**
   * Return the level of nbcell.
   * The cell level is an integer in the range 1-7 inclusive
   *
   * @param {Object} cell Cell instance or jQuery collection of '.cell' elements
   * @return {Integer} cell level
   */
  function get_cell_level (cell) {
    // headings can have a level up to 6, so 7 is used for a non-heading
    var level = 7;
    if (cell === undefined) {
      return level;
    }
    if ((typeof(cell) === 'object')  && (cell.cell_type === 'markdown')) {
      level = cell.get_text().match(/^#*/)[0].length || level;
    }
    return Math.min(level, 7); // we rely on 7 being max
  }

  function get_headings (cell) {
    return cell.get_text().match(/^\#* .*/gm);
  }

  function number_cells() {
    var heading_count = {};
    // headings can have a level up to 6
    for (var i = 1; i < 7; i++) {
      heading_count[String(i)] = 0;
    }
    var re = /^\#* (.*)/gm;
    var cells = _get_cells();
    for (var j = 0; j < cells.length; j++) {
      var text = cells[j].get_text();
      var match = re.exec(text);
      while (match) {

      }
    }
  }


  var load_extension = function() {
    events.on('rendered.MarkdownCell', function() {alert('triggered');});
  };

  var extension = {
    load_jupyter_extension : load_extension,
    load_ipython_extension : load_extension
  };
  return extension;
});
