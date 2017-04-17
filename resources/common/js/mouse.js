var Demos = [];
var FormDesigner = {};
FormDesigner.designElement = [];

var mouseOffset = null;
var iMouseDown = false;
var lMouseState = false;
//拖动的对象
var dragObject = null;
//拖动对象时的坐标
var dragPosition = null;

var DragDrops = [];
var curTarget = null;
var lastTarget = null;
var dragHelper = null;
var tempDiv = null;
var rootParent = null;
var rootSibling = null;

//选择的表单可视化元素
var formFieldSelector = [];

//允许输出日志
var allowPrintLog = false;

var formShowViewPostion = null;

//表单控件ID
var formFieldDivNum = 0;


function writeHistory(object, message) {
    if (!object || !object.parentNode || !object.parentNode.getAttribute)
        return;
    if(!allowPrintLog)
        return;
    var historyDiv = object.parentNode.getAttribute('history') || document.getElementById('formConsole');
    if (historyDiv) {
        /*historyDiv = document.getElementById(historyDiv);*/
        historyDiv.appendChild(document.createTextNode(object.id + ': ' + message));
        historyDiv.appendChild(document.createElement('BR'));

        historyDiv.scrollTop += 50;
    }
}

var mouseInForm = false;

//鼠标移动
function mouseMove(ev){
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    var mousePos = mouseCoords(ev);
    mouseInForm = false;
    /*if(target.className.indexOf('form-designer-show-parent') >= 0){
        mouseInForm = true;
    }else{
        mouseInForm = false;
    }*/
    if(dragObject){
        if(mousePos.x == dragPosition.x && mousePos.y == dragPosition.y){
            return false;
        }
        for (var i = 0; i < dragHelper.childNodes.length; i++)
            dragHelper.removeChild(dragHelper.childNodes[i]);
        var cn = dragObject.cloneNode(true);
        if(cn.className.indexOf('form-designer-show-field') >= 0){
            formFieldSelectorCancel(dragObject);
            cn.onclick = function(){
                formFieldCopyClick(cn);
            };
            formFieldSelectorSelect(cn);
        }
        dragHelper.appendChild(cn);
        dragHelper.style.display = 'block';
        dragHelper.style.position = 'absolute';
        dragHelper.style.top      = (mousePos.y - mouseOffset.y) + 'px';
        dragHelper.style.left     = (mousePos.x - mouseOffset.x) + 'px';
        /*return false;*/
        if(iMouseDown){//鼠标按下状态
            mouseInFormFn(mousePos);
            var f = document.getElementById('formShowViewId');
            if(mouseInForm){
                if(!findActiveChildren(f)){
                    var formFieldDiv = document.createElement("div");
                    formFieldDiv.id = id;
                    formFieldDiv.className = 'form-designer-show-field form-designer-show-field-active';
                    formFieldDiv.onclick = function(){
                        formFieldClick(formFieldDiv);
                    };
                    f.appendChild(formFieldDiv);
                    formFieldDiv.setAttribute("field-type", 'temp');
                }
            }else{
                delActiveChildren(f, false);
            }
        }
    }
    /*if(iMouseDown && !lMouseState){
        debugger;
    }*/
    /*console.log(lMouseState);
    console.log(iMouseDown);*/
    /*lMouseState = iMouseDown;*/
}

function delActiveChildren(e, createField){
    var child = findActiveChildren(e);
    if(child){
        e.removeChild(child);
        if(createField){
            createFormField(dragObject.getAttribute('field-type'), true);
        }
    }
}

function findActiveChildren(e){
    var child = null;
    if(e.childElementCount > 0){
        e.childNodes.forEach(function(node, index, nodeList){
            if(node.getAttribute('field-type') == 'temp'){
                child = node;
            }
        });
    }
    return child;
}

function mouseUp(ev) {
    /*if (curTarget) {
        writeHistory(curTarget, 'Mouse Up Fired');

        dragHelper.style.display = 'none';
        if (curTarget.style.display == 'none') {
            if (rootSibling) {
                rootParent.insertBefore(curTarget, rootSibling);
            } else {
                rootParent.appendChild(curTarget);
            }
        }
        curTarget.style.display = '';
        curTarget.style.visibility = 'visible';
    }*/
    /*if(!mouseInForm){
        dragHelper.style.display = 'none';
    }*/
    dragHelper.style.display = 'none';
    var f = document.getElementById('formShowViewId');
    delActiveChildren(f, true);
    curTarget = null;
    dragObject = null;
    iMouseDown = false;
}

function formFieldSelectorSelect(item){
    if(item.className.indexOf(' form-designer-show-field-active') < 0){
        item.className += ' form-designer-show-field-active';
        item.firstChild.style.display = 'block';
    }
    formFieldSelectorCancelAll();
    formFieldSelector.push(item);
}

