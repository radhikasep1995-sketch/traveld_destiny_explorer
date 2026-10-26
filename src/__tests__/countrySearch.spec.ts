
import { describe, it, expect } from 'vitest'
import { searchCountries } from '../utils/countrySearch'
import type { Country } from '../types/country'

function createCountry(
  name: string,
  code = 'TST',
): Country {
  return {
    names: {
      common: name,
      official: name,
    },
    codes: {
      alpha_3: code,
    },
  } as Country
}

describe('searchCountries', () => {
  const countries = [
    createCountry('India', 'IND'),
    createCountry('Indonesia', 'IDN'),
    createCountry('Japan', 'JPN'),
    createCountry('China', 'CHN'),
    createCountry('Test without code', ''),
  ]

  it('finds countries by partial name', () => {
    const result = searchCountries(countries, 'ind')

    expect(result.map(country => country.names.common)).toEqual([
      'India',
      'Indonesia',
    ])
  })

  it('searches case-insensitively', () => {
    const result = searchCountries(countries, 'JAPAN')

    expect(result.map(country => country.names.common)).toEqual([
      'Japan',
    ])
  })

  it('trims whitespace from the search query', () => {
    const result = searchCountries(countries, '  china  ')

    expect(result.map(country => country.names.common)).toEqual([
      'China',
    ])
  })

  it('returns valid countries when the query is empty', () => {
    const result = searchCountries(countries, '')

    expect(result).toHaveLength(4)
  })

  it('returns an empty array when no country matches', () => {
    expect(searchCountries(countries, 'Atlantis')).toEqual([])
  })

  it('does not mutate the original array', () => {
    const originalOrder = [...countries]

    searchCountries(countries, 'ind')

    expect(countries).toEqual(originalOrder)
  })
})
