document.body.innerText.trim().split('\n').map(n => +n)
  // (a + b + c < b + c + d) --> (a < d)
  .filter((n, i, arr) => n < arr[i + 3])
  .length
