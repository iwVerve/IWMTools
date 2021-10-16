currentTab = $ ("#tab-info");
switching = false;

primaryMap = {};
mergeMap = {};

function processMap(file, map, label) {
    var fr = new FileReader();
    fr.onload = function() {
        Object.assign(map, new IWMMap(fr.result));
    };
    fr.readAsText(file);
    label.textContent = file.name;
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
addTooltip($("#upload-merge-map-label")[0], "Upload merged map");