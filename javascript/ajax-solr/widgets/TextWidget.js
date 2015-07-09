(function ($) {

AjaxSolr.TextWidget = AjaxSolr.AbstractTextWidget.extend({
  init: function () {
    var self = this;
    $(this.target).find('input').bind('keypress', function(e) {
      if (e.which == 13) {
        var value = $(this).val();
        value = value.replace('{','%5C{').replace('}','%5C}').replace(':','%5C:');
        value = value.replace('%7B','%5C%7B').replace('%7D','%5C%7D').replace('%3A','%5C%3A');
        if (value.indexOf('%7B') > -1 || value.indexOf('}') > -1 || value.indexOf(':') > -1){
          $('warning-area').html('<div class="alert alert-warning alert-dismissible" role="alert" id="warning-char">
	  				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	  				<strong>Warning!</strong> The search contains a restricted special character. Please remove and try again.
					</div>');
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
