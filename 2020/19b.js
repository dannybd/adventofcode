((rules, messages) =>
  ((rules, messages) =>
    (parsedRules =>
      (rule0 =>
        // Now we test each message against Rule 0 and count how many match
        messages
          .filter(message =>
            (new RegExp(`^${rule0}$`)).test(message)
          )
          .length
      )(
        // At this point, we've disambiguated most, but not all, of the rules.
        // Rule 0, notably, is still part of loop logic.
        // This runs 5 steps to replace the rule numbers with their patterns
        // within Rule 0; this is basically bad recursion, but avoids the
        // infinite loop problem, because it's Good Enough for our input.
        [...Array(5)]
          .reduce(
            pattern => pattern.replace(/\b\d+\b/g, n => parsedRules[n - 0]),
            parsedRules[0]
          )
          // If there are any rule numbers left, replace them with .+
          // which will just match the rest, and hope that the input isn't
          // somehow more complex than that.
          .replace(/\d+/g, '.+')
      )
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
                ? changes
                  .reduce((s, f) => f(s), pattern)
                  // NEW: Beyond running the replacements,
                  // let's clean up the proto-regex patterns.
                  // This will make the regexes easier to read,
                  // and slightly speed up computation later on.
                  // 1. Remove unnecessary capture groups
                  .replace(/\(\?:([ab.]+)\)/g, '$1')
                  // 2. (?:a|b) -> . === [ab] in this input
                  .replace(/\(\?:(a\|b|b\|a)\)/g, '.')
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
      // NEW: Replace Rules 8 and 11 as requested by the prompt.
      // This introduces cycles.
      // (If you comment these out, this code reproduces 19a, as expected.)
      .replace(/\b8: .*/, '8: 42 | 42 8')
      .replace(/\b11: .*/, '11: 42 31 | 42 11 31')
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
