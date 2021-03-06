/**
 * Created by dvircn on 17/08/14.
 */
var CDom = Class({
    $singleton: true,

    exists: function(id){
        return !CUtils.isEmpty(CUtils.element(id));
    },
    children: function(id){
        return CUtils.element(id).children;
    },
    childrenCount: function(id){
        return CUtils.element(id).children.length;
    },
    hasChildren: function(id){
        return CUtils.element(id).children.length > 0;
    },
    removeAllChildren: function(id){
        var container = CUtils.element(id);
        if (container)
            while (container.firstChild) container.removeChild(container.firstChild);
    },
    removeAllObjectsChildren: function(id){
        var container = CUtils.element(id);
        if (!container) return;

        var children = [];
        _.each(container.children,function(childElm){
            children.push(childElm.id);
        },this);

        _.each(children,function(childId){
            if (!CUtils.isEmpty(CObjectsHandler.object(childId)))
                container.removeChild(CUtils.element(childId));
        },this);

    },
    indexInParent: function(id){
        var node = CUtils.element(id);
        return Array.prototype.indexOf.call(node.parentNode.children, node);
    },
    addChild: function(parentId,viewStr){
        var node = CUtils.element(parentId);
        node.insertAdjacentHTML('beforeend',viewStr);
    },
    removeFromDOM: function(nodeId){
        var node = CUtils.element(nodeId);
        if (!CUtils.isEmpty(node) && !CUtils.isEmpty(node.parentElement))
            node.parentElement.removeChild(node);
    },
    /**
     * Move node to index and push all other nodes forward.
     * @param nodeId
     * @param index
     */
    moveToIndex: function(nodeId, index){
        // Check if already in index
        var currentIndex = this.indexInParent(nodeId);
        if (currentIndex===index)
            return;
        var beforeIndex = index+1;
        var node = CUtils.element(nodeId);
        node.parentNode.insertBefore(node,node.parentNode.children[beforeIndex]);
        //CLog.dlog(currentIndex+" "+index+" "+this.indexInParent(nodeId));
    }

});
