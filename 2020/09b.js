(input =>
  (contiguousList =>
    Math.min(...contiguousList) + Math.max(...contiguousList)
  )(
    (brokenNum => input
      .map((_, i) =>
        input.slice(i).reduce((data, x) =>
          data.sum >= f
            ? data
            : {sum: data.sum + x, list: [...data.list, x]},
          {sum: 0, list: []}
        )
      )
      .find(data => data.sum === brokenNum)
      .list
    )(
      input.map(n => n - 0)
        .find((n, i, arr) =>
          i >= 25 && !arr.slice(i - 25, i).find((v, _, b) => b.includes(n - v))
        )
    )
  )
)(document.body.innerText.trim().split('\n').map(n => n - 0))
