
import type { Country } from '../types/country'

export function searchCountries(
  countries: Country[],
  searchQuery: string,
): Country[] {
  const query = searchQuery.trim().toLowerCase()

  return countries
    .filter((country) => country.codes.alpha_3?.trim())
    .filter((country) =>
      country.names.common.toLowerCase().includes(query),
    )
}
