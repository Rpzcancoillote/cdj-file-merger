declare type Cell = string | number | boolean | typeof Date
declare type Row = Cell[]

interface MyFile {
    filename: string
    content: Row[]
}

interface MyAnalyzedFiles {
    filename: string
    errors: string[]
    events: ValidatedEvent[]
}

interface Validator {
    errors: string[]
    events: ValidatedEvent[]
}

interface ValidatedEvent {
    project_id: string
    event_id: string
    event_slug: string
    title_fr: string
    title_en: string
    category_id: string
    category_code: string
    subcategory_code: string
    photo_link: string
    organization_name: string
    description_fr: string
    description_en: string
    starting_date: Date
    ending_date: Date
    opening_times_fr: string
    opening_times_en: string
    public: string
    location: string
    address: string
    latitude: number
    longitude: number
    tarif: string
    price_description_fr: string
    price_description_en: string
    external_link: string
    instagram_link: string
    facebook_link: string
    twitter_link: string
    additional_link: string
    presenting_partner: string
    partner_logo_url: string
    partner_redirection_link: string
    reservation: string
    accessibility: string
    competition: string
}
