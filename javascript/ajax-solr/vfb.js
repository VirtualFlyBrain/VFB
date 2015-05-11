var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://blanik.inf.ed.ac.uk:8983/solr/ontology/'
    });
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function (perPage, offset, total) {
        $('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
      }
    }));
    // var fields = [ 'topics', 'organisations', 'exchanges' ];
    // for (var i = 0, l = fields.length; i < l; i++) {
    //   Manager.addWidget(new AjaxSolr.TagcloudWidget({
    //     id: fields[i],
    //     target: '#' + fields[i],
    //     field: fields[i]
    //   }));
    // }
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: [ 'label_suggest' ]
    }));
    // Manager.addWidget(new AjaxSolr.CountryCodeWidget({
    //   id: 'countries',
    //   target: '#countries',
    //   field: 'countryCodes'
    // }));
    // Manager.addWidget(new AjaxSolr.CalendarWidget({
    //   id: 'calendar',
    //   target: '#calendar',
    //   field: 'date'
    // }));
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': [ 'label', 'label_suggest', 'short_form' ],
      'facet.limit': 20,
      'facet.sort' : 'count',
      'facet.mincount': 1,
      'json.nl': 'map'
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
    Manager.doRequest();
  });

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }

})(jQuery);
