document.body.innerText.trim().split('\n')
  .map(equation =>
    (
      // Y combinator!
      // Credit: https://blog.klipse.tech/lambda/2016/08/10/pure-y-combinator-javascript.html
      f => (x => x(x))(x => f(y => x(x)(y)))
    )(
      solveEqn =>
        tokens =>
          // Ensures the reduce step ends with pushing the acc at the end
          [...tokens, '*']
            // First, walk through the tokens and recursively solve
            // any and all parentheticals.
            .map(token => Array.isArray(token) ? solveEqn(token) : token)
            // We now have a list of values, +, and * tokens. We want
            // to handle addition first, so we'll accumulate values,
            // and upon reaching a * token we'll push the accumulator
            // onto the new tokens list. The result is a list of sums.
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
            // Now we handle the * step, by multiply the sums!
            .reduce((a, b) => a * b)
    )(
      // Tokenizer logic. We're going to represent parentheticals as
      // nested arrays, so we can recursively solve them, then handle
      // the + and * on just values.
      equation
        .match(/\d+|[()+*]/g)
        // reduce is our trusty iterator here.
        // The stack is a list of lists, where each parenthetical pushes
        // or pops an array from the stack. I'm relying on short-circuit
        // boolean logic again to handle the data manipulation.
        .reduce((stack, token) =>
          // If we have an open paren, push a new [] onto the stack
          (token === '(' && stack.push([]) && stack) ||
          // If we have a close paren, pop the last array, and stick it
          // inside the *new* last array. This is how we ultimately nest
          // the parentheticals.
          (token === ')' && stack.slice(-2)[0].push(stack.pop()) && stack) ||
          // For all other tokens, push them onto the last array on the stack.
          (stack.slice(-1)[0].push(/\d+/.test(token) ? token - 0 : token) && stack),
          [[]]
        )
        // If the parens are balanced (lol not checking), then we're left with
        // a single list on the stack, containing all of our nested expressions.
        [0]
        // NB: I realized afterwards that I could have made JSON work as my parser:
        //
        //   JSON.parse(
        //     `(${equation})`
        //       .replaceAll(' ', '')
        //       .replaceAll('(', '[')
        //       .replaceAll(')', ']')
        //       .replace(/([+*])/g, ',"$1",')
        //   )
    )
  )
  // Sum the computed lines
  .reduce((a, b) => a + b)
