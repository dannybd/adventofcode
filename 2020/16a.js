((ranges, you, nearby) =>
  (valid =>
    nearby
      .match(/\d+/g).map(n => n - 0)
      .filter(n => !valid.has(n))
      .reduce((a, b) => a + b)
  )
  (
    new Set(ranges
      .split('\n')
      .map(x => x.match(/\d+/g).map(n => n - 0))
      .map(x =>
        (l => [
          ...l.slice(x[0], x[1] + 1),
          ...l.slice(x[2], x[3] + 1)
        ])(
          [...Array(x[3] + 1).keys()]
        )
      )
      .flat()
    )
  )
)(...document.body.innerText.trim().split('\n\n'))
