(data =>
  Math.abs(data.x) + Math.abs(data.y)
)(
  document.body.innerText.trim().split('\n')
    .map(cmd => ({op: cmd[0], val: cmd.substr(1) - 0}))
    .reduce((data, cmd) =>
      ({
        x: data.x + (cmd.op === 'F') * cmd.val * data.wx,
        y: data.y + (cmd.op === 'F') * cmd.val * data.wy,
        wx: (
          ({
            E: wx => wx + cmd.val,
            W: wx => wx - cmd.val,
            L: wx => [wx, -data.wy, -wx,  data.wy][cmd.val / 90],
            R: wx => [wx,  data.wy, -wx, -data.wy][cmd.val / 90]
          })[cmd.op]
          || (wx => wx)
        )(data.wx),
        wy: (
          ({
            N: wy => wy + cmd.val,
            S: wy => wy - cmd.val,
            L: wy => [wy,  data.wx, -wy, -data.wx][cmd.val / 90],
            R: wy => [wy, -data.wx, -wy,  data.wx][cmd.val / 90]
          })[cmd.op]
          || (wy => wy)
        )(data.wy),
      }),
      {x: 0, y: 0, wx: 10, wy: 1}
    )
)
