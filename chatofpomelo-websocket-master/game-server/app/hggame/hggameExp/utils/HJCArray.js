/** 判断数组是否含有元素
 * @params: array 对象数组
 * @params: value 属性
 * @return: true or false
 * */
exports.exist = exist;
function exist(array,value){
    var argArray = [].slice.apply(arguments);
    if(argArray.length != 2 ||!Array.isArray(array)){
        throw new Error("HJCArray Error:错误的参数形式");
    }
    for(var i = 0; i<array.length;i++){
        if(value == array[i]) return true;
    }
    return false;
}

/** 替换数组中的元素（无返回值，影响原数组）
 * @params: array 对象数组
 * @params: origin 被替换
 * @params: replace 替换
 * */
exports.replace = replace;
function replace(array,origin,replace){
    var argArray = [].slice.apply(arguments);
    if(argArray.length != 3 ||!Array.isArray(array)){
        throw new Error("HJCArray Error:错误的参数形式");
    }
    for(var i = 0; i<array.length;i++){
        if(origin == array[i]) array[i] = replace;
    }
}

/**创建并填充一个数组
 * @params: num 填充长度(不可超过1000)
 * @params: filled 填充的对象
 * @params（可选）：如果有默认值，则数组的长度(不可超过1000，且不能小于num)
 * @params（可选）：如果有默认值，则默认值
 * @return：创建的数组
 * */
exports.fill = fill;
function fill(num,filled,length,dflt){
    var argArray = [].slice.apply(arguments);
    var array;
    if(argArray.length == 2){
        if(typeof num!=="number"||num>1000) throw new Error("HJCArray Error:错误的参数形式");
        array = new Array(num);
        for(var i=0; i<num; i++){
            array[i] = filled;
        }
        return array;
    }else if(argArray.length == 4){
        if(typeof num!=="number"||typeof length!=="number"||num>length|| num>1000||length>1000) throw new Error("HJCArray Error:错误的参数形式");
        array = new Array(length);
        for(var i=0; i<length; i++){
            if(i<num){
                array[i] = filled;
            }else array[i] = dflt;
        }
        return array;
    }else{
        throw new Error("HJCArray Error:错误的参数形式");
    }
}

/**交换已知数组的两项（改变原数组，无返回值）\
 * @params: array 需要交换的数组
 * @params: num1 需要交换项index（若不存在无影响）
 * @params: num2 需要交换项index（若不存在无影响）
 * */
exports.swap = swap;
function swap(array,num1,num2){
    var argArray = [].slice.apply(arguments);
    if(!Array.isArray(array)||argArray.length != 3||typeof num1!="number"||typeof num2!="number"){
        throw new Error("HJCArray Error:错误的参数形式");
    }
    if(num1>array.length||num2>array.length||num1==num2) return array;
    var temp = array[num1];
    array[num1] = array[num2];
    array[num2] = temp;
    return array;
}

exports.every = every;
function every(){
    var argArray = [].slice.apply(arguments);
    if(argArray.length < 2 || argArray.length > 3){
        return false;
    }
    var objArray = argArray[0];
    var jdg = argArray[argArray.length -1];
    if(argArray.length == 2){
        return objArray.every(function(item,index,array){
            return eval( "(pro"+jdg+")");
        });
    }else{
       var props = argArray[1];
       if(!Array.isArray(props)) return false;
        return objArray.every(function(item,index,array){
            var pro = item;
            for(var level = 0; level < props.length; level++) {
                pro = pro[props[level]];
                if (pro == undefined) return false;
            }
            return eval( "(pro"+jdg+")");
        });
    }
}

exports.some = some;
function some(){
    var argArray = [].slice.apply(arguments);
    if(argArray.length < 2 || argArray.length > 3){
        return false;
    }
    var objArray = argArray[0];
    var jdg = argArray[argArray.length -1];
    if(argArray.length == 2){
        return objArray.some(function(item,index,array){
            return eval( "(pro"+jdg+")");
        });
    }else{
        var props = argArray[1];
        if(!Array.isArray(props)) return false;
        return objArray.some(function(item,index,array){
            var pro = item;
            for(var level = 0; level < props.length; level++) {
                pro = pro[props[level]];
                if (pro == undefined) return false;
            }
            return eval( "(pro"+jdg+")");
        });
    }
}

exports.filter = filter;
function filter(){
    var argArray = [].slice.apply(arguments);
    if(argArray.length < 2 || argArray.length > 3){
        return false;
    }
    var objArray = argArray[0];
    var jdg = argArray[argArray.length -1];
    if(argArray.length == 2){
        return objArray.filter(function(item,index,array){
            return eval( "(pro"+jdg+")");
        });
    }else{
        var props = argArray[1];
        if(!Array.isArray(props)) return false;
        return objArray.filter(function(item,index,array){
            var pro = item;
            for(var level = 0; level < props.length; level++) {
                pro = pro[props[level]];
                if (pro == undefined) return false;
            }
            return eval( "(pro"+jdg+")");
        });
    }
}

