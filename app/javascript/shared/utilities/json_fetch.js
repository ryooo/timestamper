export function JSONFetch(path, successFunction) {
  if (current.blockFetchRequests) return false
  $.ajax({
    url: path,
    method: 'GET',
    dataType: 'json',
    beforeSend: request => current.fetchRequests.push(request) && railsUJS.CSRFProtection,
    context: this,
    success: successFunction,
    error: response => {
      // Don't show alert if request was aborted.
      if (response.readyState != 0) alert('The server failed to load your data. Please reload and try again.')
    }
  })
  return true
}