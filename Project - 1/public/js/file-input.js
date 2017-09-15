$(document).on('change', ':file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $(':file').on('fileselect', function(event, numFiles, label) {

        var t = label.split(".");
        if(t[1]=== 'png' || t[1]=== 'jpg' || t[1]=== 'jpeg'){
            $('.filename').removeClass('alert');
            $('.filename').removeClass('alert-danger');
            $('.filename').text(label);
            $('.filename').addClass('chip');

        }else{
            $('.filename').removeClass('chip');
            $('.filename').text("Can upload images only(png,jpg,jpeg)");
            $('.filename').addClass('alert');
            $('.filename').addClass('alert-danger');
        }
    });
});