const math = require("mathjs");

const array = [
  [2, 0],
  [-1, 3],
]; // Array
const matrix = math.matrix([
  [7, 1],
  [-2, 3],
]); // Matrix
console.log(array, matrix);
// perform a calculation on an array and matrix
math.square(array); // Array,  [[4, 0], [1, 9]]
math.square(matrix); // Matrix, [[49, 1], [4, 9]]
console.log(array, matrix);

// perform calculations with mixed array and matrix input
math.add(array, matrix); // Matrix, [[9, 1], [-3, 6]]
math.multiply(array, matrix); // Matrix, [[14, 2], [-13, 8]]
console.log(array, matrix);

// create a matrix. Type of output of function ones is determined by the
// configuration option `matrix`
math.ones(2, 3); // Matrix, [[1, 1, 1], [1, 1, 1]]
console.log(array, matrix);
