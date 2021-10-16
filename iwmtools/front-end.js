currentTab = $ ("#tab-info");
switching = false;

primaryMap = {};
mergeMap = {};

function processMap(file, map, label, fn) {
    var fr = new FileReader();
    fr.onload = function() {
        Object.assign(map, new IWMMap(fr.result));
        fn();
        updateUI();
    };
    fr.readAsText(file);
    label.textContent = file.name;

}

function updateUI() {
    if (!($.isEmptyObject(primaryMap)) && !($.isEmptyObject(mergeMap))){
        $ ("#merge-button")[0].classList.remove("disabled");
    }
}

function mergeMaps() {
    if (!$ ("#merge-button")[0].classList.contains("disabled")) {
        download("merge.map", merge(primaryMap, mergeMap).serialize())
    }
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
addTooltip($("#merge-button")[0], "Merge and download");