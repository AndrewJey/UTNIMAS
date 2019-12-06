function sidebarActive() {
    $('#sidebar').toggleClass('active');
    $('#nameUser').toggleClass('nameUserc');
    var icon = document.getElementById('arrow');
    icon.classList.toggle('fa-chevron-left');
    icon.classList.toggle('fa-chevron-right');
    //var image = document.getElementById("imgChange");
    //if (image.src.indexOf("/Content/Images/CLOUDCONNECT.png") != -1) {
    //    image.src = "/Content/Images/ArrowONLY.LG.Transparent.png";
    //} else {
    //    image.src = "/Content/Images/CLOUDCONNECT.png";
    //}

}