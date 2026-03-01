function setWeatherService(value) {
    console.log("The " + value + " box is checked.");
    $.post('/config', {weatherService: value}, function(data){
        console.log(data);
    });
}

function setLightState(checkbox) {
    // var lightId;
    var lightName;
    if (checkbox.checked) {
        // lightId = $(checkbox).attr("value");
        lightName = $(checkbox).attr('name');
        // console.log("Turn the light on. ID is " + lightId);
        $.ajax({
            url: 'https://maker.ifttt.com/trigger/toggle ' + lightName.toLowerCase() + '/with/key/kJcrOl-JvM_-iBmuwbceIZqhsDVT5kWdhDYtSWjgskS',
            type: 'POST',
            dataType: 'jsonp',
            // data: {lightId: lightId},
            success: function(result) {
                return true;
            }
        });
        //For HUE API, but not in production
        // $.ajax({
        //     url: '/lighton',
        //     type: 'PUT',
        //     data: {lightId: lightId},
        //     success: function(result) {
        //         return true;
        //     }
        // });
    } else {
        // lightId = $(checkbox).attr("value");
        lightName = $(checkbox).attr('name');
        // console.log("Turn the light off. ID is " + lightId);
        $.ajax({
            url: 'https://maker.ifttt.com/trigger/toggle ' + lightName.toLowerCase() + '/with/key/kJcrOl-JvM_-iBmuwbceIZqhsDVT5kWdhDYtSWjgskS',
            type: 'POST',
            dataType: 'jsonp',
            // data: {lightId: lightId},
            success: function(result) {
                return true;
            }
        });
        //For HUE API, but not in production
        // $.ajax({
        //     url: '/lightoff',
        //     type: 'PUT',
        //     data: {lightId: lightId},
        //     success: function(result) {
        //         return true;
        //     }
        // });
    }
}

$(document).on('click', 'a.delete', function(e) {
    e.preventDefault(); // does not go through with the link.

    var $this = $(this);

    $.post({
        type: $this.data('method'),
        url: $this.attr('href')
    }).done(function (data) {
        alert('success');
        console.log(data);
    });
});