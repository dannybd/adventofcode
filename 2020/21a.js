(input =>
  (data =>
    (data =>
      input
        .match(new RegExp(
          '\\b(?:' +
          data
            .allIngredients
            .filter(ingredient => !(ingredient in data.knownIngredients))
            .join('|') +
          ')\\b',
          'g'
        ))
        .length
    )(
      [...Array(data.allAllergens.length)]
        .reduce(data =>
          ((allergen, ingredient) =>
            ({
              ...data,
              knownAllergens: {
                ...data.knownAllergens,
                [allergen]: ingredient,
              },
              knownIngredients: {
                ...data.knownIngredients,
                [ingredient]: allergen,
              },
            })
          )(
            ...data
              .allAllergens
              .filter(allergen => !(allergen in data.knownAllergens))
              .map(allergen =>
                (linesWithKnownAllergen =>
                  [...new Set(
                    linesWithKnownAllergen
                      .flatMap(line => line.ingredients)
                      .filter((ingredient, _, ingredients) =>
                        !(ingredient in data.knownIngredients) &&
                        ingredients.filter(x => x === ingredient).length
                        === linesWithKnownAllergen.length
                      )
                  )]
                    .reduce((_, ingredient, i) =>
                      i ? null : [allergen, ingredient],
                      null
                    )
                )(
                  data
                    .lines
                    .filter(line => line.allergens.includes(allergen))
                )
              )
              .find(x => x)
          ),
          data
        )
    )
  )(
    input
      .split('\n')
      .reduce((data, line) =>
        ((ingredients, allergens) =>
          ({
            ...data,
            lines: [
              ...data.lines,
              {ingredients, allergens},
            ],
            allAllergens: [...new Set([...data.allAllergens, ...allergens])],
            allIngredients:
              [...new Set([...data.allIngredients, ...ingredients])],
          })
        )(...line.split('(contains').map(part => part.match(/\w+/g))),
        {
          knownAllergens: {},
          knownIngredients: {},
          lines: [],
          allAllergens: [],
          allIngredients: [],
        }
      )
  )
)(document.body.innerText.trim())
