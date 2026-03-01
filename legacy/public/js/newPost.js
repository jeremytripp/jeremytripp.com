document.getElementById('date').value = Date();
document.getElementById('author').value = "Jeremy Tripp";

$(document).ready(function(){
    var title,body,description,date,author,titleText;
    var link = $(".alert-link");

    $("#submit").click(function(event){
        event.preventDefault();
        title=$("#title-input").val();
        if (title === "") {
            $(".has-danger").show();
            return false;
        } else {
            tinyMCE.triggerSave();
            body=$("#body-input").val();
            description=$("#description-input").val();
            date=$("#date").val();
            author=$("#author").val();
            $.post("/add-post",{title: title, body: body, description: description, date: date, author: author}, function(data){
                var notification = document.querySelector('.mdl-js-snackbar');
                var snackbarData = {
                    message: title + ' was posted!',
                    actionHandler: function(event) {
                        window.location.href = '/blog/' + title;
                    },
                    actionText: "GO",
                    timeout: 10000
                };
                notification.MaterialSnackbar.showSnackbar(snackbarData);
            });
            $(".mdl-textfield__input").val("");
            tinyMCE.activeEditor.setContent('');
            $(".has-danger").hide();
        }
    });
});

