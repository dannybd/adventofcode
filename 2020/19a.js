((rules, messages) =>
  ((rules, messages) =>
    (parsedRules =>
      // At this point, given there are no loops, we should have disambiguated
      // the patterns. Now we test each message against Rule 0 and count the
      // number which match
      messages
        .filter(message =>
          (new RegExp(`^${parsedRules[0]}$`)).test(message)
        )
        .length
    )(
      // Iterate through the rules and replace them with pieces of each other
      [...Array(rules.length)]
        .reduce(data =>
          (changes =>
            // Now, map the rules. If they contain references to other rules,
            // try running our changes lambdas on the pattern to turn, say,
            // ab(?:3) into ab(?:a|b)
            data.map(pattern =>
              /\d/.test(pattern)
                ? changes.reduce((s, f) => f(s), pattern)
                : pattern
            )
          )(
            // At any given point, some of our rules are free of references
            // to other rules: these will *not* contain numbers anymore.
            // If we pull out these rules, we can make a list of lambda
            // functions which map a given string and replace N with the
            // pattern of rule N, in these cases.
            data
              .map((pattern, i) =>
                /\d/.test(pattern)
                  ? null
                  : str => str.replace(new RegExp(`\\b${i}\\b`, 'g'), pattern)
              )
              .filter(x => x !== null)
          ),
          rules
        )
    )
  )(
    // Sort and turn the list of rules into pseudo-regex
    rules
      // Strip the unhelpful quote marks
      .replace(/"/g, '')
      .split('\n')
      .map(x => x.split(':'))
      // Sort the lines according to their rule number
      .sort((a, b) => (a[0] - 0) - (b[0] - 0))
      // Now we can use the index as the rule number,
      // so just keep the rule itself
      .map(x =>
        x[1]
          // Surround the rule numbers with non-capturing groups
          .replace(/\b(\d+)\b/g, '(?:$1)')
          // Strip the whitespace (we can distinguish between rule #s now)
          .replace(/ /g, '')
      ),
    messages.split('\n')
  )
)(...document.body.innerText.trim().split('\n\n'))
