/***********************************************
 *  title: 表单设计器
 *  autor：F.D.Kang
 *  time: 2017/04/13
 *  desc: 基于ext做的表单设计
 *  用途：用的demo演示
 *
 ***********************************************/
 //Ext.namespace( 'Designer');
 //创建表单设计的panel
/* var Designer = Ext.create('Ext.panel.Panel', {
        renderTo: document.body,
        title: '表单设计器demo',
        layout: 'fit',
        tbar: [
          { xtype: 'button', text: '新增' }
        ]
    });*/

var formFieldStore = Ext.create('Ext.data.Store', {
    data: [
        { class:'form-icon-textfield-32', caption:'单行文本', type:'textfield' },
        { class:'form-icon-textarea-32', caption:'多行文本', type:'textarea' },
        { class:'form-icon-number-32', caption:'数字', type:'numberfield'  },
        { class:'form-icon-radio-32', caption:'单选框', type:'radio'  },
        { class:'form-icon-multiselect-32', caption:'多选框', type:''  },
        { class:'form-icon-singleselect-32', caption:'下拉框', type:'combo'  },
        { class:'form-icon-image-32', caption:'上传图片', type:''  },
        { class:'form-icon-datepicker-32', caption:'日期时间', type:'datefield'  },
        { class:'form-icon-checkbox-32', caption:'开关', type:'checkbox'  },
        { class:'form-icon-label-32', caption:'文字说明', type:'displayfield'  },
        { class:'form-icon-hidden-32', caption:'隐藏框', type:'hidden'  },
        { class:'form-icon-imagegroup-32', caption:'图片组', type:''  }
    ],
    fields: ['class', 'caption', 'type']
});



var formFieldViewId = 'formFieldViewId';

var formFieldTpl = new Ext.XTemplate(
    '<div class="form-ctltop" id="formFieldViewId"><tpl for=".">',
        '<div form-category="base" class="ui-draggable-handle" form-field-view-id="formFieldViewId" field-type="{type}" field-show="0">',
          '<span class="form-label-img {class}"></span>',
          '<span class="form-label-name">{caption}</span>',
        '</div>',
    '</tpl></div>'
);

var formFieldView = Ext.create('Ext.view.View', {
    store: formFieldStore,
    tpl: formFieldTpl,
    itemSelector: 'div.ui-draggable-handle',
    emptyText: '没有控件'/*,
    listeners: {
        containermousedown : function(tem, e, eOpts){
            debugger;
        },
        containermouseout : function(tem, e, eOpts){//鼠标离开
            debugger;
        },
        containermouseover : function(tem, e, eOpts){//鼠标进入
            debugger;
        },
        containermouseup : function(tem, e, eOpts){//debugger;
            debugger;
        }
    }*/
});

/*var formPage = Ext.create('Ext.panel.Panel', {
        width: 700,
        autoWidth: true,
        autoHeight: true,
        height: 100,
        html: '<center><div style="width:700px;height:100%;"></div></center>',
        tbar: [
          { xtype: 'button', text: '新增' }
        ]
    });*/

var attrPanel = Ext.create('Ext.panel.Panel', {
    region: 'east',
    title: '属性',
    titleAlign: 'right',
    collapsible: true,
    collapseAlign: 'left',
    split: true,
    width: 200,
    resizePanel: function(){},
    listeners: {
        afterlayout: function(pt, layout, eOpts){
            this.tools[0].el.dom.style.left = 0;
        },
        resize: function(){
            attrPanel.resizePanel();
        }
    }
});

var Designer = Ext.create('Ext.container.Viewport', {
    layout: 'border',
    items: [{
        region: 'north',
        html: '<h1 class="x-panel-header">表单设计器demo</h1>',
        border: false,
        margin: '0 0 5 0'
    }, {
        region: 'west',
        collapsible: true,
        title: '表单元素',
        split: true,
        width: 250,
        items: formFieldView
        // could use a TreePanel or AccordionLayout for navigational items
    }, {
        region: 'south',
        title: '控制台',
        collapsible: true,
        /*overflowY: 'auto',*/
        html: '<div id="formConsole" class="form-designer-console-history">Information goes here</div>',
        split: true,
        height: 100,
        /*margin: '-5 0 0 0',*/
        minHeight: 100,
        tools: [{
            type:'print',
            tooltip: '是否开启日志输出',
            handler: function(event, toolEl, panelHeader) {
                allowPrintLog = allowPrintLog ? false : true;
            }
        },{
            type:'refresh',
            tooltip: '清除日志信息',
            handler: function(event, toolEl, panelHeader) {
                this.up().up().update('<div id="formConsole" class="form-designer-console-history">Information goes here</div>');
            }
        }]
    }, attrPanel, {
        region: 'center',
        overflowY: 'auto',
        html: '<center><div class="form-designer-show-parent" id="formShowViewId"></div></center>'
        /*items: formPage*/
    }]
});

var getFormShowViewPosition = function(){
    formShowViewPostion = getPositionAndSize(formShowViewDiv);
}

var setCursorMove = function(el){
    if(typeof el == 'string'){
        el = document.getElementById(el);
    }/* else if(!(el instanceof HTMLElement)){debugger;
        el.parentElement.style = 'move';
    }*/
    if(el.childElementCount > 0){
        for (var i = el.childNodes.length - 1; i >= 0; i--) {
            setCursorMove(el.childNodes[i]);
        }
    }
    if(el.className == 'design-ico-copy'
        || el.className == 'design-ico-delete'){
        return;
    }
    el.style.cursor = 'move';
}

