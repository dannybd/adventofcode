(lines =>
  // Provides a loop of instructions in order; since we never run the same
  // instruction twice, we don't need this loop to be any longer than lines.
  // The second arc in .reduce() is unused here, because we're stepping
  // through using values in data itself (starting at its initialized value)
  lines.reduce((data, _) =>
    ((instruction, argument) =>
      data.visited.includes(data.lineNum)
        ? data
        : {
            accumulator:
              data.accumulator + (instruction === 'acc' ? argument - 0 : 0),
            lineNum:
              data.lineNum + (instruction === 'jmp' ? argument - 0 : 1),
            visited: [...data.visited, data.lineNum]
          }
    )(...lines[data.lineNum].split(' ')),
    {accumulator: 0, lineNum: 0, visited: []}
  )
  .accumulator
)(document.body.innerText.trim().split('\n'))
