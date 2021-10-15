$ (document).ready(function() {
    currentTab = $ ("#tab-info");
    switching = false;

    $ ("#upload-primary-map")[0].addEventListener('change', function() {
        processPrimaryMap(this);
    });

    function processPrimaryMap(t)
    {
        var fr = new FileReader();
        fr.onload = function() {
            map = new IWMMap(fr.result);
        };
        fr.readAsText(t.files[0]);
        $ ("#primary-file")[0].textContent = t.files[0].name;
    }

    var tabButtons = $ (".tab-button");
    Array.from(tabButtons).forEach(function(tabButton) {
        tabButton.addEventListener('click', function() {
            var button = this;
            if (!switching && !$(button).hasClass("active"))
            {
                $ (".tab-button.active").removeClass("active");
                $ (button).addClass("active");
                switching = true;
                $ (currentTab).fadeOut(150, function() {
                    currentTab = $ ("#tab-" + button.id);
                    $ (currentTab).fadeIn(150);
                    switching = false;
                });
            }
        });
    });

    $ (currentTab).fadeIn(150);
});

