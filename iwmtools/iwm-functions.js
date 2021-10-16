function summarize(map)
{
    $ ("#label-name")[0].innerHTML = `Name: ${map.properties.mapName}`;
    $ ("#label-objects")[0].innerHTML = `Objects: ${map.objects.length}`;
    $ ("#label-version")[0].innerHTML = `Version: ${map.properties.version}`;
    $ ("#label-tilesets")[0].innerHTML = `Tilesets: ${map.properties.tileset}, ${map.properties.tileset2}`;
    $ ("#label-spikes")[0].innerHTML = `Spikes: ${map.properties.spikes}, ${map.properties.spikes2}`;
    $ ("#label-background")[0].innerHTML = `Background: ${map.properties.bg}`;
    $ ("#label-size")[0].innerHTML = `Size: ${map.properties.width}x${map.properties.height}`;
    $ ("#label-colors")[0].innerHTML = `Colors: todo`;
    $ ("#label-scroll-mode")[0].innerHTML = `Scroll Mode: ${map.properties.scroll_mode}`;
    $ ("#label-music")[0].innerHTML = `Music: ${map.properties.music}`;
}