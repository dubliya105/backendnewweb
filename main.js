const worker = new Worker('worker.js'); 
worker.postMessage('Hello, world!');
let message = 'Hello'; 
count =20;
count = 40;
worker.postMessage(message); 
  
worker.onmessage = function (e) { 
    console.log(e.data); 
};
console.log(count);
