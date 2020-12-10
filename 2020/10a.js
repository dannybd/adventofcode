document.body.innerText.trim().split('\n')
  .map(n => n - 0)
  .sort((a, b) => a - b)
  .map((x, i, arr) => x - (arr[i - 1] || 0))
  .reduce((data, g) => [{...data[0], [g]: data[0][g] + 1}], [{1: 0, 3: 1}])
  .map(x => x[1] * x[3])[0]