function formFieldSelectorCancelAll(){
    if(formFieldSelector.length > 0){
        for(var i in formFieldSelector){
            formFieldSelectorCancel(formFieldSelector[i]);
        }
    }
}

function formFieldSelectorCancel(item){
    item.className = item.className.replace(' form-designer-show-field-active', '');
    item.firstChild.style.display = 'none';
    for(var i in formFieldSelector){
        if(formFieldSelector[i] == item){
            formFieldSelector.splice(i, 1);
        }
    }
}

/*function formFieldSelectorCancel(ev){return;
    if(formFieldSelector.length > 0){
        var x=event.clientX;
        var y=event.clientY;
        var selector = formFieldSelector[0];
        var pos = getPosition(selector);
        var divx1 = pos.x;
        var divy1 = pos.y;
        var divx2 = pos.x + selector.offsetWidth;
        var divy2 = pos.y + selector.offsetHeight;
        if( x < divx1 || x > divx2 || y < divy1 || y > divy2){
            formFieldSelectorCancelFn(selector);
        }
    }
}*/

function mouseDown(ev) {
    ev = ev || window.event;
    var target = ev.target || ev.srcElement;

    iMouseDown = true;
    if (Demos[0] || Demos[4]) {
        if (lastTarget) {
            writeHistory(lastTarget, 'Mouse Down Fired');
        }
    }
    if (target.onmousedown || target.getAttribute('DragObj')) {
        return false;
    }
}

function getPosition(e) {
    var left = 0;
    var top = 0;
    while (e.offsetParent) {
        left += e.offsetLeft + (e.currentStyle ? (parseInt(e.currentStyle.borderLeftWidth)).NaN0() : 0);
        top += e.offsetTop + (e.currentStyle ? (parseInt(e.currentStyle.borderTopWidth)).NaN0() : 0);
        e = e.offsetParent;
    }

    left += e.offsetLeft + (e.currentStyle ? (parseInt(e.currentStyle.borderLeftWidth)).NaN0() : 0);
    top += e.offsetTop + (e.currentStyle ? (parseInt(e.currentStyle.borderTopWidth)).NaN0() : 0);

    return {
        x: left,
        y: top
    };
}

function mouseInFormFn(mousePos){
    var xMin = formShowViewPostion.x;
    var xMax = formShowViewPostion.x + formShowViewPostion.width;
    var yMin = formShowViewPostion.y;
    var yMax = formShowViewPostion.y + formShowViewPostion.height;
    var xIn = xMin <= mousePos.x && mousePos.x <= xMax;
    var yIn = yMin <= mousePos.y && mousePos.y <= yMax;
    mouseInForm = (xIn && yIn);
}

function getPositionAndSize(e) {
    var ps = getPosition(e);
    ps.width = e.offsetWidth;
    ps.height = e.offsetHeight;
    return ps;
}

function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
        return {
            x: ev.pageX,
            y: ev.pageY
        };
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}

var getMouseOffset = function(target, ev){
    ev = ev || window.event;
    var docPos    = getPosition(target);
    var mousePos  = mouseCoords(ev);
    return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}

var makeDraggable = function(item){
    if(!item) return;
    item.onmousedown = function(ev){
        if(Ext.isEmpty(this.getAttribute('field-type'))){
            return false;
        }
        dragObject  = this;
        mouseOffset = getMouseOffset(this, ev);
        dragPosition = mouseCoords(ev);
        return false;
    }
}

var createDragContainer = function(){
    /*
    Create a new "Container Instance" so that items from one "Set" can not
    be dragged into items from another "Set"
     */
    var cDrag = DragDrops.length;
    DragDrops[cDrag] = [];

    /*
    Each item passed to this function should be a "container".  Store each
    of these items in our current container
     */
    for (var i = 0; i < arguments.length; i++) {
        var cObj = arguments[i];
        DragDrops[cDrag].push(cObj);
        cObj.setAttribute('DropObj', cDrag);

        /*
        Every top level item in these containers should be draggable.  Do this
        by setting the DragObj attribute on each item and then later checking
        this attribute in the mouseMove function
         */
        for (var j = 0; j < cObj.childNodes.length; j++) {

            // Firefox puts in lots of #text nodes...skip these
            if (cObj.childNodes[j].nodeName == '#text')
                continue;

            cObj.childNodes[j].setAttribute('DragObj', cDrag);
        }
    }
}

var createDragHelper = function(){
    // Create our helper object that will show the item while dragging
    dragHelper = document.createElement('div');
    dragHelper.style.cssText = 'position:absolute;display:none;';
    document.body.appendChild(dragHelper);
}