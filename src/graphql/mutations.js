export const createShortUrl = `
    mutation MyMutation($createdBy: String!, $longUrl: String!, $description: String!) {
        createShortUrl(CreatedBy: $createdBy, LongUrl: $longUrl, Description: $description)
    }
`;

export const deleteShortUrl = `
    mutation MyMutation($longUrl: String!, $createdBy: String!) {
        deleteUrlEntry(CreatedBy: $createdBy, LongUrl: $longUrl)
    }
`;

export const renewShortUrl = `
    mutation MyMutation($longUrl: String!, $createdBy: String!) {
        renewUrl(CreatedBy: $createdBy, LongUrl: $longUrl)
    }
`;
export const editDescription = `
    mutation MyMutation($createdBy: String!, $longUrl: String!, $description: String!) {
        editDescription(CreatedBy: $createdBy, LongUrl: $longUrl, Description: $description)
    }
`;
