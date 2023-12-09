
$(document).ready(function() {
  $(".new-tweet textarea").on('input', function() {
    const charCount = this.value.length;
    const counter = $(this).closest(".new-tweet").find('.counter');
    counter.text(140 - charCount);

    // Adjust styles based on character count
    if (charCount > 140) {
      counter.css('color', 'red');
    } else {
      counter.css('color', ''); // Reset color to default
    }
  });
});
