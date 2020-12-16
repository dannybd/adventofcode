// The input is structured into three chunks.
// We'll pre-process each, then use them within the remaining logic.
((ranges, you, nearby) =>
  ((ranges, you, nearby, departureRangeIndicies) =>
    (
      nearby =>
        nearby
    )(
      (validValues =>
        // fieldMap is a mapping between the ticket value positions
        // and the field index they represent.
        (fieldMap =>
          you
            // With field map, we can then just check each ticket value's
            // position on your ticket to see if it represents a field
            // which starts with 'departure'...
            .filter((_, i) => departureRangeIndicies.includes(fieldMap[i]))
            // ...and multiply those ticket values together for the answer.
            .reduce((a, b) => a * b)
        )(
          // Solving for the fieldMap is the core of this challenge.
          // To do so, we're going to run N passes through the list of
          // still-valid field possibilities for each ticket position.
          // On each pass, at least one of the ticket positions will have
          // exactly one field option left: save that in the results
          // mapping, filter out that found field option from the other
          // ticket positions, and loop.
          // When this ends, all N ticket positions will be exhausted,
          // and the results with be a mapping from ticket value positions
          // to field indicies.
          [...Array(ranges.length)].reduce(
            data =>
              ((ticketValueIndex, fieldIndex) =>
                ({
                  results: {
                    ...data.results,
                    [ticketValueIndex]: fieldIndex
                  },
                  options: data.options
                    .map(option => option.filter(v => v !== fieldIndex))
                })
              )(
                data.options.findIndex(x => x.length === 1),
                data.options.find(x => x.length === 1)[0]
              ),
            {
              results: {},
              options: nearby
                // Filters all nearby tickets to just the valid ones
                .filter(ticket => ticket.every(n => validValues.has(n)))
                // On each loop inside reduce, we iteratively check and filter
                // to the remaining potential fields which could represent
                // each ticket value position.
                .reduce((data, ticket) =>
                  data.map((options, i) =>
                    // If ticket[i] isn't valid for range[option], then
                    // option gets ruled out from the list for that position.
                    options.filter(option => ranges[option].has(ticket[i]))
                  ),
                  // It's an N by N array, which holds which fields are still
                  // technically valid to cover all of the values in that
                  // ticket position. We start with N x N because initially
                  // all fields could be in any ticket position.
                  Array(ranges.length).fill([...Array(ranges.length).keys()])
                )
            }
          )
          .results
        )
      )(
        // Collect all of the ranges together into one set, so it's
        // a one-stop check on whether a value on a ticket is valid
        ranges.reduce((a, b) => new Set([...a, ...b]))
      )
    )
  )
  (
    // Pre-processing ranges: turn each range (written A-B or C-D) into
    // a set of integers representing all valid values in that range
    ranges
      .split('\n')
      .map(x => x.match(/\d+/g).map(n => n - 0))
      .map(x =>
        (l =>
          new Set([
            ...l.slice(x[0], x[1] + 1),
            ...l.slice(x[2], x[3] + 1)
          ])
        )(
          [...Array(x[3] + 1).keys()]
        )
      ),
    // Preprocess your ticket into a list of values
    you
      .split('\n')[1]
      .match(/\d+/g)
      .map(n => n - 0),
    // Preprocess all nearby tickets into lists of values too
    nearby
      .split('\n')
      .slice(1)
      .map(ticket => ticket.match(/\d+/g).map(n => n - 0)),
    // Get the indicies of ranges which start with the word departure
    ranges
      .split('\n')
      .map((x, i) => x.startsWith('departure') ? i : null)
      .filter(i => i !== null)
  )
)(...document.body.innerText.trim().split('\n\n'))
