Array.prototype.groupBy = function(key) {
    return this.reduce((hash, obj) => {
        if(obj[key] === undefined) return hash;
        return Object.assign(hash, {
            [obj[key]]: (hash[obj[key]] || []).concat(obj)
        })
    }, {})
};


var cars = [
    {make: 'audi', model: '3ds'},
    {make: 'mars', model: '3ds'},
    {make: 'audi', model: '3ds'},
    {make: 'mars', model: '3ds'},
    {make: 'audi', model: '3ds'},
]

console.log(cars.groupBy('make'))