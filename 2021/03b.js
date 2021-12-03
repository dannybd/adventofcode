((nums, bitCriteria) =>
  bitCriteria(nums, '1', '0') * bitCriteria(nums, '0', '1')
)(
  document.body.innerText.trim().split('\n'),
  (nums, first, second) => parseInt(
    [...Array(nums[0].length).keys()]
      .reduce((options, i) =>
        (bit =>
          options.length > 1
            ? options.filter(l => l[i] === bit)
            : options
        )(
          options.map(l => +l[i])
            .reduce((a, b) => a + b) * 2 >= options.length
              ? first
              : second
        ),
        nums,
      )[0],
    2,
  ),
)
