document.getElementById('date').value = Date();
document.getElementById('author').value = "Jeremy Tripp";


$(document).ready(function(){
    var _id,title,body,description,date,author;
    var link = $(".alert-link");
    title = $("#title-input").val();
    if (title === "") {
        $(".has-danger").show();
        return false;
    } else {
        $("#submit").click(function (event) {
            event.preventDefault();
            _id = $("#_id").val();
            title = $("#title-input").val();
            tinyMCE.triggerSave();
            body = $("#body-input").val();
            description = $("#description-input").val();
            date = $("#date").val();
            author = $("#author").val();
            $.post("/edit", {
                _id: _id,
                title: title,
                body: body,
                description: description,
                date: date,
                author: author
            }, function (data) {
                var notification = document.querySelector('.mdl-js-snackbar');
                var snackbarData = {
                    message: title + ' was updated!',
                    actionHandler: function(event) {
                        window.location.href = '/blog/' + title;
                    },
                    actionText: "GO",
                    timeout: 10000
                };
                notification.MaterialSnackbar.showSnackbar(snackbarData);
            });
        });
    }
});

