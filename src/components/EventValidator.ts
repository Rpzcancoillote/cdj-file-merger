const event_validator = (file: MyFile): Validator => {
    const results = file.content.map((line, idx) => {
        const line_errors: string[] = []

        const displaying_idx = idx + 3
        // On vérifie qu'on a bien le bon nombre de colonne
        if (line.length !== 27) {
            line_errors.push(`Ligne ${displaying_idx} - La ligne semble incorrecte ou malformée`)
        }
        // On vérifie le format du titre (FR)
        if (line[0] == null) {
            line_errors.push(`Ligne ${displaying_idx} - Le titre (FR) est manquant`)
        } else if (typeof line[0] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - Le titre (FR) est malformé`)
        }
        // On vérifie le format du titre (EN)
        if (line[1] == null) {
            line_errors.push(`Ligne ${displaying_idx} - Le titre (EN) est manquant`)
        } else if (typeof line[1] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - Le titre (EN) est malformé`)
        }
        // On vérifie le format du partenaire
        if (line[2] == null) {
            line_errors.push(`Ligne ${displaying_idx} - Le partenaire est manquant`)
        } else if (typeof line[2] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - Le partenaire est malformé`)
        }
        // On vérifie le format de l'organisateur
        if (line[3] == null) {
            line_errors.push(`Ligne ${displaying_idx} - L'organisateur est manquant`)
        } else if (typeof line[3] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - L'organisateur est malformé`)
        }
        // On vérifie le format de la description (FR)
        if (line[4] == null) {
            line_errors.push(`Ligne ${displaying_idx} - La description (FR) est manquante`)
        } else if (typeof line[4] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - La description (FR) est malformée`)
        }
        // On vérifie le format de la description (EN)
        if (line[5] == null) {
            line_errors.push(`Ligne ${displaying_idx} - La description (EN) est manquante`)
        } else if (typeof line[5] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - La description (EN) est malformée`)
        }
        // On vérifie la catégorie
        if (line[6] == null) {
            line_errors.push(`Ligne ${displaying_idx} - La catégorie de l'event est manquante`)
        } else if (typeof line[6] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - La catégorie de l'event est malformée`)
        }
        // On vérifie la date de début
        if (line[7] == null) {
            line_errors.push(`Ligne ${displaying_idx} - La date de début de l'event est manquante`)
            // @ts-ignore
        } else if (isNaN(new Date(line[7]))) {
            line_errors.push(`Ligne ${displaying_idx} - La date de début de l'event est malformée`)
        }
        // On vérifie la date de fin
        if (line[8] == null) {
            line_errors.push(`Ligne ${displaying_idx} - La date de fin de l'event est manquante`)
            // @ts-ignore
        } else if (isNaN(new Date(line[8]))) {
            line_errors.push(`Ligne ${displaying_idx} - La date de fin de l'event est malformée`)
        }
        // On vérifie les heures d'ouverture (FR)
        if (line[9] == null) {
            line_errors.push(
                `Ligne ${displaying_idx} - Les horaires d'ouverture (FR) sont manquants`
            )
        } else if (typeof line[9] !== 'string') {
            line_errors.push(
                `Ligne ${displaying_idx} - Les horaires d'ouverture (FR) sont malformés`
            )
        }
        // On vérifie les heures d'ouverture (EN)
        if (line[10] == null) {
            line_errors.push(
                `Ligne ${displaying_idx} - Les horaires d'ouverture (EN) sont manquants`
            )
        } else if (typeof line[10] !== 'string') {
            line_errors.push(
                `Ligne ${displaying_idx} - Les horaires d'ouverture (EN) sont malformés`
            )
        }
        // On vérifie le  public visé
        if (line[11] == null) {
            line_errors.push(`Ligne ${displaying_idx} - Le public visé est manquant`)
        } else if (typeof line[11] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - Les public visé est malformé`)
        }
        // On vérifie l'adresse
        if (line[12] == null) {
            line_errors.push(`Ligne ${displaying_idx} - L'adresse est manquante`)
        } else if (typeof line[12] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - L'adresse est malformée`)
        }
        // On vérifie la latitude
        if (line[13] == null) {
            line_errors.push(`Ligne ${displaying_idx} - La latitude est manquante`)
        } else if (isNaN(Number(line[13]))) {
            line_errors.push(`Ligne ${displaying_idx} - La latitude est malformée`)
        }
        // On vérifie la longitude
        if (line[14] == null) {
            line_errors.push(`Ligne ${displaying_idx} - La longitude est manquante`)
        } else if (isNaN(Number(line[14]))) {
            line_errors.push(`Ligne ${displaying_idx} - La longitude est malformée`)
        }
        // On vérifie le prix
        if (line[15] == null) {
            line_errors.push(`Ligne ${displaying_idx} - Le prix est manquant`)
        } else if (typeof line[15] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - Le prix est malformé`)
        }
        // On vérifie les informations sur le prix (FR)
        if (line[16] == null) {
            line_errors.push(
                `Ligne ${displaying_idx} - Les informations sur le prix (FR) sont manquantes`
            )
        } else if (typeof line[16] !== 'string') {
            line_errors.push(
                `Ligne ${displaying_idx} - Les informations sur le prix (FR) sont malformées`
            )
        }
        // On vérifie les informations sur le prix (EN)
        if (line[17] == null) {
            line_errors.push(
                `Ligne ${displaying_idx} - Les informations sur le prix (EN) sont manquantes`
            )
        } else if (typeof line[17] !== 'string') {
            line_errors.push(
                `Ligne ${displaying_idx} - Les informations sur le prix (EN) sont malformées`
            )
        }
        // On vérifie le site officiel
        if (line[18] == null) {
            line_errors.push(`Ligne ${displaying_idx} - Le site de l'évenement est manquant`)
        } else if (typeof line[18] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - Le site de l'évenement est malformé`)
        }
        // On vérifie le lien instagram
        if (line[19] == null) {
            line_errors.push(`Ligne ${displaying_idx} - Le lien instagram est manquante`)
        } else if (typeof line[19] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - Le lien instagram est malformé`)
        }
        // On vérifie le lien facebook
        if (line[20] == null) {
            line_errors.push(`Ligne ${displaying_idx} - Le lien facebook est manquant`)
        } else if (typeof line[20] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - Le lien facebook est malformé`)
        }
        // On vérifie le lien twitter
        if (line[21] == null) {
            line_errors.push(`Ligne ${displaying_idx} - Le lien twitter est manquant`)
        } else if (typeof line[21] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - Le lien twitter est malformé`)
        }
        // On vérifie la réservation
        if (line[22] == null) {
            line_errors.push(
                `Ligne ${displaying_idx} - L'information sur la réservation est manquante`
            )
        } else if (typeof line[22] !== 'string') {
            line_errors.push(
                `Ligne ${displaying_idx} - L'information sur la réservation est malformée'`
            )
        }
        // On vérifie l'info PMR
        if (line[23] == null) {
            line_errors.push(`Ligne ${displaying_idx} - L'information PMR est manquante`)
        } else if (typeof line[23] !== 'string') {
            line_errors.push(`Ligne ${displaying_idx} - L'information PMR est malformée'`)
        }

        if (line_errors.length === 0) {
            return {
                errors: line_errors,
                validated: {
                    project_id: crypto.randomUUID(), // A AUTOMATISER
                    event_id: crypto.randomUUID(), // A AUTOMATISER
                    event_slug: crypto.randomUUID(), // A AUTOMATISER
                    title_fr: line[0],
                    title_en: line[1],
                    category_id: line[6],
                    category_code: line[6],
                    subcategory_code: line[6],
                    photo_link: 'string', // A AUTOMATISER
                    organization_name: line[3],
                    description_fr: line[4],
                    description_en: line[5],
                    starting_date: new Date(line[7] as string),
                    ending_date: new Date(line[8] as string),
                    opening_times_fr: line[9],
                    opening_times_en: line[9],
                    public: line[11],
                    location: 'string', // A AUTOMATISER DANS ODS ?
                    address: line[12],
                    latitude: Number(line[13]),
                    longitude: Number(line[14]),
                    tarif: line[15],
                    price_description_fr: line[16],
                    price_description_en: line[17],
                    external_link: line[18],
                    instagram_link: line[19],
                    facebook_link: line[20],
                    twitter_link: line[21],
                    additional_link: 'string', // PAS PRÉVU
                    presenting_partner: line[2],
                    partner_logo_url: 'string', // A AUTOMATISER
                    partner_redirection_link: 'string', // A AUTOMATISER
                    reservation: line[22],
                    accessibility: line[23],
                    competition: 'string', // A AUTOMATISER
                },
            }
        } else {
            return { errors: line_errors }
        }
    })
    const events = results.map((a) => a.validated).filter(Boolean) as ValidatedEvent[]
    return { errors: results.map((a) => a.errors).flat(), events }
}

export default event_validator
