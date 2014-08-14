/**
 * Created by dvircn on 06/08/14.
 */

var CLabel = Class(CObject,{
    $statics: {
        DEFAULT_DESIGN: {
            minHeight: 20,
            widthSM: 5,
            widthXS: 10
        },
        DEFAULT_LOGIC: {
        }

    },

    constructor: function(values) {
        if (CUtils.isEmpty(values)) return;
        // Merge Defaults.
        CObject.mergeWithDefaults(values,CLabel);

        // Invoke parent's constructor
        CLabel.$super.call(this, values);
    },


});

