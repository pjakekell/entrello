// import React from 'react'
// import { countries } from 'i18n-iso-countries/langs/de.json'
// import { regions } from 'country-data'
// import { Select } from '@blueprintjs/select'
// import { Button, MenuItem, } from '@blueprintjs/core'
// import { useIntl } from 'react-intl'
// import concat from 'lodash/concat'

// const europaCountries = concat(regions.westernEurope.countries, regions.easternEurope.countries, regions.southernEurope.countries)

// const countryOpts = europaCountries.map(ccode => ({ value: ccode, label: countries[ccode] }))

// export default function CountrySelect ({ onChange, value }) {
//   const { formatMessage: f } = useIntl()

//   return (
//     <Select
//       items={countryOpts}
//       itemPredicate={(query, item, _index, exactMatch) => {
//         const normalizedValue = item.value.toLowerCase()
//         const normalizedQuery = query.toLowerCase()

//         if (exactMatch) {
//           return normalizedValue === normalizedQuery
//         } else {
//           return `${normalizedValue}`.indexOf(normalizedQuery) >= 0
//         }
//       }}
//       popoverProps={{ minimal: true }}
//       itemRenderer={(item, { modifiers }) => (<MenuItem
//         active={item.value === value}
//         disabled={modifiers.disabled}
//         label={item.label}
//         key={item.value}
//         onClick={() => onChange(item.value)}
//         text={item.label}
//       />)}
//     >
//       <Button
//         text={value ? countries[value] : f({ id: 'please select' })}
//         rightIcon="double-caret-vertical"
//       />
//     </Select>
//   )
// }
