export const createShortUrl = `
    mutation MyMutation($createdBy: String!, $longUrl: String!, $description: String!, $tags: [String!], $customUrlFlag: Boolean,
		$customUrl: String) {
        createShortUrl(CreatedBy: $createdBy, LongUrl: $longUrl, Description: $description, Tags: $tags, CustomUrlFlag: $customUrlFlag,
            CustomUrl: $customUrl) {
            Message
            StatusCode
            Attributes {
            CreatedAt
            CreatedBy
            Description
            ExpiresAt
            LongUrl
            ModifiedAt
            NumberOfClicks
            ShortUrl
            Tags
    }
        }
    }
`;

export const deleteShortUrl = `
    mutation MyMutation($longUrl: String!, $createdBy: String!) {
        deleteUrlEntry(CreatedBy: $createdBy, LongUrl: $longUrl) {
            Message
            StatusCode
        }
    }
`;

export const renewShortUrl = `
    mutation MyMutation($longUrl: String!, $createdBy: String!) {
        renewUrl(CreatedBy: $createdBy, LongUrl: $longUrl) {
            Message
            StatusCode
        }
    }
`;
export const editDescription = `
    mutation MyMutation($createdBy: String!, $longUrl: String!, $description: String!, $tags: [String!]) {
        editDescription(CreatedBy: $createdBy, LongUrl: $longUrl, Description: $description, Tags: $tags) {
            Message
            StatusCode
        }
    }
`;
