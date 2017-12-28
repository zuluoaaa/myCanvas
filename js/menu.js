
var vm = new Vue({
    el:"#app",
    data:Brush,
    computed:{
        getSelectColor(){
            return this.color
        }
    },
    methods:{
        changeCanvasType:function(a,b){
            console.log(a,b);
            if(this.start === 5 &&　this.type === 5){
                console.log("触发了么")
                DrawCanvas.selectColor.closeColorPicker();
            }
            this.start=a;
            this.type=b;
        },
        showColorPicker:function(){

            DrawCanvas.selectColor.initColorPicker();
            this.changeCanvasType(5,5);
        }
    }
});


