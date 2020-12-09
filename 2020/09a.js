document.body.innerText.trim().split('\n')
  .map(n => n - 0)
  .find((n, i, arr) =>
    i >= 25 && !arr.slice(i - 25, i).find((v, _, b) => b.includes(n - v))
  )
