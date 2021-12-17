export const getAllUrls = `
    query MyQuery($createdBy: String!) {
        getAllUrlByUser(CreatedBy: $createdBy)
    }
`

export const getLongUrl = `
    query MyQuery($shortUrl: String!) {
        getLongtUrl(ShortUrl: $shortUrl)
    }
`
