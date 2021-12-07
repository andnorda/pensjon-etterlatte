// export const emailMatcher = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
export const emailMatcher = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const partialKontonrMatcher = /^([1-9]\d{0,3})\.?(\d{0,2})\.?(\d{0,5})$/
export const kontonrMatcher = /^[1-9]\d{3}\.\d{2}\.\d{5}$/

export const partialTelefonnrMatcher = /^([1-9]\d{0,2})\s?(\d{0,2})\s?(\d{0,3})$/
export const telefonnrMatcher = /^([1-9]\d{2})\s(\d{2})\s(\d{3})$/

export const partialProsentMatcher = /^(100%?|[1-9]?\d%?)$/
export const prosentMatcher = /^(100|[1-9]?\d)%?$/