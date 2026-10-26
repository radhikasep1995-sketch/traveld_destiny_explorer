
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchAllCountries } from '@/services/countriesApi'
import type { Country } from '@/types/country'

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasLoaded = ref(false)

  async function loadCountries() {
    // Avoid unnecessary duplicate requests
    if (loading.value || hasLoaded.value) return

    loading.value = true
    error.value = null

    try {
      countries.value = await fetchAllCountries()
      hasLoaded.value = true
    } catch (err) {
      console.error('Failed to load countries:', err)
      error.value = 'Unable to load countries. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return {
    countries,
    loading,
    error,
    hasLoaded,
    loadCountries,
  }
})
