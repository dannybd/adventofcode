const lines = document.body.innerText.trim().split('\n');
function tryFinish(lines, j) {
  lines = [...lines];
  if (!/jmp|nop/.test(lines[j])) {
    return null;
  }
  let x = 0;
  let i = 0;
  while (line = lines[i]) {
    lines[i] = null;
    [op, val] = line.split(' ');
    val = val - 0;
    if (i === j) {
      op = op === 'nop' ? 'jmp' : 'nop';
    }
    switch (op) {
      case 'nop':
        i++;
        continue;
      case 'acc':
        x += val;
        i++;
        continue;
      case 'jmp':
        i += val;
        continue;
    }
  }
  return i === lines.length ? x : null;
}
[...Array(lines.length).keys()].map(j => tryFinish(lines, j)).find(x => x);
