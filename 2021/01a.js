document.body.innerText.trim().split('\n').map(n => +n)
  .filter((n, i, arr) => n < arr[i + 1])
  .length
