document.body.innerText.trim().split('\n')
  .map(equation =>
    (
      // Y combinator!
      // Credit: https://blog.klipse.tech/lambda/2016/08/10/pure-y-combinator-javascript.html
      f => (x => x(x))(x => f(y => x(x)(y)))
    )(
      solveEqn =>
        tokens =>
          [...tokens, '*']
            .map(token => Array.isArray(token) ? solveEqn(token) : token)
            .reduce((data, token, i, tokens) =>
              token === '*'
                ? {
                    acc: 0,
                    newTokens: [...data.newTokens, data.acc]
                  }
                : {
                    acc: data.acc + (token | 0),
                    newTokens: data.newTokens
                  },
              {
                acc: 0,
                newTokens: []
              }
            )
            .newTokens
            .reduce((a, b) => a * b)
    )(
      equation
        .match(/\d+|[()+*]/g)
        .reduce((data, token, i, arr) =>
          (token === '(' && data.push([]) && data) ||
          (token === ')' && data.slice(-2)[0].push(data.pop()) && data) ||
          (data.slice(-1)[0].push(/\d+/.test(token) ? token - 0 : token) && data),
          [[]]
        )[0]
    )
  )
  .reduce((a, b) => a + b)
