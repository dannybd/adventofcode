(input =>
  (data =>
    (({allIngredients, knownIngredients}) =>
      // Counting the number of instances of unknownIngredients in the input
      input
        .match(new RegExp(
          '\\b(?:' +
          allIngredients
            .filter(ingredient => !(ingredient in knownIngredients))
            .join('|') +
          ')\\b',
          'g'
        ))
        .length
    )(
      // We need to solve for each allergen, and at least one will
      // be solvable on each loop, so we need at most this many loops
      [...Array(data.allAllergens.length)]
        .reduce(data =>
          // The trick is to find a matching allergen and ingredient,
          // and build up those findings in our data object
          ((allergen, ingredient) =>
            ({
              ...data,
              // Two mappings, for easier bidirectionality
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
            // Now to find the matching allergen and ingredient.
            ...data
              // Start with a list of all allergens
              .allAllergens
              // Filter to the still-unknown allergens
              .filter(allergen => !(allergen in data.knownAllergens))
              .map(allergen =>
                // Look at the lines we know to have the allergen
                (linesKnownToHaveAllergen =>
                  linesKnownToHaveAllergen
                    // Get a list of all ingredients used in those lines
                    // (including duplicates)
                    .flatMap(line => line.ingredients)
                    .filter((ingredient, index, ingredients) =>
                      // Ignore ingredients which are known
                      !(ingredient in data.knownIngredients) &&
                      // We want a unique list of ingredients, so
                      // only could the first time it shows up.
                      // This is equivalent to [...new Set(ingredients)].
                      ingredients.indexOf(ingredient) === index &&
                      // We're looking for cases for the # of uses
                      // of this ingredient matches the number of
                      // lines. Each line will have the ingredient
                      // 0 or 1 times, so this means the ingredient
                      // is present for all of the lines, and thus
                      // could potentially be the source for the
                      // allergen.
                      ingredients.filter(x => x === ingredient).length
                      === linesKnownToHaveAllergen.length
                    )
                    // Some unknown allergens will still show multiple
                    // ingredients at this phase: that's a sign that
                    // one of those ingredients is silently hiding
                    // its allergen in a line NOT known to have it.
                    // In those cases, we remove the allergen from the
                    // running this time around.
                    .reduce((_, ingredient, i) =>
                      // If there is more than one ingredient left,
                      // then i will exceed 0, and we'll return null.
                      // Otherwise, we'll return a matched pair.
                      i ? null : [allergen, ingredient],
                      null
                    )
                )(
                  data
                    .lines
                    .filter(line => line.allergens.includes(allergen))
                )
              )
              // Use the first matched pair
              .find(x => x !== null)
          ),
          data
        )
    )
  )(
    // Let's start by collecting our data from each line.
    input
      .split('\n')
      // Our trusty reduce will allow up to compile our findings together
      .reduce((data, line) =>
        ((ingredients, allergens) =>
          ({
            ...data,
            // lines just builds up with objects of what we found on each line
            lines: [
              ...data.lines,
              {ingredients, allergens},
            ],
            // Sets of all allergens and ingredients. Keeping these
            // as arrays b/c they're easier to work with
            allAllergens: [...new Set([...data.allAllergens, ...allergens])],
            allIngredients:
              [...new Set([...data.allIngredients, ...ingredients])],
          })
        // Split the ingredients and the allergens for ease of use
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
