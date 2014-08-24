/**
 * Created by dvircn on 07/08/14.
 */
var CObjectsHandler = Class({
    $singleton: true,
    objectsById: {},
    preparedObjects: Array(),
    appContainerId: "",
    mainViewId: "",

    addObject: function(object){
        this.objectsById[object.uid()] = object;
    },
    /**
     * Remove object from the DOM and the ObjectsHandler.
     * @param objectId
     */
    removeObject: function(objectId){
        //Remove from the DOM.
        var element = CUtils.element(this.object(objectId).uid());
        element.parentNode.removeChild(element);
        // Remove from ObjectsHandler.
        delete this.objectsById[objectId];
    },
    addPreparedObject: function(object){
        this.preparedObjects.push(object);
    },
    object: function(id){
        return this.objectsById[id];
    },
    getPreparedObjects: function(){
        return this.preparedObjects;
    },
    clearPreparedObjects: function(){
        this.preparedObjects = Array();
    },
    loadObjects: function(objects){
        _.each(objects,function(object){
            var type = object.type; // Get the Object type.
            if (CUtils.isEmpty(type)) return;
            // Try to create object.
            //try {
                this.createObject(type,object);
            //}
            //catch (e){
                //CLog.log("Failed to create object from type: "+type+". Error: "+e);
            //}

        },this);
    },
    createObject: function(type,data){
        var cObject = eval("new C"+type+"(data)"); // Create the object.
        CObjectsHandler.addObject(cObject);
        if (type=="AppContainer") CObjectsHandler.appContainerId = cObject.uid(); // Identify App Container Object.
        if (type=="MainView") CObjectsHandler.mainViewId = cObject.uid(); // Identify Main Object.
        return cObject.uid();
    },
    createFromObject: function(baseObject,data,logic,design){
        var duplicatedObject        = CUtils.clone(baseObject);
        duplicatedObject.id         = CObject.generateID();
        duplicatedObject.uname      = null;
        duplicatedObject.dynamic    = null;
        duplicatedObject.data       = CUtils.mergeJSONs(baseObject.data,data    || {});
        duplicatedObject.logic      = CUtils.mergeJSONs(baseObject.logic,logic  || {});
        duplicatedObject.design     = CUtils.mergeJSONs(baseObject.design,design|| {});
        duplicatedObject.clearLastBuild();

        return duplicatedObject;
    }


});


