let x=5;
let y=10;

//let z=x+y;
//console.log(z);
function Multiply(a,b){
    return a*b;

}
//console.log(Multiply(5,10));
x="omm";
console.log(x);

let q="omm";
console.log(q);
  q=4;
    console.log(q);

    var w="hello";
    console.log(w);
   var  w=7;
    console.log(w);

  {  var z="hi";}
  console.log(z);

  c="campa";
  var c;
    console.log(c);

    function by(a,b){
        var v=12/4;
          console.log(v);
         
    }
    let d;
   
    console.log(d);
  
  

//     // promise
//    let my_promise =new Promise (func);
//    function func(myresolve,myreject){
//     let x=9;
//     if(x==9)
//         myresolve("ok omm");
//     else myreject("not ok");
//    }
//    my_promise.then(
//     function(value){console.log(value);},
//     function (error){console.log(error);}
//    );
// //      3456789
//    let promise=new Promise(function(myresolve,myreject){
//   setTimeout(function() {
//     if(1==2)myresolve("hello omm");
//     else myreject("err");}
//     ,3000);
//    });


//    promise
//    .then(function(value){console.log("success");})
//    .catch(function(error){console.log("fail");}  )
// //    

// //callback 
// function mycallback(result){
//     console.log("hello"+result);
// }
// function getdata(func){
//     func("data received");

// }
// getdata(mycallback);
// // promise 

// const getdata = () => new Promise((resolve, reject) => resolve("data received"));

// getdata().then(result => console.log(result)); // Output: "data received"



// callback 
setTimeout(function (){myfunction("hello")},3000);
function myfunction(value){
    console.log(value+ " omm");
}

// promise 
let mypromise= new Promise(function (resolve,reject){
    setTimeout(function(){
        resolve("hello promise  omm");
    },4000);

})
mypromise.then(function(obj){console.log(obj);});

// async await 

function myasyncfunc(){
    return new Promise(function(resolve,reject){
        setTimeout(function (){
            resolve("hello async await omm");
        },5000)
    })
}
async function mycall(){
    const res=await myasyncfunc();
    console.log(res);
}
mycall();


// promise 
let mypromise3 =new Promise( (resolve,reject )=>{
setTimeout (()=>{
    console.log("inside promise");
    if(1>2)
        resolve ("promise resolved");
    else 
        reject ("promise rejected");
},1000);
})
mypromise3
.then((data)=>{

})
.catch((err)=>{
    console.log(err);
})

// async await 
/*async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

fetchData('https://api.example.com/data');
*/
var numbers = [1, 2, 3, 4];

const doubled = numbers.map(num => num * 2); //applied to every single ele 
var numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter(num => num % 2 === 0);