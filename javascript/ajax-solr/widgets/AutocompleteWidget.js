(function ($) {

  AjaxSolr.AutocompleteWidget = AjaxSolr.AbstractTextWidget.extend({

    /**
     * @param {Object} attributes
     * @param {String} attributes.field The Solr field to autocomplete indexed
     *   terms from.
     * @param {Boolean} [attributes.tokenized] Whether the underlying field is
     *   tokenized. This component will take words before the last word
     *   (whitespace separated) and generate a filter query for those words, while
     *   only the last word will be used for facet.prefix. For field-value
     *   completion (on just one field) or query log completion, you would have a
     *   non-tokenized field to complete against. Defaults to <tt>true</tt>.
     * @param {Boolean} [attributes.lowercase] Indicates whether to lowercase the
     *   facet.prefix value. Defaults to <tt>true</tt>.
     * @param {Number} [attributes.limit] The maximum number of results to show.
     *   Defaults to 10.
     * @param {Number} [attributes.minLength] The minimum number of characters
     *   required to show suggestions. Defaults to 2.
     * @param {String} [attributes.servlet] The URL path that follows the solr
     *   webapp, for use in auto-complete queries. If not specified, the manager's
     *   servlet property will be used. You may prepend the servlet with a core if
     *   using multiple cores. It is a good idea to use a non-default one to
     *   differentiate these requests in server logs and Solr statistics.
     */
    constructor: function (attributes) {
      AjaxSolr.AutocompleteWidget.__super__.constructor.apply(this, arguments);
      AjaxSolr.extend(this, {
        field: null,
        tokenized: true,
        lowercase: true,
        limit: 10,
        minLength: 2,
        servlet: null
      }, attributes);
    },


    afterRequest: function () {
      $(this.target).find('input').unbind().removeData('events').val('');
      $(this.target).find('input').autocomplete();
      var self = this;

      var callback = function (response) {
        var list = [];
        for (var i = 0; i < self.fields.length; i++) {
          var field = self.fields[i];
          for (var facet in response.facet_counts.facet_fields[field]) {
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
            if (value && value.length > 1){
              if (value && self.set(value)) {
                self.doRequest();
              }
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