exports.forEach = forEach;
function forEach(){
    var argArray = [].slice.apply(arguments);
    if(argArray.length < 2 || argArray.length > 3){
        return false;
    }
    var objArray = argArray[0];
    var op = argArray[argArray.length -1];
    if(argArray.length == 2){
        objArray.filter(function(item,index,array){
            var operation = op.replace(/item/g, "array[index]")+";";
            eval(operation);
        });
    }else{
        var props = argArray[1];
        if(!Array.isArray(props)) return false;
        objArray.forEach(function(item,index,array){
            var pro = item;
            var pointer = "item";
            for(var level = 0; level < props.length; level++) {
                pro = pro[props[level]];
                if (pro == undefined) return false;
                pointer += "."+props[level];
            }
            var operation = op.replace(/item/g, pointer)+";";
            eval(operation);;
        });
    }
}

/**获得对象数组中指定属性(本身)满足要求的对象数组（不影响原数组，项数会变）
 * @params: array 对象数组
 * @params: props 字符串数组，表明需要满足条件的属性
 * @params: exp 表达式
 * @return: array 对象数组（如果属性不满足此项会丢失）
 * */
exports.objects = objects;
function objects(objArray,props,exp){
    var argArray = [].slice.apply(arguments);
    if(argArray.length != 3 ||(!isEmpty(props)&&!Array.isArray(props))){
        throw new Error("HJCArray Error:错误的参数形式");
    }
    var tempRes = [];
    if(isEmpty(props)) {
        tempRes = objArray.concat();
    }else{
        for(var i = 0; i < objArray.length; i++){
            var pro = objArray[i];
            for(var level = 0; level < props.length; level++) {
                pro = pro[props[level]];
                if (pro == undefined){
                    break;
                }
            };
            tempRes.push(pro);
        }
    }
    exp = exp.replace(/item/g, "tempRes[i]")+";";
    var result = [];
    for(var i = 0; i < tempRes.length; i++){
        if(tempRes[i]==undefined) continue;
        try{
            if(eval(exp)){
                result.push(objArray[i]);
            }
        }catch(err){ throw new Error("HJCArray Error:无法执行的表达式");}
    }
    return result;
}

/**获得对象数组的指定属性数组（不影响原数组，项数不变）
 * @params: array 对象数组
 * @params: props 字符串数组，表明需要满足条件的属性
 * @params: exp 表达式
 * @return: values 属性数组（如果属性不存在返回undefined）
 * */
exports.values = values;
function values(objArray,props,exp){
    var argArray = [].slice.apply(arguments);
    if(argArray.length != 3 ||(!isEmpty(props)&&!Array.isArray(props))){
        throw new Error("HJCArray Error:错误的参数形式");
    }
    var tempRes = [];
    if(isEmpty(props)){
        tempRes = objArray.concat();
    }else{
        for(var i = 0; i < objArray.length; i++){
            var pro = objArray[i];
            for(var level = 0; level < props.length; level++) {
                pro = pro[props[level]];
                if (pro == undefined){
                    break;
                }
            };
            tempRes.push(pro);
        }
    }
    if(isEmpty(exp)){
        return tempRes;
    }
    exp = exp.replace(/item/g, "tempRes[i]")+";";
    var result = [];
    for(var i = 0; i < tempRes.length; i++){
        if(tempRes[i]==undefined){
            result.push(undefined);
        }else{
            try{ result.push(eval(exp));}
            catch(err){ throw new Error("HJCArray Error:无法执行的表达式");}
        }
    }
    return result;
}

function isEmpty(obj){
    if(obj==undefined||obj==null||obj=="") return true;
    return false;
}

/**对象数组洗牌（影响原数组，无返回值）
 * @params: array 对象数组
 * */
exports.shuffle = shuffle;
function shuffle(array){
    if(isEmpty(array)){
        throw new Error("HJCArray Error:错误的参数形式");
    }
    for(var i = array.length - 1; i; i--){
        var temp, random = parseInt(Math.random() * i);
        temp = array[i];
        array[i] = array[random];
        array[random] = temp;
    }
}

/**对象数组颠倒（影响原数组，无返回值）
 * @params: array 对象数组
 * */
exports.reverse = reverse;
function reverse(array){
    if(isEmpty(array)){
        throw new Error("HJCArray Error:错误的参数形式");
    }
    array.reverse();
}

/**根据对象数组的指定属性严格自然排序(影响原数组，无返回值)
 * @params: array 对象数组
 * @params: props 字符串数组，表明需要排序的属性
 * */
exports.sortByPrpStrict = sortByPrpStrict;
function sortByPrpStrict(array,props){
    if(isEmpty(array)||isEmpty(props)||!Array.isArray(props)){
        throw new Error("HJCArray Error:错误的参数形式");
    }
    array.sort(compareScrict(props));
}