function createFieldAttr(id, type) {
    attrPanel.removeAll();
    var attrForm = Ext.create('Ext.form.Panel', {
        layout: 'vbox',
        // The fields
        defaultType: 'textfield',
        defaults: { // defaults are applied to items, not the container
            scrollable: true
        },
        items: [{
            xtype:'fieldset',
            flex: 4,
            title: '属性',
            collapsible: true,
            defaultType: 'textfield',
            defaults: {anchor: '100%', labelAlign: 'top'},
            layout: 'anchor',
            items :[{
                fieldLabel: '名称',
                name: 'field1'
            }, {
                fieldLabel: '描述',
                name: 'field2'
            }, {
                fieldLabel: '默认值',
                name: 'field2'
            }]
        }, {
            // Fieldset in Column 2 - collapsible via checkbox, collapsed by default, contains a panel
            xtype:'fieldset',
            flex: 3,
            title: '校验',
            collapsible: true,
            defaultType: 'textfield',
            defaults: {anchor: '100%', labelAlign: 'top'},
            layout: 'anchor',
            items :[{
                fieldLabel: '最少字符',
                xtype: 'numberfield',
                name: 'field1'
            }, {
                fieldLabel: '最多字符',
                xtype: 'numberfield',
                name: 'field2'
            }, {
                xtype: 'checkbox',
                name: '',
                labelWidth: 56,
                labelAlign: 'left',
                fieldLabel: '是否必输'
            }, {
                xtype: 'checkbox',
                name: '',
                labelWidth: 56,
                labelAlign: 'left',
                fieldLabel: '是否只读'
            }]
        }, {
            // Fieldset in Column 2 - collapsible via checkbox, collapsed by default, contains a panel
            xtype:'fieldset',
            flex: 3,
            title: '布局',
            collapsible: true,
            defaultType: 'textfield',
            defaults: {anchor: '100%', labelAlign: 'top'},
            layout: 'anchor',
            items :[{
                fieldLabel: '布局描述',
                name: 'field1'
            }, {
                xtype: 'radiogroup',
                columns: 3,
                vertical: true,
                items: [
                    { boxLabel: '100%', name: 'rb', inputValue: '1' },
                    { boxLabel: '75%', name: 'rb', inputValue: '.75' },
                    { boxLabel: '67%', name: 'rb', inputValue: '.67' },
                    { boxLabel: '50%', name: 'rb', inputValue: '.5', checked: true},
                    { boxLabel: '33%', name: 'rb', inputValue: '.33' },
                    { boxLabel: '25%', name: 'rb', inputValue: '.25' }
                ]
            }]
        }]
    });
    attrPanel.add(attrForm);
    attrPanel.resizePanel = function(){
        attrForm.updateLayout();
    }
}

var formFieldClick = function(item, id, type){
    if(formFieldSelector.length == 1
        && formFieldSelector[0] == item){
        return false;
    }
    formFieldSelectorCancelAll();
    formFieldSelectorSelect(item);
    createFieldAttr(id, type);
}

var formFieldCopyClick = function(item, id, type){
    formFieldClick(item, id, type);
}
var formFieldDelClick = function(item, id, type){
    formFieldClick(item, id, type);
}

var createFormFieldDiv = function(id, type, select, el){
    var formFieldDiv = el ? el : document.createElement("div");
    formFieldDiv.id = id;
    formFieldDiv.className = 'form-designer-show-field';
    formFieldDiv.onclick = function(){
        formFieldClick(formFieldDiv, id, type);
    };
    if(!el){
        formShowViewDiv.appendChild(formFieldDiv);
    }
    if(type == 'textarea'){
        /*formFieldDiv.style.width = '700px';*/
        formFieldDiv.style.height = '70px';
    }
    formFieldDiv.setAttribute("field-type", type);
    formFieldDiv.setAttribute("field-show", '1');
    var formFieldCopyDelSpan = document.createElement("span");
    formFieldCopyDelSpan.className = 'design-copy-delete';
    var copyI = document.createElement("i");
    copyI.className = 'design-ico-copy';
    copyI.onclick = function(){
        formFieldCopyClick(formFieldDiv, id, type);
    };
    var delI = document.createElement("i");
    delI.className = 'design-ico-delete';
    delI.onclick = function(){
        formFieldDelClick(formFieldDiv, id, type);
    }
    formFieldCopyDelSpan.appendChild(copyI);
    formFieldCopyDelSpan.appendChild(delI);
    //formFieldCopyDelSpan.innerHTML = '<i class="design-ico-copy" ours-e-click="cloneControl"></i><i class="design-ico-delete" ours-e-click="deleteControl"></i>';
    formFieldDiv.appendChild(formFieldCopyDelSpan);
    if(select){
        formFieldSelectorSelect(formFieldDiv);
    }
}

var createFormField = function(type, select,el){
    var num = formFieldDivNum++;
    var id = 'testShow' + num;
    createFormFieldDiv(id, type, select, el);
    Ext.widget(type, {
        name: 'Field' + num,
        fieldLabel: 'Field' + num,
        disabled: true,
        disabledCls: 'form-readonly',
        style: {
            width: '100%'
        },
        renderTo: id/*,
        readOnly: true*/
    }).getEl().setStyle('z-index','0');
    setCursorMove(id);
    makeDraggable(document.getElementById(id));
}

var makeFormFieldViewDraggable = function(){
    if(formFieldViewDiv.childElementCount > 0){
        formFieldViewDiv.childNodes.forEach(function(node, index, nodeList){
            makeDraggable(node);
        });
    }
}


/*createDragContainer(document.getElementById('formFieldViewId'), document.getElementById('formShowViewId'));*/


formShowViewDiv = document.getElementById('formShowViewId');
formFieldViewDiv = document.getElementById('formFieldViewId');

makeFormFieldViewDraggable();
createDragHelper();
getFormShowViewPosition();
