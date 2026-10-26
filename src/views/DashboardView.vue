
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'

const store = useCountriesStore()

const searchQuery = ref('')

// Regions required by the assignment
const regions = ['Europe', 'Asia', 'Africa', 'Americas', 'Oceania']

// Load countries when dashboard opens
onMounted(() => {
  if (!store.hasLoaded) {
    store.loadCountries()
  }
})

// Search countries by common name
const filteredCountries = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return store.countries
    // Countries without alpha-3 codes cannot use our detail route
    .filter((country) => country.codes.alpha_3?.trim())
    // Search by country name
    .filter((country) =>
      country.names.common.toLowerCase().includes(query),
    )
})

// Group countries by region and sort by population
const regionSections = computed(() => {
  return regions.map((region) => {
    const countries = filteredCountries.value
      .filter((country) => country.region === region)
      .sort((a, b) => b.population - a.population)

    return {
      name: region,
      countries,
    }
  }).filter((section) => section.countries.length > 0)
})

const hasSearchResults = computed(() => {
  return filteredCountries.value.length > 0
})
</script>

<template>
  <main class="dashboard">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <RouterLink to="/" class="brand" aria-label="Wanderly home">
          <span class="brand-icon" aria-hidden="true">🌍</span>
          <span>Wanderly</span>
        </RouterLink>

        <span class="header-label">
          YOUR TRAVEL DISCOVERY GUIDE
        </span>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content">
          <p class="eyebrow">DISCOVER THE WORLD</p>

          <h1>
            Find your next
            <span>adventure.</span>
          </h1>

          <p class="hero-description">
            Explore countries, cultures and places,
            one destination at a time.
          </p>

          <!-- Search -->
          <div class="search-wrapper">
            <label for="country-search" class="sr-only">
              Search countries by name
            </label>

            <span class="search-icon" aria-hidden="true">⌕</span>

            <input
              id="country-search"
              v-model="searchQuery"
              type="search"
              placeholder="Search countries by name..."
              autocomplete="off"
            />

            <button
              v-if="searchQuery"
              type="button"
              class="clear-search"
              aria-label="Clear search"
              @click="searchQuery = ''"
            >
              ×
            </button>
          </div>

          <p class="search-hint">
            Discover destinations across the globe
          </p>
        </div>
      </div>
    </section>

    <!-- Explore by region -->
    <section class="explore-section">
      <div class="explore-container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">YOUR NEXT ADVENTURE</p>
            <h2>Explore by region</h2>
          </div>

          <p
            v-if="!store.loading && !store.error"
            class="total-count"
          >
            {{ filteredCountries.length }} countries
          </p>
        </div>

        <!-- Loading -->
        <div
          v-if="store.loading"
          class="state-message"
          role="status"
        >
          <span class="loader" aria-hidden="true"></span>
          <p>Discovering destinations...</p>
        </div>

        <!-- Error -->
        <div
          v-else-if="store.error"
          class="state-message error-state"
          role="alert"
        >
          <h3>Unable to load destinations</h3>
          <p>{{ store.error }}</p>

          <button
            type="button"
            class="primary-button"
            @click="store.loadCountries()"
          >
            Try again
          </button>
        </div>

        <!-- Empty search -->
        <div
          v-else-if="!hasSearchResults"
          class="state-message empty-state"
        >
          <div class="empty-icon" aria-hidden="true">⌕</div>

          <h3>No countries found</h3>

          <p>
            Try searching with a different country name.
          </p>

          <button
            type="button"
            class="primary-button"
            @click="searchQuery = ''"
          >
            Clear search
          </button>
        </div>

        <!-- Region lists -->
        <div v-else class="region-sections">
          <section
            v-for="section in regionSections"
            :key="section.name"
            class="region-section"
            :aria-label="section.name + ' countries'"
          >
            <div class="region-heading">
              <div>
                <h3>{{ section.name }}</h3>
                <p>Discover destinations around the globe</p>
              </div>

              <span class="region-count">
                {{ section.countries.length }}
                {{ section.countries.length === 1 ? 'country' : 'countries' }}
              </span>
            </div>

            <!-- Horizontal country list -->
            <div
              class="country-list"
              tabindex="0"
              :aria-label="section.name + ' country cards. Scroll horizontally to explore more.'"
            >
              <RouterLink
                v-for="country in section.countries"
                :key="country.codes.alpha_3"
                :to="`/country/${country.codes.alpha_3}`"
                class="country-card"
              >
                <!-- Flag -->
                <div class="flag-wrapper">
                  <img
                    v-if="country.flag?.url_svg || country.flag?.url_png"
                    :src="country.flag.url_svg || country.flag.url_png"
                    :alt="
                      country.flag.description ||
                      `${country.names.common} flag`
                    "
                    class="country-flag"
                    loading="lazy"
                  />

                  <span
                    v-else
                    class="flag-fallback"
                    aria-hidden="true"
                  >
                    {{ country.flag?.emoji || '🌍' }}
                  </span>
                </div>

                <!-- Card information -->
                <div class="country-card-content">
                  <h4 class="country-name">
                    {{ country.names.common }}
                  </h4>

                  <p class="country-capital">
                    {{ country.capitals?.[0]?.name || 'Capital unavailable' }}
                  </p>

                  <div class="country-population">
                    <span>Population</span>
                    <strong>
                      {{ country.population.toLocaleString() }}
                    </strong>
                  </div>

                  <span class="explore-link">
                    Explore country
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </RouterLink>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <footer class="footer">
          <p>Made for curious minds. 🌍</p>
          <p>Discover more. Explore further.</p>
        </footer>
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fb;
  color: #172a50;
}

