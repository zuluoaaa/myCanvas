
const myCanvas = document.getElementById("myCanvas");
const canvas = myCanvas.getContext("2d");

const Base_Data = {
    width:800,
    height:500
}

myCanvas.setAttribute("width",Base_Data.width);
myCanvas.setAttribute("height",Base_Data.height)

/**
 * 当前使用的画笔对象
 * type:鼠标点击，移动，松开触发的推送的type
 *  [2,1] 绘制线
 *  [3,4] 绘制直线
 *
 */
const Brush = {
    color:{
        r:0,g:0,b:0,a:255
    },
    w:5,
    h:5,
    start:3,
    type:4,
}

const DrawCanvas = {
    data:{
        frame:null,
        moveTo:{x:null,y:null}
    },
    darwPoint:function (x,y,brush) {
        console.log(x,y,brush);
        canvas.lineTo(x,y);
        canvas.lineWidth=brush.w;
        canvas.strokeStyle=brush.color;
        canvas.lineCap="round";
        canvas.stroke();
    },
    startDarwPoint:function (x,y) {
        canvas.moveTo(x,y);
        canvas.beginPath();
    },

    savePreviousFrame:function(x, y,w,h){
        this.data.frame = canvas.getImageData(x,y,w,h);
        this.data.frame.data = JSON.parse(JSON.stringify(this.data.frame.data));
    },
    putPreviousFrame:function(x,y){
        if(this.data.frame !== null){
            canvas.putImageData(this.data.frame,x,y);
        }
    },

    /**
     * 直线
     * */
    straightLine:{
        start:function(x,y){
            DrawCanvas.savePreviousFrame(0,0,Base_Data.width,Base_Data.height);
            DrawCanvas.data.moveTo.x = x;
            DrawCanvas.data.moveTo.y = y;
        },
        move:function(x,y,brush){
            canvas.clearRect(0,0,Base_Data.width,Base_Data.height);
            DrawCanvas.putPreviousFrame(0,0);
            canvas.beginPath();
            canvas.moveTo(DrawCanvas.data.moveTo.x, DrawCanvas.data.moveTo.y);
            DrawCanvas.darwPoint(x,y,brush);
        }
    },
    /**
     * 选择颜色
     * */
    selectColor:{
        _color_picker:null,
        _color_picker_left:null,
        _color_picker_right:null,
        _color_picker_width:285,
        _color_picker_height:255,
        _color_picker_x:Base_Data.width/2 - 285/2,
        _color_picker_y:Base_Data.height/2 - 255/2,
        renderColorPicker:function(r,g,b,triangleTop){

            if(!triangleTop){
                triangleTop = this._color_picker_y;
            }
            DrawCanvas.selectColor.getColorPicker().createTriangle(this._color_picker_x+this.getColorPicker().ARROW_SPACIING_LEFT,triangleTop);
            canvas.putImageData(this.getColorPickerLeft(r,g,b),this._color_picker_x,this._color_picker_y);
            canvas.putImageData(this.getColorPickerRight(),this._color_picker_x+this.getColorPicker().SPACIING_LEFT,this._color_picker_y);
        },
        getColorPicker:function(){
            if( this._color_picker === null){
                this._color_picker = new ColorPicker(canvas,this._color_picker_x,this._color_picker_y);
            }
            return this._color_picker;
        },
        getColorPickerLeft:function(r,g,b){
            console.log(this._color_picker);
            this._color_picker_left = this._color_picker.createOneColor(r,g,b);
            return this._color_picker_left;
        },
        getColorPickerRight:function(){
            if(this._color_picker_right===null){
                this._color_picker_right = this._color_picker.createAllColor();
            }
            return this._color_picker_right;
        },
        clickColorPicker:function(x,y){
            let isClick = DrawCanvas.selectColor.getColorPicker().isClickSelectColor(x,y);
            if(isClick){
                let color = canvas.getImageData(x,y,1,1).data;
                canvas.clearRect(0,0,Base_Data.width,Base_Data.height);
                DrawCanvas.putPreviousFrame(DrawCanvas.data.frame,0,0);
                DrawCanvas.selectColor.renderColorPicker(color[0],color[1],color[2],y);
            }else{
                let isClickContents = DrawCanvas.selectColor.getColorPicker();
                if(isClickContents){
                    let color = canvas.getImageData(x,y,1,1).data;
                    Brush.color.r = color[0];
                    Brush.color.g = color[1];
                    Brush.color.b = color[2];
                }
            }
        },
        initColorPicker:function(){
            DrawCanvas.savePreviousFrame(0,0,Base_Data.width,Base_Data.height);
            DrawCanvas.selectColor.renderColorPicker(255, 0, 0);
        },
        closeColorPicker:function () {
            canvas.clearRect(0,0,Base_Data.width,Base_Data.height);
            DrawCanvas.putPreviousFrame(DrawCanvas.data.frame,0,0);
        }
    },

    /**
     * 填充
     */
    makeFill:{
        start:function (x,y) {
            let imageMatrix =  canvas.getImageData(0,0,Base_Data.width,Base_Data.height);
            console.log(imageMatrix);
            let twoMatrix = ImageMatrixUtils.oneToTwo(imageMatrix.data,Base_Data.width);

            twoMatrix = ImageMatrixUtils.findSamePixelAnRenderingNewColor(twoMatrix,x,y,Brush.color);
            twoMatrix = ImageMatrixUtils.twoToOne(twoMatrix);
            canvas.clearRect(0,0,Base_Data.width,Base_Data.height);
            console.log(twoMatrix);
            for(let i in imageMatrix.data){
                imageMatrix.data[i] = twoMatrix[i];
            }
            canvas.putImageData(imageMatrix,0,0);
        },
    }
}



/**
 * 发布/订阅：鼠标点击时，根据type推送给不同的观察者，这里存放监听函数
 * @type {Array}
 */
const Observer = [];

const addObserver  = function (fn,type) {
    Observer.push({fn:fn,type:type})
}

const sendObserver = function (x,y,brush) {
    for(let i in Observer){
        if(Observer[i].type === brush.type){
            Observer[i].fn(x,y,brush);
        }
    }
}


function initEvent() {
    let isLeftClick = false;
    myCanvas.onmousedown = function (e) {
        if(e.button === 0){
            isLeftClick = true;
            let rgba = "rgba("+Brush.color.r+","+Brush.color.g+","+Brush.color.b+","+Brush.color.a+")";
            sendObserver(e.offsetX,e.offsetY,{
                color:rgba,
                w:Brush.w,
                h:Brush.h,
                type:Brush.start,
            });
        }
    }
    myCanvas.onmousemove = function (e) {
        if(isLeftClick){
            let rgba = "rgba("+Brush.color.r+","+Brush.color.g+","+Brush.color.b+","+Brush.color.a+")";
            sendObserver(e.offsetX,e.offsetY,{
                color:rgba,
                w:Brush.w,
                h:Brush.h,
                type:Brush.type,
            });
        }
    }
    myCanvas.onmouseup = function (e) {
        isLeftClick = false;
    }
    myCanvas.onmouseout = function (e) {
        isLeftClick = false;
    }
}

function initCanvas() {
    addObserver(DrawCanvas.darwPoint,1);
    addObserver(DrawCanvas.startDarwPoint,2);
    addObserver(DrawCanvas.straightLine.start,3);
    addObserver(DrawCanvas.straightLine.move,4);
    addObserver(DrawCanvas.selectColor.clickColorPicker,5);
    addObserver(DrawCanvas.makeFill.start,"fill");

    initEvent();
}

initCanvas();