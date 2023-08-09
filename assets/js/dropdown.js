$(document).ready(function () {
   // open/close dropdown menu
    $('#choice-dropdown').click(function () {
        let screenWidth = window.innerWidth;
        $('#choice-dropdown').toggleClass("is-active");
        if (screenWidth < 600) {
            $('#choice-dropdown').addClass("is-up")
        }
    });

    // click on dropdown menu item will save the user's choice as "searchTerms"
    $('#dropdown-menu').on('click', '.dropdown-item', function (event) {
        let searchTerms = $(event.target).text().trim();
        console.log(searchTerms);
    });
})