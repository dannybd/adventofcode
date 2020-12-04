document.body.innerText.trim().split('\n\n')
  .filter(p => p.match(
      /\b(byr:(19[2-9]\d|200[012])|iyr:(201\d|2020)|eyr:(202\d|2030)|hgt:(1[5678]\dcm|19[0123]cm|59in|6\din|7[0-6]in)|hcl:#[0-9a-f]{6}|ecl:(amb|blu|brn|gry|grn|hzl|oth)|pid:\d{9})\b/g
    )?.length === 7
  ).length