function compareScrict(props){
    return function(Object1,Object2){
        var v1 = Object1;
        var v2 = Object2;
        for(var level = 0; level < props.length; level++) {
            v1 = v1[props[level]];
            v2 = v2[props[level]];
            if (v1 == undefined||v2 == undefined){
                throw new Error("HJCArray Error:排序对象无此属性");
            }
            if (v1 == null||v2 == null){
                throw new Error("HJCArray Error:排序对象属性不可比较");
            }
        };
        if(v1<v2){
            return -1
        }else if(v1>v2){
            return 1;
        }else{
            return 0;
        }
    }
};

/**根据对象数组的指定属性非严格排序(不影响原数组，有返回值)
 * @params: array 对象数组
 * @params: prop 字符串数组，表明需要排序的属性
 * @return: array 排序后的数组（如果无比较属性或者不可比较，此数组项将被踢除）
 * */
exports.sortByPrp = sortByPrp;
function sortByPrp(array,props){
    if(isEmpty(array)||isEmpty(props)||!Array.isArray(props)){
        throw new Error("HJCArray Error:错误的参数形式");
    }
    var returnArr = [];
    var compProps = [];
    outer:for(var i=0; i<array.length;i++) {
        var compProp = array[i];
        for (var level = 0; level < props.length; level++) {
            compProp = compProp[props[level]];
            if (compProp == undefined || compProp == null) {
                continue outer;
            }
        }
        array[i].compareTempPrp = compProp;
        returnArr.push(array[i]);
    }
    returnArr.sort(compare(compProps));
    for(var i = 0; i < returnArr.length; i++) {
       delete returnArr[i].compareTempPrp;
    };
    return returnArr;
}

function compare(compProps){
    return function(obj1,obj2){
        if(obj1.compareTempPrp<obj2.compareTempPrp){
            return -1
        }else if(obj1.compareTempPrp>obj2.compareTempPrp){
            return 1;
        }else{
            return 0;
        }
    }
};

/**
 * Test
 */
//Test data
//var testNumArray =[5,6,8,1,2,3,9];
//var testStrArray =["China","Japan","America"];
//var testObjArray = [
//    {   name:"Wang Er",
//        body:{ height :100, weight:"50kg"},
//        age:18
//    },
//    {   name:"Zhang San",
//        body:{ height :1, weight:"71kg"},
//        age:19
//    },
//    {   name:"Li si",
//        body:{ heightX :200, weight:"54kg"},
//        age:20
//    },
//    {   name:"Undefined Property",
//        body:{ height :150, weight:"50kg"},
//        age:22
//    }
//];

////Test for values()
//console.log(values(testObjArray,"",""));
//console.log(values(testNumArray,null,"++item"));
//console.log(values(testStrArray,"","item='country:'+item"));
//console.log(values(testObjArray, ["body","height"]));
//console.log(values(testObjArray, ["body","weight"],"item.replace('kg','KG')"));

////Test for objs()
//console.log(objs(testNumArray,undefined,"item>3"));
//console.log(objs(testStrArray,null,"item.length==5"));
//console.log(objs(testObjArray,null,"typeof item =='object'"));
//console.log(objs(testObjArray,["body","height"],"item > 165"));
//console.log(objs(testObjArray,["name"],"item =='Li si'"));

//Test for shuffle()
    //shuffle(testNumArray);
    //shuffle(testStrArray);
    //shuffle(testObjArray);
    //console.log(testNumArray);
    //console.log(testStrArray);
    //console.log(testObjArray);
//Test for reverse()
    //reverse(testObjArray);
    //console.log(testObjArray);

//Test for sortByPrpStrict()
    //sortByPrpStrict(testObjArray,["body","height"]);
    //console.log(testObjArray);
//Test for sortByPrp()
    //var newArray = sortByPrp(testObjArray,["body","height"]);
    //console.log(newArray);

//Test for values()
    //console.log(testNumArray);
    //console.log(testStrArray);
    //console.log(testObjArray);
    //console.log(values(testNumArray,"","(typeof item=='number')?item*2:'不是数字';"));  //无属性定义时，对元素本身进行操作
    //console.log(values(testStrArray,["unDfnPrp"],""));
    //console.log(values(testObjArray,["body","height"],"++item")); //请将++写在item之前

//Test for objects()
    //  console.log(testNumArray);
    //  console.log(testStrArray);
    //  console.log(testObjArray);
    //  console.log(objects(testNumArray,"","item%2==1"));  //无属性定义时，对元素本身进行操作
    //  console.log(objects(testStrArray,["unDfnPrp"],""));
    //  console.log(objects(testObjArray,["body","height"],"item>=100")); //请将++写在item之前

//Test for fill()
    //  console.log(fill(10,10);
    //  console.log(fill(10,"f",15,"d"));
    //  console.log(fill(f,"f"));

//Test for fill()
    //    var arr = [0,1,2,3,4,5];
    //    swap(arr,1,2);
    //    console.log(arr);
    //    swap(arr,1,100);
    //    console.log(arr);