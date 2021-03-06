/**
 * Created by dvircn on 17/08/14.
 */
var CPageData = Class({
    $singleton: true,
    pagesData: {},
    get: function(name){
        var pagesData = CPageData.pagesData[CPager.currentPage];
        if (!CUtils.isEmpty(pagesData))
            return pagesData[name];
        return null;
    },
    getDeep: function(path){
        var pagesData = CPageData.pagesData[CPager.currentPage];
        if (!CUtils.isEmpty(pagesData))
            return CUtils.deepFind(pagesData,path) || null;
    },
    exist: function(name){
        return !CUtils.isEmpty(CPageData.get(name));
    },
    set: function(key,value){
        // Init if needed.
        if (CUtils.isEmpty(CPageData.pagesData[CPager.currentPage])){
            CPageData.pagesData[CPager.currentPage] = {};
        }
        // Set
        CPageData.pagesData[CPager.currentPage][key] = value;
    },
    setPageData: function(page,data){
        CPageData.pagesData[page] = data;
    }

});
