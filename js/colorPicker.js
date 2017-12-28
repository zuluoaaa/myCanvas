/**
 * 创建拾色器
 */
var ColorPicker = function(canvas,x,y){
    //传入画布对象
    this.canvas = canvas;
    this.x=x;
    this.y=y;
};

ColorPicker.prototype = {
    ARROW_SPACIING_LEFT:247,
    SPACIING_LEFT:265,
    __RGB_MIN_COLOR: [0, 0, 0],
    __RGB_MAX_COLOR: [255, 255, 255],
    createAllColor: function () {
        let colorImage = this.canvas.createImageData(20, 255);

        let r = 255,
            g = 0,
            b = 0;

        for (var i = 0; i < colorImage.data.length; i += 4) {
            for (var row = 0; row < 19; row++) {
                colorImage.data[i] = r;
                colorImage.data[i + 1] = g;
                colorImage.data[i + 2] = b;
                colorImage.data[i + 3] = 255;
                i += 4;
            }
            if (r >= 255 && g <= 0 && b < 255) {
                b += 6;
            }
            else if (r >= 255 && b <= 0 && g >= 0) {
                g -= 6
            }
            else if (g >= 255 && b <= 0 && r < 255) {
                r += 6;
            }
            else if (g >= 255 && r <= 0 && b >= 0) {
                b -= 6;
            }
            else if (b >= 255 && r <= 0 && g < 255) {
                g += 6;
            }
            else if (b >= 255 && g <= 0 && r >= 0) {
                r -= 6;
            }
        }
        return colorImage;
    },
    createOneColor: function (r, g, b) {

        var colorImage = this.canvas.createImageData(255, 255);
        var _r = 255, _g = 255, _b = 255;
        let numR = (_r-r)/_r,
            numG = (_g-g)/_g,
            numB = (_b-b)/_b;
        if(numR<=0){
            numR = 1
        }
        if(numG<=0){
            numR = 1
        }
        if(numB<=0){
            numR = 1
        }
        for (var i = 0; i < colorImage.data.length; i += 4) {
            let rowR = _r, rowG = _g, rowB = _b;
            for (var row = 0; row < 254; row++) {
                colorImage.data[i] = rowR;
                colorImage.data[i + 1] = rowG;
                colorImage.data[i + 2] = rowB;
                colorImage.data[i + 3] = 255;
                i += 4;
                if (r > b && r > g) {
                    rowB -= numB;
                    rowG -= numG;
                } else if (b > r && b > g) {
                    rowR -= numR;
                    rowG -= numG;
                } else if (g > r && g > b) {
                    rowR -= numR;
                    rowB -= numB;
                }
            }
            numR -= 0.004*numR;
            numB -= 0.004*numB;
            numG -= 0.004*numG;

            _r--, _g--, _b--;
        }
        return colorImage;
    },
    createTriangle: function (x, y) {
        this.canvas.beginPath();
        this.canvas.moveTo(x + 10, y + 0);
        this.canvas.lineTo(x + 10, y + 10);
        this.canvas.lineTo(x + 15, y + 5);
        this.canvas.closePath();
        this.canvas.strokeStyle = "#0000ff";
        this.canvas.lineWidth = 1;
        this.canvas.stroke();
    },
    isClickSelectColor:function(x,y){
        let pickerX = this.x+this.SPACIING_LEFT,
            pickerY = this.y;

        if(x>=pickerX && x<=pickerX+20 && y>=pickerY && y<=pickerY+255){
            return true;
        }else {
            return false;
        }
    },
    isClickContents:function (x,y) {
        let pickerX = this.x,
            pickerY = this.y;

        if(x >= pickerX && x <= pickerX+this.SPACIING_LEFT && y>= pickerX && y<=pickerY+255){
            return true;
        }else{
            return false;
        }
    }
}




