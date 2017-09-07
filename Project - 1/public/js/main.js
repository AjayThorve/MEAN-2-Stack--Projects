$(document).ready(function () {
    $('.delete-article').on('click',function (e) {

        let confirmation = confirm('Are you sure');
        if(confirmation){
            $target = $(e.target);
            const id = $target.attr('data-id');

            $.ajax({
                type: 'DELETE',
                url: '/article/'+id,
                success: function (response) {
                    alert('Deleted Succesfully!');
                    window.location.href='/';
                },
                error:function (err) {
                    console.log(err);
                }
            });
        }

    });
});