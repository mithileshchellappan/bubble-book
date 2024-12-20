import { gql } from '@apollo/client';

export const GET_STORIES = gql`
  query GetStories {
    stories {
      id
      title
      genre
      theme
      currentPage
      createdAt
      pages {
        id
        text
        imageUrl
        panels {
          id
          imageUrl
          imagePrompt
          order
          imageStatus
        }
      }
    }
  }
`;

export const GET_STORY = gql`
  query GetStory($id: ID!) {
    story(id: $id) {
      id
      title
      genre
      theme
      currentPage
      createdAt
      pages {
        id
        text
        imageUrl
        panels {
          id
          imageUrl
          imagePrompt
          order
          imageStatus
        }
      }
    }
  }
`;

export const GENERATE_STORY_DRAFT = gql`
  query GenerateStoryDraft($prompt: String!, $genre: Genre!, $theme: Theme!, $pageCount: Int!) {
    storyDraft(prompt: $prompt, genre: $genre, theme: $theme, pageCount: $pageCount) {
      title
      pages {
        text
        panels {
          imagePrompt
        }
      }
    }
  }
`;

export const GENERATE_FULL_STORY = gql`
  mutation GenerateFullStory($draft: StoryDraftInput!) {
    generateFullStory(draft: $draft) {
      id
      title
      genre
      theme
      currentPage
      createdAt
      pages {
        id
        text
        imageUrl
        panels {
          id
          imageUrl
          imagePrompt
          order
          imageStatus
        }
      }
    }
  }
`;

export const UPDATE_PAGE = gql`
  mutation UpdatePage($storyId: ID!, $pageId: ID!, $customPrompt: String!) {
    updatePage(storyId: $storyId, pageId: $pageId, customPrompt: $customPrompt) {
      id
      pages {
        id
        customPrompt
      }
    }
  }
`;

export const REGENERATE_IMAGE = gql`
  mutation RegenerateImage($storyId: ID!, $pageId: ID!, $panelId: ID!) {
    regenerateImage(storyId: $storyId, pageId: $pageId, panelId: $panelId) {
      id
      imageUrl
      imageStatus
    }
  }
`;

export const DELETE_STORY = gql`
  mutation DeleteStory($id: ID!) {
    deleteStory(id: $id)
  }
`; 