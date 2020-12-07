(regex => document.body.innerText.trim().split('\n\n')
  .filter(p => p.match(new RegExp(regex, 'g'))?.length === 7)
  .length
)(`\\b(
  byr:(19[2-9]\\d|200[012])|
  iyr:(201\\d|2020)|
  eyr:(202\\d|2030)|
  hgt:((1[5678]\\d|19[0123])cm|(59|6\\d|7[0-6])in)|
  hcl:#[0-9a-f]{6}|
  ecl:(amb|blu|brn|gry|grn|hzl|oth)|
  pid:\\d{9}
)\\b`.replace(/\s/g,''))
