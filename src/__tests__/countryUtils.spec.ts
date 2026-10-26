
import { describe, it, expect } from 'vitest'
import { sortCountriesByPopulation } from '../utils/countryUtils'
import type { Country } from '../types/country'

function createCountry(
  name: string,
  population: number,
): Country {
  return {
    names: {
      common: name,
      official: name,
    },
    population,
  } as Country
}

describe('sortCountriesByPopulation', () => {
  it('sorts countries from highest to lowest population', () => {
    const countries = [
      createCountry('India', 100),
      createCountry('Japan', 50),
      createCountry('China', 200),
    ]

    const result = sortCountriesByPopulation(countries)

    expect(result.map(country => country.names.common)).toEqual([
      'China',
      'India',
      'Japan',
    ])
  })

  it('does not mutate the original array', () => {
    const countries = [
      createCountry('India', 100),
      createCountry('China', 200),
    ]

    const originalOrder = countries.map(
      country => country.names.common,
    )

    sortCountriesByPopulation(countries)

    expect(countries.map(country => country.names.common))
      .toEqual(originalOrder)
  })

  it('returns an empty array for empty input', () => {
    expect(sortCountriesByPopulation([])).toEqual([])
  })
})
