export interface CountryCodes {
    code: string;
    country: string;
}

// https://github.com/google/libphonenumber/blob/master/FAQ.md#why-are-bouvet-island-bv-pitcairn-island-pn-antarctica-aq-etc-not-supported
export const ISO_3166_1_CODES: CountryCodes[] = [
    {code: 'DE', country: 'Alemania'},
    {code: 'AG', country: 'Antigua y Barbuda'},
    {code: 'AR', country: 'Argentina'},
    {code: 'AU', country: 'Australia'},
    {code: 'BS', country: 'Bahamas'},
    {code: 'BZ', country: 'Belice'},
    {code: 'BO', country: 'Bolivia'},
    {code: 'BR', country: 'Brazil'},
    {code: 'CV', country: 'Cabo Verde'},
    {code: 'CA', country: 'Canada'},
    {code: 'CL', country: 'Chile'},
    {code: 'CN', country: 'China'},
    {code: 'CO', country: 'Colombia'},
    {code: 'CG', country: 'Congo'},
    {code: 'CR', country: 'Costa Rica'},
    {code: 'CU', country: 'Cuba'},
    {code: 'CW', country: 'Curaçao'},
    {code: 'EC', country: 'Ecuador'},
    {code: 'SV', country: 'El Salvador'},
    {code: 'US', country: 'Estados Unidos'},
    {code: 'ES', country: 'España'}, 
    {code: 'FR', country: 'Francia'},
    {code: 'GT', country: 'Guatemala'},
    {code: 'GY', country: 'Guyana'},
    {code: 'HT', country: 'Haiti'},
    {code: 'HN', country: 'Honduras'},
    {code: 'IT', country: 'Itallia'},
    {code: 'JM', country: 'Jamaica'},
    {code: 'JP', country: 'Japón'},
    {code: 'MX', country: 'Mexico'},
    {code: 'NI', country: 'Nicaragua'},
    {code: 'PA', country: 'Panama'},
    {code: 'PY', country: 'Paraguay'},
    {code: 'PE', country: 'Peru'},
    {code: 'PT', country: 'Portugal'},
    {code: 'PR', country: 'Puerto Rico'},
    {code: 'QA', country: 'Qatar'},
    {code: 'DO', country: 'Republica dominicana'},
    {code: 'UY', country: 'Uruguay'},
    {code: 'VE', country: 'Venezuela'},
];
