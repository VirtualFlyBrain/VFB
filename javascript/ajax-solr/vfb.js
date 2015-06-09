var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: '/search/'
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
      limit: 10,
      minLength: 2,
      fields: [ 'label', 'label_suggest' ]
    }));
    Manager.init();
    Manager.store.addByValue('q', '*');
    var params = {
      facet: true,
      'facet.field': [ 'label', 'label_suggest', 'short_form' ],
      'facet.limit': -1,
      'facet.sort' : 'score',
      'facet.mincount': 1,
      'json.nl': 'map',
      'fq' : 'VFB_* FBbt_*',
      'df' : 'short_form',
      'fl' : 'label,id,short_form,label_suggest,description'
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
