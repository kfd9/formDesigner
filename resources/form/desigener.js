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
        '<div form-category="base" class="ui-draggable-handle" form-field-view-id="formFieldViewId" field-type="{type}">',
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
    }, {
        region: 'east',
        title: '属性',
        titleAlign: 'right',
        collapsible: true,
        collapseAlign: 'left',
        split: true,
        width: 150,
        listeners: {
            afterlayout: function(pt, layout, eOpts){
                this.tools[0].el.dom.style.left = 0;
            }
        }
    }, {
        region: 'center',
        overflowY: 'auto',
        html: '<center><div class="form-designer-show-parent" id="formShowViewId"></div></center>'
        /*items: formPage*/
    }]
});

var getFormShowViewPosition = function(){
    var f = document.getElementById('formShowViewId');
    formShowViewPostion = getPositionAndSize(f);
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

/*var getFieldName = function(type){
    if(id == 'testShow1'){
        return 'Ext.form.field.Text';
    }else{
        return 'Ext.form.field.Date';
    }
}*/

var formFieldClick = function(item){
    if(formFieldSelector.length == 1
        && formFieldSelector[0] == item){
        return false;
    }
    formFieldSelectorCancelAll();
    formFieldSelectorSelect(item);
}

var formFieldCopyClick = function(item){
    formFieldClick(item);
}
var formFieldDelClick = function(item){
    formFieldClick(item);
}

var createFormFieldDiv = function(id, type, select){
    var f = document.getElementById('formShowViewId');
    var formFieldDiv = document.createElement("div");
    formFieldDiv.id = id;
    formFieldDiv.className = 'form-designer-show-field';
    formFieldDiv.onclick = function(){
        formFieldClick(formFieldDiv);
    };
    f.appendChild(formFieldDiv);
    if(type == 'textarea'){
        formFieldDiv.style.width = '700px';
        formFieldDiv.style.height = '70px';
    }
    formFieldDiv.setAttribute("field-type", type);
    var formFieldCopyDelSpan = document.createElement("span");
    formFieldCopyDelSpan.className = 'design-copy-delete';
    var copyI = document.createElement("i");
    copyI.className = 'design-ico-copy';
    copyI.onclick = function(){
        formFieldCopyClick(formFieldDiv);
    };
    var delI = document.createElement("i");
    delI.className = 'design-ico-delete';
    delI.onclick = function(){
        formFieldDelClick(formFieldDiv);
    }
    formFieldCopyDelSpan.appendChild(copyI);
    formFieldCopyDelSpan.appendChild(delI);
    //formFieldCopyDelSpan.innerHTML = '<i class="design-ico-copy" ours-e-click="cloneControl"></i><i class="design-ico-delete" ours-e-click="deleteControl"></i>';
    formFieldDiv.appendChild(formFieldCopyDelSpan);
    if(select){
        formFieldSelectorSelect(formFieldDiv);
    }
}

var createFormField = function(type, select){
    var num = formFieldDivNum++;
    var id = 'testShow' + num;
    createFormFieldDiv(id, type, select);
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
    var formFieldDiv = document.getElementById('formFieldViewId');
    if(formFieldDiv.childElementCount > 0){
        formFieldDiv.childNodes.forEach(function(node, index, nodeList){
            makeDraggable(node);
        });
    }
}
makeFormFieldViewDraggable();

createDragContainer(document.getElementById('formFieldViewId'), document.getElementById('formShowViewId'));
createDragHelper();
getFormShowViewPosition();
