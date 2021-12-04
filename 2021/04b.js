(input =>
  ((draws, initialBoards, foundPositions, bingo, finalResult) =>
    finalResult(
      // Step through the draws one at a time
      draws.reduce(
        ({activeBoards, winner, winningDraw}, draw, i) =>
          activeBoards.length === 0
            // Unlike 4a, where we are looking for our first winner,
            // here we need to count down until there are no more active
            // boards. Again, in normal JS we'd use a `break` or `return`
            // here to jump out of the loop, but we can't do that.
            ? {winner, winningDraw, activeBoards}
            : (updatedActiveBoards =>
                ({
                  winner: updatedActiveBoards
                    .find(board => bingo(foundPositions(board))),
                  winningDraw: draws[i],
                  activeBoards: updatedActiveBoards
                    .filter(board => !bingo(foundPositions(board))),
                })
              )(
                // In each step, replace the values which are drawn with null
                activeBoards
                  .map(board => board.map(n => n !== draw ? n : null)),
              ),
        // Start our reduce loop with the initial boards,
        // then mutate them as we go.
        {
          activeBoards: initialBoards,
        },
      )
    )
  )(
    // First row is draws, comma separated
    input[0].split(',').map(n => +n),
    // Boards are blocks of 25 digits; store as a list
    input.slice(1).map(l => l.trim().split(/\s+/).map(n => +n)),
    // drawnPositions: given a board, where null has been placed where
    // drawn values were found, pull the indicies of those positions.
    board =>
      new Set(
        board
          .map((n, i) => n === null ? i : null)
          .filter(i => i !== null),
      ),
    // bingo: given a list of drawnPositions, see if any quintuples
    // representing a row or column exist among them.
    drawnPositions =>
      [
        // 5 rows of indicies:
        [ 0,  1,  2,  3,  4],
        [ 5,  6,  7,  8,  9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        // 5 columns of indicies:
        [ 0,  5, 10, 15, 20],
        [ 1,  6, 11, 16, 21],
        [ 2,  7, 12, 17, 22],
        [ 3,  8, 13, 18, 23],
        [ 4,  9, 14, 19, 24],
      ].some(config => config.every(i => drawnPositions.has(i))),
    // finalResult: once we've stepped through the drawings, compute the score
    ({winner, winningDraw}) => winner.reduce((a, b) => a + b) * winningDraw,
  )
)(document.body.innerText.trim().split('\n\n'))
