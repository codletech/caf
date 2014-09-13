var app =
{
    initialize: function()
    {
        var appContainer = {   uname:  'app-container', type:   'AppContainer',
            data: {  childs: ['side-menu','main-view','drop-down-menu'] }
        };
        var sideMenu = {   uname:  'side-menu', type:   'SideMenu',
            data: { leftContainer: 'side-menu-left-container', rightContainer:'side-menu-right-container' }
        }
        var sideMenuLeftContainer = {uname:'side-menu-left-container',type:'Container',
            data: {childs: []}
        };
        var sideMenuRightContainer = {uname:'side-menu-right-container',type:'Container',
            data: {childs: []}
        };
        var mainView = {   uname:  'main-view', type:   'MainView',
            data: {  childs: ['header','content','footer'] }
        };
        var header = {   uname:  'header', type:   'Header',
            data: {
                left: ['header-button-left-0','header-button-back'],
                right: ['header-button-right-0','header-button-right-1']
            }
        };
        var footer = {   uname:  'footer', type:   'Footer'
        };
        var content = {   uname:  'content', type:   'Content',
            data: {  childs: ['main-page','form-page','category-page','tabs-page'] }
        };
        var mainPage = {   uname:  'main-page', type:   'Page',
            data: {  childs: ['to-tabs-button','to-category-button','to-category-dvir-button','main-button','main-reload-dynamic','dynamic-buttons','main-gallery'],
                page: {
                    name: '',
                    title: 'Main',
                    onLoad: function() {}
                }
            },
            logic: { page: true }
        };
        var formPage = {   uname:  'form-page', type:   'Page',
            data: {  childs: ['form'],
                page: {
                    name: 'form',
                    title: 'Form',
                    onLoad: function() {}
                }
            },
            logic: { page: true }
        };
        var tabsPage = {   uname:  'tabs-page', type:   'Page',
            data: {  childs: ['tabber'],
                page: {
                    name: 'tabs',
                    title: 'Tabs',
                    onLoad: function() {}
                }
            },
            logic: { page: true }
        };
        var categoryPage = {   uname:  'category-page',type:   'DynamicPage',
            data: {
                childs: [],
                page: {
                    name: 'category',
                    title: 'Category Page',
                    onLoad: function(params) {CLog.dlog(params);}
                },
                abstractObjects:[
                    {
                        type:   'Label',
                        design: { height:40, bgColor:{color:'Red',level:4},widthSM: 10, widthXS: 10,marginRight:1, marginLeft:1, marginTop:1, round: 2,
                            active: { bgColor:{color:'Red',level:6} },
                            activeRemove: {bgColor:{color:'Red',level:4}}
                        },
                        logic: { text: "Title: #.data.category" }
                    }
                ]
            },
            logic: {
                dynamic:{},
                page: true
            }
        };

        var mainViewReloadDynamic = {   uname:  'main-reload-dynamic', type:   'Button',
            design: { height:40, bgColor:{color:'Olive',level:4},widthSM: 5, widthXS: 10, marginRight:1, marginLeft:1, marginTop:1, round: 2,
                active: { bgColor:{color:'Olive',level:6} }},
            logic: {
                text: "Reload",
                buttonReloadDynamic: {object: 'dynamic-buttons', reset: true, queryData: {} }
            }
        };
        var toTabsButton = {   uname:  'to-tabs-button', type:   'Button',
            design: { height:40, bgColor:{color:'Maroon',level:4},widthSM: 10, widthXS: 10,marginRight:1, marginLeft:1, marginTop:1, round: 2,
                active: { bgColor:{color:'Maroon',level:6} }
            },
            logic: {
                text:'<i class="flaticon-airplane49"></i>Tabs',
                link: {
                    path: 'tabs',
                    data: {}
                }
            }
        }
        var toCategoryButton = {   uname:  'to-category-button', type:   'Button',
            design: { height:40, bgColor:{color:'Lime',level:4},widthSM: 10, widthXS: 10,marginRight:1, marginLeft:1, marginTop:1, round: 2,
                active: { bgColor:{color:'Lime',level:6} }
            },
            logic: {
                text:'Category',
                link: {
                    path: 'category',
                    data: {}
                }
            }
        }
        var toCategoryDvirButton = {   uname:  'to-category-dvir-button', type:   'Button',
            design: { height:40, bgColor:{color:'Lime',level:4},widthSM: 10, widthXS: 10,marginRight:1, marginLeft:1, marginTop:1, round: 2,
                active: { bgColor:{color:'Lime',level:6} }
            },
            logic: {
                text:'Category Dvir',
                link: {
                    path: 'category/dvir',
                    data: {}
                }
            }
        }
        var mainViewButton = {   uname:  'main-button', type:   'Button',
            design: { height:40, bgColor:{color:'Maroon',level:4},widthSM: 5, widthXS: 10,marginRight:1, marginLeft:1, marginTop:1, round: 2,
                active: { bgColor:{color:'Maroon',level:6} }
            },
            logic: { text: "Show Dialog",
                onClick: function(){
                    CDialog.showDialog({
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
                    });
                }
            }
        };
        var headerButtonRight0 = {   uname:  'header-button-right-0', type:   'Button',
            design: { bgColor:{color:'Red',level:4},
                active: { bgColor:{color:'Red',level:6} }
            },
            logic: { text: "dm",
                onClick: function(){
                    CLog.log('Button Clicked');
                },
                dialogSwitch: 'drop-down-menu'
            }
        };
        var dropDownMenu = {   uname:  'drop-down-menu', type:   'Dialog',
            data: {
                topView: 'header-button-right-0',
                list: ['dvir','cohen','tal','levi','cohen','tal levi the very very very very very very very very man','levi','cohen'],
                chooseCallback: function(index,value){
                    CLog.dlog(index+") "+value);
                },
                listCallbacks:[function(){CLog.dlog('Dvir Clicked')},
                    function(){CLog.dlog('Cohen Clicked')}],
                dialogColor: {color: 'Blue', level: 4},
                listBorderColor: {color: 'Gray', level: 6},
                contentColor: {color: 'White'},
                bgColor: {color:'Gray', level: 8},
                dialogWidth: 250,
                destroyOnHide: false
            }
        };
        var headerButtonRight1 = {   uname:  'header-button-right-1', type:   'Button',
            design: { bgColor:{color:'Orange',level:4},
                active: { bgColor:{color:'Orange',level:6} }
            },
            logic: { text: "Form",/*
                onClick: function(){
                    CLog.log('Button Clicked');
                },*/
                link: {
                    path: 'form',
                    data: {}
                }
            }
        };
        var headerButtonLeft0 = {   uname:  'header-button-left-0', type:   'Button',
            design: { bgColor:{color:'Red',level:4},
                active: { bgColor:{color:'Red',level:6} }
            },
            logic: { text: "sm",
                sideMenuSwitch: 'left'
            }
        };
        var headerBackButton = {   uname:  'header-button-back', type:   'Button',
            design: { bgColor:{color:'Purple',level:4},
                active: { bgColor:{color:'Purple',level:6} }
            },
            logic: {
                text: "bk",
                backButton: true
            }
        };

        var form = { uname: 'form', type: 'Form',
            data: { inputs: ['form-input-name','form-input-phone'],
                    childs: ['form-input-name','form-input-phone',
                            'form-submit-button','form-sent-to-url-button',
                            'form-save-to-local-storage-button','form-clear-button'],
                    onSubmit: function(values) { CLog.log(values); }
            },
            design: { widthSM: 5,widthXS: 10,padding: 5,round:3,marginTop:10,
                border: {all:1},borderColor:{color:'Gray',level:3}
            }
        }
        var inputsDesign = {
            marginTop:4, margin: 'centered',widthSM: 7, widthXS: 11
        };
        var inputName = { uname: 'form-input-name', type: 'Input',
            data: { name:'name', required: true },
            design:inputsDesign,
            logic: {loadInputFromStorage: true}
        }
        var inputPhone = { uname: 'form-input-phone', type: 'Input',
            data: { name:'phone', required: true,loadInputFromStorage: true },
            design:inputsDesign,
            logic: {loadInputFromStorage: true}
        }
        var formSubmitButton = { uname: 'form-submit-button', type: 'Button',
            design: { height:40, bgColor:{color:'Olive',level:3}, marginTop:4,widthSM: 7, widthXS: 11, marginRight:1, marginLeft:1, marginTop:1, round: 2,
                active: { bgColor:{color:'Olive',level:5} }
            },
            logic: { text: "Submit Form",
                formSubmitButton: 'form'
            }
        };
        var formSendToURLButton = { uname: 'form-sent-to-url-button', type: 'Button',
            design: { height:40, bgColor:{color:'Navy',level:3}, marginTop:4,widthSM: 7, widthXS: 11, marginRight:1, marginLeft:1, marginTop:1, round: 2,
                active: { bgColor:{color:'Blue',level:5} }
            },
            logic: { text: "Send to URL",
                formSendToUrlButton: 'form'
            }
        };
        var formSaveToLocalStorageButton = { uname: 'form-save-to-local-storage-button', type: 'Button',
            design: { height:40, bgColor:{color:'Purple',level:3}, marginTop:4,widthSM: 7, widthXS: 11, marginRight:1, marginLeft:1, marginTop:1, round: 2,
                active: { bgColor:{color:'Purple',level:5} }
            },
            logic: { text: "Save to Local Storage",
                formSaveToLocalStorageButton: 'form'
            }
        };
        var formClearButton = { uname: 'form-clear-button', type: 'Button',
            design: { height:40, bgColor:{color:'Red',level:3}, marginTop:4,widthSM: 7, widthXS: 11, marginRight:1, marginLeft:1, marginTop:1, round: 2,
                active: { bgColor:{color:'Red',level:5} }
            },
            logic: { text: "Clear Form",
                formClearButton: 'form'
            }
        };
        var gallery = { uname: 'main-gallery', type: 'Gallery',
            data: {
                images:['http://ourevent.co.il/wp-content/uploads/2014/04/1-1.jpg',
                    'http://ourevent.co.il/wp-content/uploads/2014/04/2-1.jpg',
                    'http://ourevent.co.il/wp-content/uploads/2014/04/3-1.jpg',
                    'http://ourevent.co.il/wp-content/uploads/2014/04/4-1.jpg'],
                pagination: true
            }
        };

        var dynamicButtons = {   uname:  'dynamic-buttons',type:   'DynamicObject',
            data: {
                abstractObjects:[
                    {
                        type:   'Label',
                        uname: '#/label',
                        design: { height:40, bgColor:{color:'Red',level:4},widthSM: 10, widthXS: 10,marginRight:1, marginLeft:1, marginTop:1, round: 2,
                            active: { bgColor:{color:'Red',level:6} },
                            activeRemove: {bgColor:{color:'Red',level:4}}
                        },
                        logic: { text: "Title: #this.data.name" }
                    },
                    {
                        type:   'Button',
                        design: { height:40, bgColor:{color:'Aqua',level:4},widthSM: 10, widthXS: 10,marginRight:1, marginLeft:1, marginTop:1, round: 2,
                            active: { bgColor:{color:'Aqua',level:6} },
                            activeRemove: {bgColor:{color:'Aqua',level:4}}
                        },
                        logic: { text: "Welcome #.data.name",
                            showDialog: {
                                data: {
                                    title: 'Hello #.data.name !',
                                    //topView: 'main-button',
                                    textContent: '#.data.message',
                                    confirmText: 'Confirm',
                                    confirmCallback: function() { CLog.dlog('Confirm Callback')}
                                }
                            }
                        }
                    }
                ]
            },
            logic: {
                dynamic:{
                    url: 'http://codletech.net/CAF/caf.php',
                    autoLoad: true
                }
            }
        };

        var tabber = { uname: 'tabber', type: 'Tabber',
            data: {
                tabs: ['tab-aqua','tab-red','tab-green'],
                buttons: {
                    perView: 2,
                    texts:['Aqua','Red','Green'],
                    design:{
                        bgColor: {color:'Maroon',level:3},
                        active: {
                            bgColor: {color:'Maroon',level:4}
                        },
                        hold: {
                            bgColor: {color:'Maroon',level:6}
                        }
                    }
                }
            }
        };
        var tabAqua = { uname: 'tab-aqua', type: 'Tab',
            design:{
                bgColor:{color:'Aqua',level:4}
            }
        };
        var tabRed = { uname: 'tab-red', type: 'Tab',
            design: {
                bgColor:{color:'Red',level:4}
            }
        };
        var tabGreen = { uname: 'tab-green', type: 'Tab',
            design: {
                bgColor:{color:'Green',level:4}
            }
        };





        var objects = [
            appContainer,
            sideMenu,
            sideMenuLeftContainer,
            sideMenuRightContainer,
            mainView,
            mainViewReloadDynamic,
            mainViewButton,
            form,
            inputPhone,
            inputName,
            formSubmitButton,
            formSendToURLButton,
            formSaveToLocalStorageButton,
            formClearButton,
            gallery,
            header,
            footer,
            content,
            mainPage,
            headerButtonRight0,
            headerButtonRight1,
            headerButtonLeft0,
            dropDownMenu,
            dynamicButtons,
            formPage,
            categoryPage,
            toCategoryButton,
            toCategoryDvirButton,
            headerBackButton,
            tabsPage,
            toTabsButton,
            tabber,
            tabAqua,
            tabRed,
            tabGreen


        ];


        var caf = new Caf();
        caf.init(objects);
        //caf.init('');
        //caf.pager.init('page-main','back');
        //caf.ui.rebuildAll();
        /*var str = "";
        var i = 0;
        while (i<=100)
        {
            str += ".top"+i+"{\n\t"+"top:"+i+"px;\n}\n"
            str += ".bottom"+i+"{\n\t"+"bottom:"+i+"px;\n}\n"
            str += ".right"+i+"{\n\t"+"right:"+i+"px;\n}\n"
            str += ".left"+i+"{\n\t"+"left:"+i+"px;\n}\n"
            i++;
        }
        caf.log(str);*/
    }

}