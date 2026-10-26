
export interface Country {
    names: {
      common: string
      official: string
    }
  
    codes: {
      alpha_2: string
      alpha_3: string
    }
  
    capitals?: {
      name: string
      attributes?: {
        administrative?: boolean
        constitutional?: boolean
        executive?: boolean
        judicial?: boolean
        legislative?: boolean
        primary?: boolean
      }
      coordinates?: {
        lat: number
        lng: number
      }
    }[]
  
    population: number
    region: string
    subregion?: string
  
    area?: {
      kilometers: number
      miles: number
    }
  
    flag?: {
      emoji?: string
      url_svg?: string
      url_png?: string
      description?: string
    }
  
    languages?: {
      name: string
      native_name?: string
      bcp47?: string
      iso639_1?: string
      iso639_2b?: string
      iso639_2t?: string
      iso639_3?: string
    }[]
  
    currencies?: {
      code: string
      name: string
      symbol?: string
    }[]
  
    timezones?: string[]
    borders?: string[]
  
    links?: {
      google_maps?: string
    }
  }
  