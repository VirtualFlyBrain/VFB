(function ($) {

AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractTextWidget.extend({
  afterRequest: function () {
    $(this.target).find('input').unbind().removeData('events').val('');
    $(this.target).find('input').autocomplete();
    var self = this;

    var callback = function (response) {
      var list = [];
      var maxResults = 20; // limit number of results
      var c = 0;
      for (var i = 0; i < self.fields.length; i++) {
        var field = self.fields[i];
        for (var facet in response.facet_counts.facet_fields[field]) {
          c++;
          if (response.facet_counts.facet_fields[field][facet] > 1){
            list.push({
              field: field,
              value: facet,
              label: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + field
            });
          }else{
            list.push({
              field: field,
              value: facet,
              label: facet
            });
          }
          if (c > maxResults){ // limit number of results
            break;
          }
        }
        if (c > maxResults){ // limit number of results
          break;
        }
      }

      self.requestSent = false;
      $(self.target).find('input').autocomplete('destroy').autocomplete({
        source: list,
        select: function(event, ui) {
          if (ui.item) {
            self.requestSent = true;
            if (self.manager.store.addByValue('fq', ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
              self.doRequest();
            }
          }
        }
      });

      // This has lower priority so that requestSent is set.
      $(self.target).find('input').bind('keydown', function(e) {
        if (self.requestSent === false && e.which == 13) {
          var value = $(this).val();
          if (value && self.set(value)) {
            self.doRequest();
          }
        }
      });
    } // end callback

    var params = [ 'rows=0&facet=true&facet.limit=-1&facet.mincount=1&json.nl=map' ];
    for (var i = 0; i < this.fields.length; i++) {
      params.push('facet.field=' + this.fields[i]);
    }
    var values = this.manager.store.values('fq');
    for (var i = 0; i < values.length; i++) {
      params.push('fq=' + encodeURIComponent(values[i]));
    }
    params.push('q=' + this.manager.store.get('q').val());
    $.getJSON(this.manager.solrUrl + 'select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);
  }
});

})(jQuery);
