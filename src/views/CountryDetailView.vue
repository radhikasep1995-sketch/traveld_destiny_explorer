
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useCountriesStore } from '@/stores/countries'

const route = useRoute()
const store = useCountriesStore()

onMounted(() => {
  if (!store.hasLoaded) {
    store.loadCountries()
  }
})

// Find selected country using alpha-3 code
const country = computed(() => {
  const code = String(route.params.code).toUpperCase()

  return store.countries.find(
    (item) =>
      item.codes.alpha_3 !== '' &&
      item.codes.alpha_3.toUpperCase() === code,
  )
})

// Capital names
const capitalText = computed(() => {
  const capitals = country.value?.capitals

  if (!capitals?.length) return 'Not available'

  return capitals.map((capital) => capital.name).join(', ')
})

// Currency names and symbols
const currencyText = computed(() => {
  const currencies = country.value?.currencies

  if (!currencies?.length) return 'Not available'

  return currencies
    .map((currency) =>
      currency.symbol
        ? `${currency.name} (${currency.symbol})`
        : currency.name,
    )
    .join(', ')
})

// Language names
const languageText = computed(() => {
  const languages = country.value?.languages

  if (!languages?.length) return 'Not available'

  return languages.map((language) => language.name).join(', ')
})

// Area in square kilometers
const areaText = computed(() => {
  const area = country.value?.area

  if (area?.kilometers == null) return 'Not available'

  return `${area.kilometers.toLocaleString()} km²`
})

// Time zones
const timezoneText = computed(() => {
  return country.value?.timezones?.join(', ') || 'Not available'
})

// Border country codes
const borderText = computed(() => {
  const borders = country.value?.borders

  return borders?.length
    ? borders.join(', ')
    : 'No bordering countries listed'
})

// Country flag URL
const flagUrl = computed(() => {
  const flag = country.value?.flag

  return flag?.url_svg || flag?.url_png || ''
})

// Google Maps URL
const mapUrl = computed(() => {
  const url = country.value?.links?.google_maps?.trim()

  // Only allow valid HTTPS map links
  if (!url) return ''

  try {
    const parsedUrl = new URL(url)

    return parsedUrl.protocol === 'https:' ? url : ''
  } catch {
    return ''
  }
})
</script>

