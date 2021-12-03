(x =>
  (n =>
    n * (2 ** x[0].length - 1 - n)
  )(
    parseInt(
      [...Array(x[0].length).keys()]
        .map(i =>
          x.map(l => +l[i])
          .reduce((a, b) => a + b) * 2 > x.length
            ? '1'
            : '0'
        )
        .join(''),
      2,
    )
  )
)(document.body.innerText.trim().split('\n'))
