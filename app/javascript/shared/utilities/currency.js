import { floor, round } from 'lodash'
import numeral from 'numeral'

export function currencyDisplay(value) {
   return numeral(round(value / 100)).format('0,0円')
}