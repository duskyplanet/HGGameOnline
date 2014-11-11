var arr= [false,false,false,true,true,false,true,false,true];

function getPosById(id){
    var findId = 0;
    for(var i = 0;i < arr.length;i++){
        if(arr[i] === true){
           if(findId === id) return i;
           findId ++;
        }
    }
    console.log("error");
}

console.log(getPosById(3));