
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { fetchAllCountries } from '@/services/countriesApi'
import { useCountriesStore } from '@/stores/countries'
import type { Country } from '@/types/country'

vi.mock('@/services/countriesApi', () => ({
  fetchAllCountries: vi.fn(),
}))

const mockedFetchAllCountries = vi.mocked(fetchAllCountries)

function createCountry(name: string): Country {
  return {
    names: {
      common: name,
      official: name,
    },
    population: 100,
  } as Country
}

describe('countries store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('loads countries successfully', async () => {
    const mockCountries = [
      createCountry('India'),
      createCountry('Japan'),
    ]

    mockedFetchAllCountries.mockResolvedValue(mockCountries)

    const store = useCountriesStore()

    await store.loadCountries()

    expect(store.countries).toEqual(mockCountries)
    expect(store.hasLoaded).toBe(true)
    expect(store.error).toBeNull()
    expect(store.loading).toBe(false)
    expect(mockedFetchAllCountries).toHaveBeenCalledTimes(1)
  })

  it('sets loading to true while fetching countries', async () => {
    let resolveRequest!: (countries: Country[]) => void

    mockedFetchAllCountries.mockReturnValue(
      new Promise<Country[]>((resolve) => {
        resolveRequest = resolve
      }),
    )

    const store = useCountriesStore()

    const request = store.loadCountries()

    expect(store.loading).toBe(true)

    resolveRequest([createCountry('India')])
    await request

    expect(store.loading).toBe(false)
  })

  it('sets error when API request fails', async () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    mockedFetchAllCountries.mockRejectedValue(
      new Error('API failed'),
    )

    const store = useCountriesStore()

    await store.loadCountries()

    expect(store.error).toBe(
      'Unable to load countries. Please try again.',
    )
    expect(store.loading).toBe(false)
    expect(store.hasLoaded).toBe(false)

    consoleSpy.mockRestore()
  })

  it('allows retry after API failure', async () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    mockedFetchAllCountries
      .mockRejectedValueOnce(new Error('API failed'))
      .mockResolvedValueOnce([createCountry('India')])

    const store = useCountriesStore()

    await store.loadCountries()

    expect(store.hasLoaded).toBe(false)

    await store.loadCountries()

    expect(store.countries).toHaveLength(1)
    expect(store.countries[0]?.names.common).toBe('India')
    expect(store.hasLoaded).toBe(true)
    expect(store.error).toBeNull()
    expect(mockedFetchAllCountries).toHaveBeenCalledTimes(2)

    consoleSpy.mockRestore()
  })

  it('does not fetch again after successful loading', async () => {
    mockedFetchAllCountries.mockResolvedValue([
      createCountry('India'),
    ])

    const store = useCountriesStore()

    await store.loadCountries()
    await store.loadCountries()

    expect(mockedFetchAllCountries).toHaveBeenCalledTimes(1)
  })

  it('prevents duplicate requests while loading', async () => {
    let resolveRequest!: (countries: Country[]) => void

    mockedFetchAllCountries.mockReturnValue(
      new Promise<Country[]>((resolve) => {
        resolveRequest = resolve
      }),
    )

    const store = useCountriesStore()

    const firstRequest = store.loadCountries()
    const secondRequest = store.loadCountries()

    expect(mockedFetchAllCountries).toHaveBeenCalledTimes(1)

    resolveRequest([createCountry('India')])

    await Promise.all([firstRequest, secondRequest])

    expect(store.countries).toHaveLength(1)
    expect(store.loading).toBe(false)
  })
})
