/**
 * Created by dvircn on 16/08/14.
 */
var CDialog = Class(CContainer,{
    $statics: {
        DEFAULT_DESIGN: {
            classes:'cDialog',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            minHeight: 100,
            display: 'hidden'


        },
        DEFAULT_LOGIC: {
        },
        alert: function(title,text,buttonText,data,design){
            data                = data || {};
            if (!CUtils.isEmpty(title))
                data.title      = title;
            if (!CUtils.isEmpty(text))
                data.textContent= text;
            if (!CUtils.isEmpty(buttonText))
                data.cancelText = buttonText;

            design              = design || {};

            var newDialog = CObjectsHandler.createObject('Dialog',{data: data,design: design });

            CObjectsHandler.object(CObjectsHandler.appContainerId).appendChild(newDialog);
            CObjectsHandler.object(newDialog).show();
        },
        showDialog: function(parentId){
            if (CUtils.isEmpty(parentId))
                parentId = CObjectsHandler.appContainerId;

            var newDialog = CObjectsHandler.createObject('Dialog',{
                data: {
                    title: 'Confirmation',
                    //topView: 'main-button',
                    textContent: 'Always do good things. Good things lead to better society, happiness, health and freedom.',
                    list: ['dvir','cohen','tal','levi','cohen','tal','levi','cohen','tal','levi','cohen','tal','levi','cohen','tal','levi','cohen','tal','levi','cohen','tal','levi'],
                    chooseCallback: function(index,value){
                        CLog.dlog(index+") "+value);
                    },
                    listCallbacks:[function(){CLog.dlog('Dvir Clicked')},
                        function(){CLog.dlog('Cohen Clicked')}],
                    hideOnListChoose: false,
                    cancelText: 'Cancel',
                    cancelCallback: function() { CLog.dlog('Cancel Callback')},
                    confirmText: 'Confirm',
                    confirmCallback: function() { CLog.dlog('Confirm Callback')},
                    extraText: 'Extra Button',
                    extraCallback: function() { CLog.dlog('Extra Callback')}

                },
                design: {
                    width: 400,
                    height:'auto'
                }
            });

            CObjectsHandler.object(parentId).appendChild(newDialog);
            CObjectsHandler.object(newDialog).show();
            var endLoadObjects  = (new  Date()).getTime();
        }
    },

    constructor: function(values) {
        if (CUtils.isEmpty(values)) return;

        values.design           = values.design || {};
        values.design.width     = values.design.width || 400;
        values.design.height    = 'auto';

        // Container design.
        var containerDesign = CUtils.clone(values.design);
        values.design = {};
        // Merge Defaults.
        CObject.mergeWithDefaults(values,CDialog);
        // Invoke parent's constructor
        CDialog.$super.call(this, values);

        // Set defaults
        this.data.animation         = this.data.animation           || 'fade';
        this.data.animationDuration = this.data.animationDuration   || 300;
        this.data.topView           = this.data.topView             || CObjectsHandler.appContainerId;
        this.data.destroyOnhide     = this.data.destroyOnhide===false? false : true;
        this.data.hideOnOutClick    = this.data.hideOnOutClick===false? false : true;
        this.data.titleAlign        = this.data.titleAlign          || 'center';
        this.data.textContentAlign  = this.data.textContentAlign    || CAppConfig.get('textAlign') || 'center';
        this.data.textContent       = this.data.textContent         || '';
        this.data.textContentAlign  = this.data.textContentAlign    || CAppConfig.get('textAlign') || 'center';
        this.data.objectContent     = this.data.objectContent       || '';
        this.data.list              = this.data.list                || [];
        this.data.iconsList         = this.data.iconsList           || [];
        this.data.iconsAlign        = this.data.iconsAlign          || CAppConfig.get('textAlign') || 'left';
        this.data.listCallbacks     = this.data.listCallbacks       || [];
        this.data.chooseCallback    = this.data.chooseCallback      || function(index,value){};
        this.data.hideOnListChoose  = this.data.hideOnListChoose===false? false : true;
        this.data.cancelCallOnHide  = this.data.cancelCallOnHide===false? false : true;
        this.data.cancelText        = this.data.cancelText          || '';
        this.data.cancelCallback    = this.data.cancelCallback      || function(){};
        this.data.confirmText       = this.data.confirmText         || '';
        this.data.confirmCallback   = this.data.confirmCallback     || function(){};
        this.data.extraText         = this.data.extraText           || '';
        this.data.extraCallback     = this.data.extraCallback       || function(){};
        this.data.dialogColor       = this.data.dialogColor         || 'Aqua';
        this.data.contentColor      = this.data.contentColor        || 'Black';

        // Init function.
        var dialog = this;
        this.logic.init = function(){ dialog.onResize(); }
        // Set destroy on hide handler.
        this.setDestroyOnHideHandler();
        // Create sub views.
        this.createContainerAndOverlay(containerDesign);
        // Create title view if needed.
        this.createTitle();
        this.createContainer();
        this.createContent();
        this.createList();
        this.createButtons();
        // Set Position.
        this.setPositionHandler();

    },
    hide: function(callback){
        // Check if need to set cancel callback\use the given callback
        // or do not call callback - empty function;
        if (CUtils.isEmpty(callback) && !CUtils.isEmpty(this.data.cancelCallback)
            && this.data.cancelCallOnHide === true) {
            callback = this.data.cancelCallback;
        }
        else if (CUtils.isEmpty(callback)) {
            callback = function(){};
        }

        callback();
        CAnimations.hide(this.uid());
    },
    show: function(){
        CAnimations.show(this.uid());
    },
    switchDialog: function(){
        CAnimations.hideOrShow(this.uid());
    },
    setDestroyOnHideHandler: function(){
        var object = this;
        if (this.data.destroyOnhide){
            this.data.onAnimHideComplete = function(){
                object.removeSelf();
                CUtils.unbindEvent(window,'resize',object.onResize);
            };
        }
    },
    createContainerAndOverlay: function(containerDesign){
        var dialog = this;
        var overlayOnClick = this.data.hideOnOutClick===true?
            function(){ dialog.hide();} : function(){};

        // Create Overlay.
        this.dialogOverlay = CObjectsHandler.createObject('Object',{
            design: { classes: 'cDialogOverlay' },
            logic: { doStopPropagation: true,
                onClick: overlayOnClick
            }
        });
        // Create Dialog Container.
        this.dialogContainer = CObjectsHandler.createObject('DialogContainer',{
            data: { childs: this.data.childs || []},
            design: containerDesign
        });
        // Add to Childs array.
        this.data.childs = [this.dialogContainer,this.dialogOverlay];

    },
    createTitle: function(){
        if (CUtils.isEmpty(this.data.title))
            return;
        // Create Title.
        this.dialogTitle = CObjectsHandler.createObject('Object',{
            design: {
                color: {color:this.data.dialogColor,level:4},
                borderColor: {color:this.data.dialogColor,level:4},
                border: { bottom: 2},
                width:'100%',
                height: 45,
                fontSize:19,
                fontStyle: ['bold'],
                textAlign: this.data.titleAlign
            },
            logic: {
                text: this.data.title
            }
        });

        CObjectsHandler.object(this.dialogContainer).data.childs.push(this.dialogTitle);
    },
    createContainer: function(){
        if (CUtils.isEmpty(this.data.title))
            return;
        // Create container.
        this.contentContainer = CObjectsHandler.createObject('Container',{
            design: {
                width:'100%',
                height: 'auto',
                marginTop: 4,
                overflow: 'scrollable',
                paddingTop: 10,
                paddingBottom: 10,
                boxSizing: 'borderBox'
            }
        });

        CObjectsHandler.object(this.dialogContainer).data.childs.push(this.contentContainer);

    },
    appendContent: function(contentId) {
        CObjectsHandler.object(this.contentContainer).data.childs.push(contentId);
    },
    createContent: function () {
        var contentId = null;
        if (!CUtils.isEmpty(this.data.objectContent))
            contentId = this.data.objectContent;
        else if (!CUtils.isEmpty(this.data.textContent)){
            contentId = CObjectsHandler.createObject('Object',{
                design: {
                    color: {color:this.data.contentColor,level:4},
                    width:'95%',
                    height: 'auto',
                    fontSize:17,
                    fontStyle: ['bold'],
                    margin: 'centered',
                    textAlign: this.data.textContentAlign
                },
                logic: {
                    text: this.data.textContent
                }
            });
        }

        if (contentId!=null)
            this.appendContent(contentId);
    },
    createList: function () {
        var list            = this.data.list,
            iconsList       = this.data.iconsList,
            listCallbacks   = this.data.listCallbacks,
            chooseCallback  = this.data.chooseCallback,
            actualCallbacks = [],
            dialog          = this;

        // Allow create icon only list.
        while (list.length < iconsList.length){
            list.push('');
        }

        // Set up callbacks.
        for (var i=0;i<list.length;i++) {
            var index = i;
            var text = list[index] || '';
            var icon = index < iconsList.length ? iconsList[index] : '';

            var listCallback = index < listCallbacks.length ?
                listCallbacks[index] : function(){};
            var chosenCallback = !CUtils.isEmpty(chooseCallback) ? function(index,text) {
                chooseCallback(index,text);
            } : function(){};

            var hideOnChoose = this.data.hideOnListChoose === true ? function(){
                dialog.hide();
            } : function(){};

            this.createListElement(index,text,icon,listCallback,chosenCallback,hideOnChoose);
        }



    },
    createListElement: function (index,text,icon,listCallback,chosenCallback,hideOnChoose) {
        var design = {
            color: {color:this.data.contentColor, level:4},
            width:'100%',
            height: 'auto',
            boxSizing: 'borderBox',
            fontSize:17,
            fontStyle: ['bold'],
            margin: 'centered',
            paddingTop:9,
            paddingBottom:9,
            paddingRight:7,
            paddingLeft:7,
            border: {bottom:1},
            borderColor: { color: 'Gray',level:1},
            textAlign: this.data.textContentAlign,
            active: { bgColor: { color: this.data.dialogColor,level:4}, color: {color:'White'}}
        };

        // Set icon design
        if (!CUtils.isEmpty(icon)) {
            var iconDesign = 'iconOnly';
            if (!CUtils.isEmpty(text)){
                if (this.data.iconsAlign=='left')
                    iconDesign = 'iconLeft';
                if (this.data.iconsAlign=='right')
                    iconDesign = 'iconRight';
            }
            design[iconDesign] = icon;
        }


        var contentId = CObjectsHandler.createObject('Button',{
                design: design,
                logic: {
                    text: text,
                    onClick: function(){
                        listCallback();
                        chosenCallback(index,text);
                        hideOnChoose();
                    }
                }
            });

        this.appendContent(contentId);
    },
    createButtons: function () {
        var countButtons = 0;
        if (!CUtils.isEmpty(this.data.cancelText))  countButtons++;
        if (!CUtils.isEmpty(this.data.confirmText)) countButtons++;
        if (!CUtils.isEmpty(this.data.extraText))   countButtons++;

        // Create Buttons container.
        if (countButtons===0)
            return;
         // Create buttons container.
        this.buttonsContainer = CObjectsHandler.createObject('Container',{
            design: {
                borderColor: {color:this.data.dialogColor,level:4},
                border: { top: 1},
                marginTop: 1,
                width:'100%',
                height: 'auto'
            }
        });

        CObjectsHandler.object(this.dialogContainer).data.childs.push(this.buttonsContainer);

        // Create all buttons
        var currentButton = 0;
        if (!CUtils.isEmpty(this.data.cancelText)) {
            this.createAndAddButton(this,currentButton,countButtons,this.data.cancelText,  this.data.cancelCallback);
            currentButton++;
        }
        if (!CUtils.isEmpty(this.data.confirmText)) {
            this.createAndAddButton(this,currentButton,countButtons,this.data.confirmText, this.data.confirmCallback);
            currentButton++;
        }
        if (!CUtils.isEmpty(this.data.extraText)) {
            this.createAndAddButton(this,currentButton,countButtons,this.data.extraText,   this.data.extraCallback);
        }

    },
    createAndAddButton: function(dialog,currentButton,countButtons,text,callback){
        var design = {
            color: {color:this.data.dialogColor, level:4},
            width:'100%',
            height: 'auto',
            boxSizing: 'borderBox',
            fontSize:18,
            fontStyle: ['bold'],
            margin: 'centered',
            display: 'inlineBlock',
            paddingTop:14,
            paddingBottom:14,
            borderColor: { color: this.data.dialogColor,level:4},
            textAlign: 'center',
            active: { bgColor: { color: this.data.dialogColor,level:4}, color: {color:'White'}}
        };

        // Set Borders.
        if (currentButton===0 && countButtons>1/**/)
            design.border = {right:1}
        if (currentButton===2)
            design.border = {top:1}
        // Change width if needed.
        if (currentButton<2 && countButtons>1)
            design.width = '50%'

        var contentId = CObjectsHandler.createObject('Button',{
            design: design,
            logic: {
                text: text,
                onClick: function(){
                    dialog.hide(callback);
                }
            }
        });

        // Add to container.
        CObjectsHandler.object(this.buttonsContainer).data.childs.push(contentId);

    },
    setPositionHandler: function () {
        var dialog = this;
        this.onResize = function(){
            if (CUtils.isEmpty(CUtils.element(dialog.dialogContainer)))
                return;

            var container           = CUtils.element(dialog.dialogContainer);
            var topView             = CUtils.element(dialog.data.topView);
            var containerRect       = container.getBoundingClientRect();
            var containerWidth      = containerRect.width;
            var topViewRect         = topView.getBoundingClientRect();
            var topViewWidth        = topViewRect.width;
            var topViewLeft         = topViewRect.left;
            var windowSize          = CUtils.wndsize();
            var windowWidth         = windowSize.width;

            var containerMaxHeight = windowSize.height;
            if (dialog.data.topView===CObjectsHandler.appContainerId){
                var top = ((windowSize.height*0.7-containerRect.height)/2);
                if (top<0)  top = CAppConfig.get('headerSize') || 40;
                container.style.top = top+'px';
                containerMaxHeight = (windowSize.height-70);
            }
            else {
                var distanceFromBottom = (windowSize.height-(topViewRect.top+topViewRect.height));
                if (distanceFromBottom < 100 ){
                    container.style.top = topViewRect.top-containerRect.height+'px';
                    containerMaxHeight = (topViewRect.top-10);
                }
                else {
                    containerMaxHeight = (windowSize.height-(topViewRect.top+topViewRect.height)-10);
                    container.style.maxHeight =
                    container.style.top = (topViewRect.top+topViewRect.height)+'px';
                }
            }

            container.style.maxHeight = containerMaxHeight+'px';


            var right = (windowWidth-(topViewLeft+topViewWidth) + (topViewWidth-containerWidth)/2 );

            // Check bounds.
            if (right<1)
                right = 1;

            if (right >= (windowWidth-containerRect.width) )
                right = windowWidth-containerRect.width-1;

            container.style.right = right + 'px';

            // Set Content max height.
            if (CUtils.isEmpty(dialog.contentContainer))
                return;

            var contentContainer    = CUtils.element(dialog.contentContainer);
            var contentMaxHeight = containerMaxHeight;
            var siblings = CUtils.element(dialog.contentContainer).parentNode.children;

            _.each(siblings,function(node){
                if (node.id === dialog.contentContainer)
                    return;
                contentMaxHeight -= node.getBoundingClientRect().height;
            },this);

            contentContainer.style.maxHeight = (contentMaxHeight-5)+'px';

        };
        window.addEventListener('resize',this.onResize);
    }


});


