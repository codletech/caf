/**
 * Created by dvircn on 22/08/14.
 */
var CTemplator = Class({
    $singleton: true,
    hiddenClass: 'displayNone',
    applyDynamic: function(object) {
        // Do not re-initiate
        if (this.dynamicApplied(object.uid()))
            return;

        object.data.template = object.data.template || {};

        if (object.data.template.autoLoad === true)
            this.load(object.uid());

        object.data.template.applied = true;
    },
    dynamicApplied: function(objectId){
        return CObjectsHandler.object(objectId).data.template.applied===true;
    },
    objectHasDynamic: function(objectId) {
        var object = CObjectsHandler.object(objectId);
        return !CUtils.isEmpty(object.logic.template) && object.logic.template===true;
    },
    duplicateWithData: function (object, data, onFinish, reset, preventRebuild) {
        if (!CUtils.isArray(data)) // Convert to Array
            data = [data];

        // Remove All Previous duplicates.
        if (reset===true){
            CTemplator.removeDuplicates(object.uid(),false);
            object.data.template.containerToData = {};
        }
        // For each row in data.
        _.each(data,function(currentData){
            // Create container.
            var templateData = object.data.template;
            var containerData   = CUtils.clone(templateData.container);
            containerData.data  = CUtils.mergeJSONs(containerData.data,currentData.data     ||currentData);
            containerData.design.display = 'inline';
            // On item click listener.
            var position = templateData.duplicates.length;
            var onItemClick = CTemplator.createItemOnClick(position,
                templateData.callback,templateData.callbacks[position] || function(){});

            var containerId = CObjectsHandler.createObject(containerData.type,containerData);
            templateData.duplicates.push(containerId);
            var container   = CObjectsHandler.object(containerId);
            // For each abstract object in the template object.
            _.each(templateData.objects,function(abstractObject){
                var logic = currentData.logic||{};
                logic.onTemplateElementClick = onItemClick;
                var duplicateId = CObjectsHandler.createFromTemplateObject(abstractObject,
                    currentData.data||{},logic,currentData.design||{});
                container.appendChild(duplicateId);
            },this);

            // Map container to data.
            object.data.template.containerToData[containerId] = currentData;
        },this);
        object.appendChilds(object.data.template.duplicates);

        if (preventRebuild !== true)
            object.rebuild(onFinish);
    },
    createItemOnClick: function(index,callback,callbacksCallback){
        return function() {
            callbacksCallback();
            callback(index);
        };
    },
    removeDuplicates: function(objectId,rebuild){
        var object          = CObjectsHandler.object(objectId);
        // Remove All Previous duplicates.
        object.removeChilds(object.data.template.duplicates);
        object.data.template.duplicates = [];
        if (rebuild === true)
            object.rebuild();
    },
    // Currently Not Used
    loadDataToObject: function (object, data) {
        object.data     = CUtils.mergeJSONs(object.data,data.data);
        object.logic    = CUtils.mergeJSONs(object.logic,data.logic);
        object.design   = CUtils.mergeJSONs(object.design,data.design);
        CBuilder.buildFromObject(object.uid());
    },
    loadObjectWithData: function (objectId, data, onFinish, reset, preventRebuild) {
        var object = CObjectsHandler.object(objectId);
        if (CUtils.isEmpty(object)) // Case that objectId is actually object.
            object = objectId;
        this.duplicateWithData(object,data, onFinish, reset, preventRebuild);
    },
    loadObjectWithDataNoRebuild: function (objectId, data, reset) {
        this.loadObjectWithData(objectId,data, null, reset, true);
    },
    getDuplicates: function (objectId) {
        if (CTemplator.dynamicApplied(objectId))
            return CObjectsHandler.object(objectId).template.duplicates||[];
    },
    lastDuplicate: function (objectId) {
        if (!CTemplator.dynamicApplied(objectId))
            return null;
        var duplicates = CTemplator.getDuplicates(objectId);
        return duplicates[duplicates.length-1];

    },
    duplicateAtPosition: function (objectId,position) {
        if (!CTemplator.dynamicApplied(objectId))
            return null;
        var duplicates = CTemplator.getDuplicates(objectId);
        return duplicates[position];

    },
    load: function(objectId, queryData, onFinish, reset) {
        var object = CObjectsHandler.object(objectId);

        object.showLoading();

        // Do not rebuild again.
        if (object.data.template.loaded === true && !CUtils.equals(queryData,object.data.template.queryData))
            return;

        object.data.template.queryData = queryData;

        // Request.
        CNetwork.request(object.data.template.url,object.data.template.queryData,
            function(retrievedData){
                CTemplator.loadObjectWithData(objectId, retrievedData, onFinish, reset);
                object.stopLoading();
        });

    }

});


