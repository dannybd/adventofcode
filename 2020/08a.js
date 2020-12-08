const lines = document.body.innerText.trim().split('\n');
let i = x = 0;
while (line = lines[i]) {
  lines[i] = null;
  [op, val] = line.split(' ');
  val = val - 0;
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
x
