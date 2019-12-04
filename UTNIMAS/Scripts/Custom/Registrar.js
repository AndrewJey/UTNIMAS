function CreateClient() {

    var Client = {
        Id: "",
        primerNombre: $("#primerNombre").val(),
        segundoNombre: $("#segundoNombre").val(),
        primerApellido: $("#primerApellido").val(),
        segundoApellido: $("#segundoApellido").val(),
        Direccion: $("#Direccion").val(),
        Ciudad: $("#Ciudad").val(),
        Distrito: $("#Distrito").val(),
        Canton: $("#Canton").val(),
        Provincia: $("#Provincia").val(),
        TelefonoCasa: $("#TelefonoCasa").val(),
        NumeroCelula: $("#NumeroCelula").val(),
        Email: $("#CORREO").val(),
    }
    if (Client.Email != "", Client.primerNombre != "" ) {
        alert("dd");
    }
    //HTTP_POST('/CLIENTs/Create', Client, function (data) {

    //});


}