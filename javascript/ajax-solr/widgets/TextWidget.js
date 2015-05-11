(function ($) {

AjaxSolr.TextWidget = AjaxSolr.AbstractTextWidget.extend({
  init: function () {
    var self = this;
    $(this.target).find('input').bind('keypress', function(e) {
      if (e.which == 13) {
        var value = $(this).val();
        if (value.contains(':')){
          if (value && self.set(value)) {
            self.doRequest();
          }
        }else{
          value = 'label_suggest:*' + value + '*';
          if (value && self.set(value)) {
            self.doRequest();
          }
        }
      }
    });
  },

  afterRequest: function () {
    $(this.target).find('input').val('');
  }
});

})(jQuery);
