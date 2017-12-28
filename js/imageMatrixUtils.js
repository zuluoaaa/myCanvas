/**
 * 像素操作一些常用操作进行封装
 */
let  num = 0;
const ImageMatrixUtils = {
    oneToTwo:function (orginalData,w) {
        let arr = [];
        let index = 0;
        let len = Math.ceil(orginalData.length/4/w);
        console.log(orginalData.length,w);
        for(let i=0;i<len;i++){
            let temp = [];
            for(let z=0;z<w;z++){
                temp.push({
                    r:orginalData[index],
                    g:orginalData[index+1],
                    b:orginalData[index+2],
                    a:orginalData[index+3]
                });
                index +=4;
            }
            arr.push(temp);
        }
        return arr;
    },
   twoToOne:function (orginalData) {
       let arr = [];
       for(var i in orginalData){
           for(var z in orginalData[i]){
               arr.push(orginalData[i][z].r);
               arr.push(orginalData[i][z].g);
               arr.push(orginalData[i][z].b);
               arr.push(orginalData[i][z].a);
           }
       }
       return arr;
   },
    findSamePixelAnRenderingNewColor:(function () {



        function whileTowMatrix(twoMatrix,x,y,color,newColor) {
            if(!twoMatrix[x]){
                return false;
            }

            let node = twoMatrix[x][y];

            if(node &&　!node.isFind){
                node.isFind = true;
                let isSame = ImageMatrixUtils.compareTwoColorIsSame(node,color);
                if(isSame){
                    ++num;
                    node.r = newColor.r;
                    node.g = newColor.g;
                    node.b = newColor.b;
                    node.a = newColor.a;
                    whileTowMatrix(twoMatrix,x+1,y,color,newColor);
                    whileTowMatrix(twoMatrix,x-1,y,color,newColor);
                    whileTowMatrix(twoMatrix,x,y+1,color,newColor);
                    whileTowMatrix(twoMatrix,x,y-1,color,newColor);
                }
            }
        }

        return function (twoMatrix,x,y,newColor) {
            let color = JSON.parse(JSON.stringify(twoMatrix[y][x]));
            whileTowMatrix(twoMatrix,y,x,color,newColor);
            return twoMatrix;
        }
    }()),
    compareTwoColorIsSame(colorA,colorB,errorRatio){
        errorRatio = errorRatio || 0;
        if(colorA.r === colorB.r && colorA.g === colorB.g && colorA.b === colorB.b && colorA.a === colorB.a){
            return true
        }else{
            return false;
        }
    }
};