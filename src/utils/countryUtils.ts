
import type { Country } from '@/types/country'

export function sortCountriesByPopulation(
  countries: Country[],
): Country[] {
  return [...countries].sort(
    (a, b) => b.population - a.population,
  )
}