<template>
  <main class="detail-page">
    <!-- Header -->
    <header class="topbar">
      <RouterLink to="/" class="brand" aria-label="Wanderly home">
        <span aria-hidden="true">🌍</span>
        Wanderly
      </RouterLink>

      <RouterLink to="/" class="back-link">
        ← Back to destinations
      </RouterLink>
    </header>

    <div class="detail-container">
      <!-- Loading -->
      <p v-if="store.loading" class="message" role="status">
        Loading country details...
      </p>

      <!-- Error -->
      <div v-else-if="store.error" class="message error" role="alert">
        <p>{{ store.error }}</p>

        <button type="button" @click="store.loadCountries()">
          Try again
        </button>
      </div>

      <!-- Country details -->
      <section v-else-if="country" class="country-detail">
        <p class="eyebrow">
          {{ country.region }}
          <span v-if="country.subregion">
            / {{ country.subregion }}
          </span>
        </p>

        <div class="country-heading">
          <div>
            <h1>{{ country.names.common }}</h1>

            <p class="official-name">
              {{ country.names.official }}
            </p>
          </div>

          <span
            v-if="country.flag?.emoji"
            class="country-emoji"
            aria-hidden="true"
          >
            {{ country.flag.emoji }}
          </span>
        </div>

        <!-- Flag -->
        <div class="flag-banner">
          <img
            v-if="flagUrl"
            :src="flagUrl"
            :alt="country.flag?.description || country.names.common + ' flag'"
          />

          <span v-else class="large-emoji" aria-hidden="true">
            {{ country.flag?.emoji || '🌍' }}
          </span>
        </div>

        <!-- Overview -->
        <section class="info-section" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Country overview</h2>

          <div class="info-grid">
            <article class="info-card">
              <span>Capital</span>
              <strong>{{ capitalText }}</strong>
            </article>

            <article class="info-card">
              <span>Population</span>
              <strong>
                {{ country.population.toLocaleString() }}
              </strong>
            </article>

            <article class="info-card">
              <span>Region</span>
              <strong>{{ country.region || 'Not available' }}</strong>
            </article>

            <article class="info-card">
              <span>Subregion</span>
              <strong>{{ country.subregion || 'Not available' }}</strong>
            </article>

            <article class="info-card">
              <span>Area</span>
              <strong>{{ areaText }}</strong>
            </article>

            <article class="info-card">
              <span>Country code</span>
              <strong>
                {{ country.codes.alpha_3 || 'Not available' }}
              </strong>
            </article>

            <article class="info-card">
              <span>Currency</span>
              <strong>{{ currencyText }}</strong>
            </article>

            <article class="info-card">
              <span>Languages</span>
              <strong>{{ languageText }}</strong>
            </article>

            <article class="info-card">
              <span>Time zones</span>
              <strong>{{ timezoneText }}</strong>
            </article>

            <article class="info-card">
              <span>Border codes</span>
              <strong>{{ borderText }}</strong>
            </article>
          </div>
        </section>

        <!-- Map link -->
        <a
          v-if="mapUrl"
          class="map-link"
          :href="mapUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore on Google Maps ↗
        </a>
      </section>

      <!-- Not found -->
      <section v-else class="not-found">
        <div class="not-found-icon" aria-hidden="true">🌍</div>

        <h1>Country not found</h1>

        <p>
          We couldn't find this country in our loaded country data.
        </p>

        <RouterLink to="/" class="back-button">
          Back to destinations
        </RouterLink>
      </section>
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f7fb;
  color: #172a50;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px max(24px, calc((100% - 1100px) / 2));
  background: #fff;
  border-bottom: 1px solid #e8edf4;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #172a50;
  font-size: 21px;
  font-weight: 800;
  text-decoration: none;
}

.back-link {
  color: #3159be;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.brand:focus-visible,
.back-link:focus-visible,
.map-link:focus-visible,
.back-button:focus-visible {
  outline: 3px solid #3159be;
  outline-offset: 4px;
  border-radius: 5px;
}

.detail-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.eyebrow {
  color: #647ba8;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  line-height: 1.7;
}

.country-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: 14px 0 28px;
}

.country-heading h1 {
  margin: 0;
  font-size: clamp(32px, 5vw, 48px);
  letter-spacing: -1px;
  overflow-wrap: anywhere;
}

.official-name {
  color: #71809a;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.country-emoji {
  font-size: 52px;
}

.flag-banner {
  display: grid;
  min-height: 220px;
  max-height: 360px;
  place-items: center;
  overflow: hidden;
  border-radius: 20px;
  background: #e8edf5;
}

.flag-banner img {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 360px;
  object-fit: contain;
}

.large-emoji {
  font-size: 100px;
}

.info-section {
  margin-top: 36px;
}

.info-section h2 {
  margin: 0 0 20px;
  font-size: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.info-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #e7ecf4;
  border-radius: 14px;
  background: #fff;
}

.info-card span {
  color: #71809a;
  font-size: 12px;
}

.info-card strong {
  font-size: 15px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.map-link,
.back-button {
  display: inline-block;
  margin-top: 28px;
  padding: 13px 18px;
  border-radius: 10px;
  background: #3159be;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}

.map-link:hover,
.back-button:hover {
  background: #23469f;
}

.message {
  padding: 24px 0;
  color: #64748b;
}

.error {
  color: #b42318;
}

.error button {
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: #3159be;
  color: #fff;
  cursor: pointer;
}

.not-found {
  padding: 32px 0;
}

.not-found-icon {
  font-size: 42px;
}

.not-found p {
  color: #71809a;
  line-height: 1.7;
}

@media (max-width: 600px) {
  .topbar {
    align-items: flex-start;
    flex-direction: column;
    padding: 18px;
  }

  .detail-container {
    padding: 28px 18px 40px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .flag-banner {
    min-height: 160px;
  }

  .country-emoji {
    font-size: 38px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }
}
</style>
