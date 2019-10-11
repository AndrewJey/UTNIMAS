function HTTP_POST(url, data, callback) {
    $.ajax({
        type: 'POST',
        url: url,
        data: data
    })
        .done(function (data, textStatus, jqXHR) {
            if (data.Success == false) {
                showError(data);
            }
            else {
                if (callback != undefined) {
                    callback(data);
                }
            }
        })
        .fail(function (xhr, textStatus, errorThrown) {
            showError(xhr.responseText);
        });

}

function HTTP_DELETE(url, callback) {
    $.ajax({
        type: 'DELETE',
        url: url,
    })
        .done(function (response) {
            if (response.Success == false) {
                showError(response);
            }
            else {
                fnHideSpiner();
                if (callback != undefined) {
                    callback(response);
                }
            }
        })
        .fail(function (xhr, textStatus, errorThrown) {
            showError(xhr.responseText);
        });
}

function HTTP_PUT(url, data, callback) {

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        headers: {
            "X-HTTP-Method-Override": "PUT",
        }
    })
        .done(function (response) {
            if (response.Success == false) {
                showError(response);
            } else {
                fnHideSpiner();
                if (callback != undefined) {
                    callback(response);
                }
            }
        })
        .fail(function (xhr, textStatus, errorThrown) {
            showError(xhr.responseText);
        });

}

function HTTP_PATCH(url, data, callback) {
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        headers: {
            "X-HTTP-Method-Override": "PATCH",
        }
    })
        .done(function (response) {
            if (response.Success == false) {
                showError(response);
            } else {
                if (callback != undefined) {
                    callback(response);
                }
            }
        })
        .fail(function (xhr, textStatus, errorThrown) {
            showError(xhr.responseText);
        });

}

function HTTP_GET(url, div_html, callback, data) {

    $.get(url, data, function () {
    })
        .done(function (response) {
            if (response.Success == false) {
                showError(response);
            }
            else {
                if (div_html != undefined) {
                    $("#" + div_html).html(response);
                }
                if (callback != undefined) {
                    callback(response);
                }
            }
        })
        .fail(function (xhr, textStatus, errorThrown) {
            showError(xhr.responseText);
        });

}

function showError(response, callback) {
    console.log(response);

    $("#errorMessage").text(response == undefined ? "There was a error processing the request" : (response.Message == undefined ? response : response.Message));
    $('#toast2').toast('show');
    if (callback != undefined) {
        $("#btn_ModalError").click(function () { callback() });
    }
}

function showSuccess(response, callback) {

    if (response.Success) {

        $('#toastMessager').text(response.Message);
        $('#toast1').toast('show');
        if (callback != undefined) {
            callback();
        }
    }
    else {
        $("#errorMessage").text(response == undefined ? "There was a error processing the request" : (response.Message == undefined ? response : response.Message));
        $('#toast2').toast('show');
        if (callback != undefined) {
            callback();
        }
    }
}
