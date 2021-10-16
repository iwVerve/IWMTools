function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8,"+encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getElementsByTagNameShallow(node, name) {
    var array = [];
    for(const child of node.children) {
        if (child.tagName == name) {
            array.push(child);
        }
    }
    return array;
}

class IWMMap {
    constructor(mapString) {
        if (arguments.length == 1) {
            var parser = new DOMParser();
            var mapXml = parser.parseFromString(mapString, "text/xml");
            var head = mapXml.getElementsByTagName("sfm_map")[0].getElementsByTagName("head")[0];
            var objects = mapXml.getElementsByTagName("sfm_map")[0].getElementsByTagName("objects")[0];
            this.properties = new IWMProperties(head);
            this.getObjects(objects);
        }
        else {
            this.properties = new IWMProperties();
            this.objects = [];
        }
    }

    getObjects(nodeObjects) {
        this.objects = [];
        var objectList = getElementsByTagNameShallow(nodeObjects, "object");
        for(const nodeObject of objectList) {
            this.objects.push(new IWMObject(nodeObject));
        }
    }

    clone = function() {
        var clonedMap = new IWMMap()
        clonedMap.properties = this.properties.clone();
        for (const object of this.objects) {
            clonedMap.objects.push(object.clone())
        }
        return clonedMap;
    }

    serialize = function() {
        this.properties.objects = this.objects.length;
        var str = this.properties.serialize(this);

        var objectsString = "";
        this.objects.forEach(function(object) {
            objectsString += object.serialize(false);
        });
        str += `<objects>${objectsString}</objects>`;

        return `<sfm_map>${str}</sfm_map>`;
    }

    download() {
        download(this.properties.mapName+".map", this.serialize());
    }
}

class IWMProperties {
    constructor(nodeHead) {
        if (arguments.length == 1) {
            this.mapName = nodeHead.getElementsByTagName("name")[0].innerHTML;
            this.version = Number(nodeHead.getElementsByTagName("version")[0].innerHTML);
            this.tileset = Number(nodeHead.getElementsByTagName("tileset")[0].innerHTML);
            this.tileset2 = Number(nodeHead.getElementsByTagName("tileset2")[0].innerHTML);
            this.bg = Number(nodeHead.getElementsByTagName("bg")[0].innerHTML);
            this.spikes = Number(nodeHead.getElementsByTagName("spikes")[0].innerHTML);
            this.spikes2 = Number(nodeHead.getElementsByTagName("spikes2")[0].innerHTML);
            this.width = Number(nodeHead.getElementsByTagName("width")[0].innerHTML);
            this.height = Number(nodeHead.getElementsByTagName("height")[0].innerHTML);
            this.colors = nodeHead.getElementsByTagName("colors")[0].innerHTML;
            this.scroll_mode = Number(nodeHead.getElementsByTagName("scroll_mode")[0].innerHTML);
            this.music = Number(nodeHead.getElementsByTagName("music")[0].innerHTML);
        }
        else {
            this.mapName = "";
            this.version = 0;
            this.tileset = 0;
            this.tileset2 = 0;
            this.bg = 0;
            this.spikes = 0;
            this.spikes2 = 0;
            this.width = 0;
            this.height = 0;
            this.colors = "";
            this.scroll_mode = 0;
            this.music = 0;
        }
    }

    clone() {
        var clonedProperties = new IWMProperties();
        clonedProperties.mapName = this.mapName; clonedProperties.version = this.version;
        clonedProperties.tileset = this.tileset; clonedProperties.tileset2 = this.tileset2;
        clonedProperties.bg = this.bg; clonedProperties.spikes = this.spikes;
        clonedProperties.spikes2 = this.spikes2; clonedProperties.width = this.width;
        clonedProperties.height = this.height; clonedProperties.colors = this.colors;
        clonedProperties.scroll_mode = this.scroll_mode; clonedProperties.music = this.music;
        return clonedProperties;
    }

    serialize(map) {
        var str =
        `<name>${this.mapName}</name>` +
        `<version>${this.version}</version>` +
        `<tileset>${this.tileset}</tileset>` +
        `<tileset2>${this.tileset2}</tileset2>` +
        `<bg>${this.bg}</bg>` +
        `<spikes>${this.spikes}</spikes>` +
        `<spikes2>${this.spikes2}</spikes2>` +
        `<width>${this.width}</width>` +
        `<height>${this.height}</height>` +
        `<colors>${this.colors}</colors>` +
        `<scroll_mode>${this.scroll_mode}</scroll_mode>`+
        `<music>${this.music}</music>`+
        `<num_objects>${map.objects.length}</num_objects>`;
        return `<head>${str}</head>`;
    }
}

