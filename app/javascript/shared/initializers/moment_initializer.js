import moment from 'moment'

window.moment = moment
moment.locale('ja')

window.momentUTC = (input, format) => {
 return moment.utc(input, format)
}

window.momentLocalAsUTC = momentUTC().add(moment().utcOffset(), 'minutes')
