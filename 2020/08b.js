(lines =>
  // Using the line numbers to test what happens if we flip things
  lines.map((_, flippedInstLineNum) =>
    // Provides a loop of instructions in order; since we never run the same
    // instruction twice, we don't need this loop to be any longer than lines.
    // The second arc in .reduce() is unused here, because we're stepping
    // through using values in data itself (starting at its initialized value)
    lines.reduce((data, _) =>
      (
        (instruction, argument) => data.visited.includes(data.lineNum)
          ? data
          : {
              accumulator:
                data.accumulator + (instruction === 'acc' ? argument - 0 : 0),
              lineNum: data.lineNum + (
                // If the lineNum is the one we want to test the flipped
                // instruction, then we XOR the comparison to jmp
                (
                  /jmp|nop/.test(instruction) &&
                  (data.lineNum === flippedInstLineNum ^ instruction === 'jmp')
                ) ? argument - 0 : 1
              ),
              visited: [...data.visited, data.lineNum]
            }
      )(...(lines[data.lineNum] || ' ').split(' ')),
      // Initial data
      {accumulator: 0, lineNum: 0, visited: []}
    )
  )
  // The interesting answer is the one where we're past the code's end
  .find(data => data.lineNum >= lines.length)
  .accumulator
)(document.body.innerText.trim().split('\n'))