class IWMObject {
    constructor() {
        if (arguments.length == 1) {
            var nodeObject = arguments[0];
            this.type = Number(nodeObject.getAttribute("type"));
            this.x = Number(nodeObject.getAttribute("x"));
            this.y = Number(nodeObject.getAttribute("y"));
            this.slot = Number(nodeObject.getAttribute("slot"));
            this.sprite_angle = Number(nodeObject.getAttribute("sprite_angle"));
            this.getParams(nodeObject);
            this.getEvents(nodeObject);
            this.getChildren(nodeObject);
            var nameElements = nodeObject.getElementsByTagName("name");
            if (nameElements.length > 0) {
                this.objName = nodeObject.getElementsByTagName("name")[0].innerHTML;
            }
            else {
                this.objName = null;
            }
        }
        else
        {
            this.type = arguments[0];
            this.x = arguments[1];
            this.y = arguments[2];
            this.slot = 0;
            this.sprite_angle = null;
            this.params = [];
            this.events = [];
            this.children = [];
            this.objName = null;
        }
    }

    getParams(nodeObject) {
        this.params = [];
        var paramList = getElementsByTagNameShallow(nodeObject, "param");
        for (const nodeParam of paramList) {
            this.params.push(new IWMParam(nodeParam));
        }
    }

    getEvents(nodeObject) {
        this.events = [];
        var eventList = getElementsByTagNameShallow(nodeObject, "event");
        for (const nodeEvent of eventList) {
            this.events.push(new IWMEvent(nodeEvent));
        }
    }

    getChildren(nodeObject) {
        this.children = [];
        var childrenList = getElementsByTagNameShallow(nodeObject, "obj");
        for (const nodeChild of childrenList) {
            this.children.push(new IWMObject(nodeChild));
        }
    }

    clone() {
        var clonedObject = new IWMObject(this.type, this.x, this.y)
        clonedObject.slot = this.slot;
        clonedObject.sprite_angle = this.sprite_angle;
        clonedObject.objName = this.objName;
        for (const param of this.params) {
            clonedObject.params.push(param.clone());
        }
        for (const evnt of this.events) {
            clonedObject.events.push(evnt.clone());
        }
        for (const child of this.children) {
            clonedObject.children.push(child.clone());
        }
        return clonedObject;
    }

    serialize(isChild) {
        var str = (!isChild) ? "<object" : "<obj";
        str += ` type="${this.type}"`;
        str += ` x="${this.x}"`;
        str += ` y="${this.y}"`;
        if (isChild) {
            str += ` slot="${this.slot}"`;
        }
        if (this.sprite_angle != null) {
            str += ` sprite_angle="${this.sprite_angle}"`;
        }
        str += ">";
        
        for (const evnt of this.events) {
            str += evnt.serialize();
        }
        for (const param of this.params) {
            str += param.serialize();
        }
        for (const object of this.children) {
            str += object.serialize(true);
        }
        if (this.objName != null) {
            str += `<name>${this.objName}</name>`;
        }
        str += (!isChild) ? "</object>" : "</obj>";

        return str;
    }
}

class IWMEvent {
    constructor() {
        if (typeof(arguments[0]) == "number")
        {
            this.eventIndex = arguments[0];
            this.events = [];
            this.params = [];
        }
        else
        {
            var nodeEvent = arguments[0];
            this.eventIndex = Number(nodeEvent.getAttribute("eventIndex"));
            this.getEvents(nodeEvent);
            this.getParams(nodeEvent);
        }
    }

    getEvents(nodeEvent) {
        this.events = [];
        var eventList = getElementsByTagNameShallow(nodeEvent, "event");
        for (const nodeEvent of eventList) {
            this.events.push(new IWMEvent(nodeEvent));
        }
    }

    getParams(nodeEvent) {
        this.params = [];
        var paramList = getElementsByTagNameShallow(nodeEvent, "param");
        for (const nodeParam of paramList) {
            this.params.push(new IWMParam(nodeParam));
        }
    }

    clone() {
        var clonedEvent = new IWMEvent(this.eventIndex);
        for (const evnt of this.events) {
            clonedEvent.events.push(evnt.clone());
        }
        for (const param of this.params) {
            clonedEvent.params.push(param.clone());
        }
        return clonedEvent;
    }

    serialize() {
        var str = `<event eventIndex="${this.eventIndex}">`;
        for (const param of this.params) {
            str += param.serialize();
        }
        for (const evnt of this.events) {
            str += evnt.serialize();
        }
        str += "</event>";
        return str;
    }
}

class IWMParam {
    constructor() {
        if (arguments.length == 1){
            var nodeParam = arguments[0];
            this.key = nodeParam.getAttribute("key");
            this.val = nodeParam.getAttribute("val");
            if (!isNaN(Number(this.val)) && isFinite(Number(this.val))) {
                this.val = Number(this.val);
            }
        }
        else {
            this.key = arguments[0];
            this.val = arguments[1];
        }
    }

    clone() {
        return new IWMParam(this.key, this.val);
    }

    serialize() {
        return `<param key="${this.key}" val="${this.val}"/>`;
    }
}