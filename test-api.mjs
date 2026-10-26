
const apiKey = process.env.COUNTRIES_API_KEY

const response = await fetch(
  'https://api.restcountries.com/countries/v5?limit=2&response_fields=names.common,codes.alpha_3,population,region,flag',
  {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  },
)

// console.log('Status:', response.status)

const data = await response.json()
// console.log(JSON.stringify(data, null, 2))
