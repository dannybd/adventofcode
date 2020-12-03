(a => a.filter(x => a.includes(2020 - x)).reduce((x, y) => x * y, 1))(document.body.innerText.trim().split('\n').map(x => x - 0))
