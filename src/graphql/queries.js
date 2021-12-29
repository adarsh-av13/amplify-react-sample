export const getAllUrls = `
    query MyQuery($createdBy: String!) {
        getAllUrlByUser(CreatedBy: $createdBy) {
            AttributeList {
                CreatedAt
                CreatedBy
                ExpiresAt
                LongUrl
                ModifiedAt
                NumberOfClicks
                ShortUrl
                Tags
                Description
              }
              Message
              StatusCode
        }
    }
`

export const getLongUrl = `
    query MyQuery($shortUrl: String!) {
        getLongUrl(ShortUrl: $shortUrl) {
            LongUrl
            Message
            ShortUrl
            StatusCode
        }
    }
`

