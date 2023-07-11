export const createPostQuery = `
mutation CreatePostTypedData($profileId: ProfileId!, $url: Url!) {
  createPostTypedData(request: {
    profileId: $profileId,
    contentURI: $url,
    collectModule: {
      freeCollectModule: {
        followerOnly: false
      }
    },
    referenceModule: {
      followerOnlyReferenceModule: false
    }
  }) {
    id
    expiresAt
    typedData {
      types {
        PostWithSig {
          name
          type
        }
      }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
    }
  }
}
`;

export const getPublicationsQuery = `
query Publications($profileId: ProfileId!, $observer: EthereumAddress!) {
  publications(request: {
    profileId: $profileId,
    publicationTypes: [POST],
    limit: 10
  }) {
    items {
      __typename 
      ... on Post {
        ...PostFields
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}

fragment MediaFields on Media {
  url
  mimeType
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
     displayType
     traitType
     key
     value
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  ownedBy
  dispatcher {
    address
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
  }
}

fragment PublicationStatsFields on PublicationStats { 
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
  totalUpvotes
  totalDownvotes
}

fragment MetadataOutputFields on MetadataOutput {
  name
  description
  content
  media {
    original {
      ...MediaFields
    }
  }
  attributes {
    displayType
    traitType
    value
  }
  encryptionParams {
    encryptionProvider
    accessCondition {
      ...AccessConditionFields
    }
    encryptedFields {
      content
    }
    providerSpecificParams {
      encryptionKey
    }
  }
}

fragment AccessConditionFields on AccessConditionOutput {
  or{
    criteria {
      nft {
        contractAddress
        chainID
        contractType
        tokenIds
      }
      profile {
        profileId
      }
    }
  }
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  appId
  hidden
  isGated
  canDecrypt(address: $observer) {
    result
    reasons
    extraDetails
  }
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}
`;
