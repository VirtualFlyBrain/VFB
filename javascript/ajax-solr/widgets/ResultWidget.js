(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    $(this.target).html($('<img>').attr('src', '/javascript/ajax-solr/images/ajax-loader.gif'));
  },

  facetLinks: function (facet_field, facet_values) {
    var links = [];
    if (facet_values) {
      for (var i = 0, l = facet_values.length; i < l; i++) {
        if (facet_values[i] !== undefined) {
          links.push(
            $('<a href="#"></a>')
            .text(facet_values[i])
            .click(this.facetHandler(facet_field, facet_values[i]))
          );
        }
        else {
          links.push('no items found in current selection');
        }
      }
    }
    return links;
  },

  facetHandler: function (facet_field, facet_value) {
    var self = this;
    return function () {
      self.manager.store.remove('fq');
      self.manager.store.addByValue('fq', facet_field + ':' + AjaxSolr.Parameter.escapeValue(facet_value));
      self.doRequest(0);
      return false;
    };
  },

  afterRequest: function () {
    $(this.target).empty();
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
      var doc = this.manager.response.response.docs[i];
      $(this.target).append(this.template(doc));

      // var items = [];
      // items = items.concat(this.facetLinks('label', doc.label));
      // items = items.concat(this.facetLinks('type', doc.type));
      //
      // var $links = $('#links_' + doc.short_form[0]);
      // $links.empty();
      // for (var j = 0, m = items.length; j < m; j++) {
      //   $links.append($('<li></li>').append(items[j]));
      // }
    }
  },

  template: function (doc) {
    var snippet = '';
    var maxNum = 50;
    if (typeof(doc.description) != "undefined" && doc.description.length > maxNum) {
      snippet += doc.description.substring(0, maxNum);
      snippet += '<span style="display:none;">' + doc.description.substring(maxNum);
      snippet += '</span> <a href="#" class="more">more</a>';
    }
    else {
      snippet += doc.description;
    }

    var output = '<div><a href="#anatomyDetails" onclick="$(\'#anatomyDetails\').load(\'/do/ont_bean.html?id=' + doc.short_form[0].replace('VFB:','VFB_').replace('FBbt_','FBbt:') + '\');" >'
    if (doc.short_form[0].contains('VFB')) {
      output += '<img align="right" src="/owl/' + doc.short_form[0].replace('VFB:','VFB_').replace('VFB_', 'VFBi_') + '/thumbnail.png" class="img-thumbnail" style="height: 40px; padding: 0px" data-holder-rendered="false" >'
    }
    output += '<dt>' + doc.label;
    output += ' (' + doc.short_form[0] + ')</dt>';
    output += '<dd>';
    output += snippet + '</dd></a></div>';
    return output;
  },

  init: function () {
    $(document).on('click', 'a.more', function () {
      var $this = $(this),
          span = $this.parent().find('span');

      if (span.is(':visible')) {
        span.hide();
        $this.text('more');
      }
      else {
        span.show();
        $this.text('less');
      }

      return false;
    });
  }
});

})(jQuery);
