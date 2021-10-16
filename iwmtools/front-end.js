function tooltip(el, text) {
    var tooltip = $ (".tooltip")[0];
    el.addEventListener('mouseenter', function() {
        tooltip.innerHTML = "asdf";
    });
}

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
            primaryMap = new IWMMap(fr.result);
            summarize(primaryMap);
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

    function addTooltip(el, text) {
        el.addEventListener('mouseenter', function() {
            $ (".tooltip")[0].innerHTML = text;
        });
        el.addEventListener('mouseleave', function() {
            $ (".tooltip")[0].innerHTML = "";
        })
    }

    addTooltip($("#upload-primary-map-label")[0], "Upload primary map");
    addTooltip($("#info")[0], "Map information");
    addTooltip($("#merge")[0], "Merge two maps");
});

