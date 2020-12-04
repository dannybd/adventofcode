document.body.innerText.trim().split('\n\n')
  .filter(p => p.match(/\b(byr|iyr|eyr|hgt|hcl|ecl|pid):/g)?.length === 7)
  .length
