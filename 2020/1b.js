Math.sqrt((a => [].concat.apply([], a.map(z => a.filter(x => a.includes(2020 - z - x)))))(document.body.innerText.trim().split('\n').map(x => x - 0)).reduce((a, b) => a * b, 1))
