import axios from 'axios'
import type { Country } from '@/types/country'

const API_KEY = import.meta.env.VITE_COUNTRIES_API_KEY
// console.log('API_KEY', API_KEY)
if (!API_KEY) {
  console.error(
    'Missing VITE_COUNTRIES_API_KEY. Add it to .env in the project root and restart the dev server.'
  )
}

const api = axios.create({
  baseURL: 'https://api.restcountries.com/countries/v5',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
})

export async function fetchAllCountries(): Promise<Country[]> {
  try {
    const response = await api.get('', {
      params: {
        limit: 100,
        response_fields:
          'names.common,names.official,codes.alpha_2,codes.alpha_3,capitals,population,region,subregion,area,flag,languages,currencies,timezones,borders,links.google_maps',
      },
    })

    // Log once s
    // console.log('Countries response:', response.data)

    const countries = response.data?.data?.objects
    if (!Array.isArray(countries)) {
      throw new Error('Unexpected response shape: data.objects is not an array')
    }

    return countries
  }    catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      console.error(`Request failed (${status ?? 'no response'})`)
      console.error(
        'Response body:\n' +
          JSON.stringify(err.response?.data ?? err.message, null, 2)
      )
      console.error('Sent from origin:', window.location.origin)
    } else {
      console.error(err)
    }
    throw err
  }
}