/* Header */

.header {
  background: #ffffff;
  border-bottom: 1px solid #e9edf4;
}

.header-inner {
  max-width: 1180px;
  min-height: 76px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #172a50;
  text-decoration: none;
  font-size: 22px;
  font-weight: 800;
}

.brand-icon {
  font-size: 26px;
}

.header-label {
  color: #75839d;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.3px;
}

/* Hero */

.hero {
  background: #ffffff;
}

.hero-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 42px 24px 44px;
}

.hero-content {
  max-width: 660px;
}

.eyebrow {
  margin: 0 0 12px;
  color: #4567bd;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.hero h1 {
  margin: 0;
  max-width: 620px;
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.12;
  letter-spacing: -1.8px;
}

.hero h1 span {
  color: #3159be;
}

.hero-description {
  margin: 16px 0 26px;
  color: #71809a;
  font-size: 15px;
  line-height: 1.7;
}

/* Search */

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 590px;
  min-height: 56px;
  padding: 0 16px;
  border: 1px solid #dbe3f0;
  border-radius: 14px;
  background: #f8faff;
  transition: border-color 0.2s ease;
}

.search-wrapper:focus-within {
  border-color: #3159be;
  outline: 2px solid #3159be;
  outline-offset: 2px;
}

.search-icon {
  color: #647ba8;
  font-size: 26px;
  line-height: 1;
}

.search-wrapper input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #172a50;
  font: inherit;
  font-size: 14px;
}

.search-wrapper input::placeholder {
  color: #8290a8;
}

.clear-search {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: #e8edf7;
  color: #172a50;
  font-size: 21px;
  cursor: pointer;
}

.search-hint {
  margin: 10px 0 0;
  color: #8793a8;
  font-size: 12px;
}

/* Main exploration */

.explore-section {
  padding: 42px 0 60px;
}

.explore-container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 34px;
}

.section-heading .eyebrow {
  margin-bottom: 8px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(26px, 3vw, 34px);
  letter-spacing: -0.8px;
}

.total-count {
  flex-shrink: 0;
  color: #647ba8;
  font-size: 13px;
}

/* Regions */

.region-section {
  margin-bottom: 40px;
}

.region-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.region-heading h3 {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.4px;
}

.region-heading p {
  margin: 6px 0 0;
  color: #71809a;
  font-size: 12px;
  line-height: 1.5;
}

.region-count {
  flex-shrink: 0;
  color: #647ba8;
  font-size: 12px;
}

/* Country horizontal list */

.country-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 6px 3px 16px;
  scroll-snap-type: x proximity;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #c5d0e3 transparent;
}

.country-list:focus-visible {
  outline: 2px solid #3159be;
  outline-offset: 3px;
  border-radius: 10px;
}

.country-card {
  flex: 0 0 210px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e6ebf3;
  border-radius: 17px;
  background: #ffffff;
  color: #172a50;
  text-decoration: none;
  scroll-snap-align: start;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.country-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(23, 42, 80, 0.09);
}

.country-card:focus-visible {
  outline: 3px solid #3159be;
  outline-offset: 3px;
}

.flag-wrapper {
  display: grid;
  height: 132px;
  flex-shrink: 0;
  place-items: center;
  overflow: hidden;
  background: #edf1f7;
}

.country-flag {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.flag-fallback {
  font-size: 48px;
}

.country-card-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 9px;
  padding: 14px;
}

.country-name {
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.country-capital {
  min-height: 20px;
  margin: 0;
  color: #71809a;
  font-size: 13px;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.country-population {
  margin-top: auto;
  padding-top: 8px;
}

.country-population span {
  display: block;
  margin-bottom: 4px;
  color: #71809a;
  font-size: 12px;
}

.country-population strong {
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}

.explore-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
  color: #3159be;
  font-size: 12px;
  font-weight: 700;
}

/* Loading, error and empty states */

.state-message {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  text-align: center;
}

.state-message h3,
.state-message p {
  margin: 0;
}

.state-message p {
  color: #71809a;
  line-height: 1.7;
}

.loader {
  width: 34px;
  height: 34px;
  border: 3px solid #dbe3f0;
  border-top-color: #3159be;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.primary-button {
  padding: 12px 18px;
  border: 0;
  border-radius: 10px;
  background: #3159be;
  color: #ffffff;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button:hover {
  background: #23469f;
}

.primary-button:focus-visible,
.clear-search:focus-visible {
  outline: 3px solid #3159be;
  outline-offset: 3px;
}

.error-state {
  color: #b42318;
}

.empty-icon {
  color: #3159be;
  font-size: 38px;
}

/* Footer */

.footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e4eaf3;
  color: #8793a8;
  font-size: 12px;
}

.footer p {
  margin: 0;
}

/* Screen-reader-only label */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Responsive */

@media (max-width: 600px) {
  .header-inner {
    min-height: 64px;
    padding: 14px 18px;
  }

  .header-label {
    display: none;
  }

  .hero-inner {
    padding: 32px 18px;
  }

  .explore-section {
    padding: 32px 0 44px;
  }

  .explore-container {
    padding: 0 18px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 26px;
  }

  .region-heading h3 {
    font-size: 20px;
  }

  .country-card {
    flex-basis: 180px;
  }

  .flag-wrapper {
    height: 112px;
  }

  .footer {
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    scroll-behavior: auto !important;
    transition: none !important;
  }

  .country-card:hover {
    transform: none;
  }
}
</style>
