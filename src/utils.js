export const fixDateFormat = (date) => {
    const longEnUSFormatter = new Intl.DateTimeFormat('en-US', {
        year:  'numeric',
        month: 'long',
        day:   'numeric',
    })

    let day = date.slice(0,10)
    let time = date.slice(10,16)
    let daydate = new Date(Date.parse(day))
    console.log(longEnUSFormatter.format(daydate) + time)
    return longEnUSFormatter.format(daydate) + time
}

