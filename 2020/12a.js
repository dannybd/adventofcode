(data =>
  Math.abs(data.x) + Math.abs(data.y)
)(
  document.body.innerText.trim().split('\n')
    .map(c => ({cmd: c[0], val: c.substr(1) - 0}))
    .reduce((data, step, i) =>
      ((dir, heading) =>
        ({
          x: data.x + (
            'WE'.includes(dir)
              ? (dir === 'W' ? -1 : 1) * step.val
              : 0
          ),
          y: data.y + (
            'NS'.includes(dir)
              ? (dir === 'S' ? -1 : 1) * step.val
              : 0
          ),
          heading
        })
      )(
        'NESW'.includes(step.cmd)
          ? step.cmd
          : 'F'.includes(step.cmd)
            ? data.heading
            : '-',
        'LR'.includes(step.cmd)
          ? 'NESW'[
              (
                4 +
                'NESW'.indexOf(data.heading) +
                (step.cmd === 'L' ? -1 : 1) * step.val / 90
              ) % 4
            ]
          : data.heading
      ),
      {x: 0, y: 0, heading: 'E'}
    )
)
