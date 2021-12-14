export const getAllUrls = `
    query MyQuery {
        getAllUrlByUser(CreatedBy: "av")
    }
`

export const getLongUrl = `
    query MyQuery($shortUrl: String!) {
        getLongtUrl(ShortUrl: $shortUrl)
    }
`
