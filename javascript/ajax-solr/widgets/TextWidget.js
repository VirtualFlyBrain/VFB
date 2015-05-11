(function ($) {

AjaxSolr.TextWidget = AjaxSolr.AbstractTextWidget.extend({
  init: function () {
    var self = this;
    $(this.target).find('input').bind('keypress', function(e) {
      if (e.which == 13) {
        var value = $(this).val();
        if (value.indexOf('{') > -1 || value.indexOf('}') > -1 || value.indexOf(':') > -1){
          $('warning-char').show();
        }
        if (value && self.set(value)) {
          self.doRequest();
        }
      }
    });
  },

  afterRequest: function () {
    $(this.target).find('input').val('');
  }
});

})(jQuery);
