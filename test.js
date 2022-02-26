var obj = [
    { name: 'Max', age: 23 },
    { name: 'John', age: 20 },
    { name: 'Caley', age: 18 }
];
 
var found = obj.find(e => {e.name === 'John' ; 
console.log(e.name)});
console.log(found);