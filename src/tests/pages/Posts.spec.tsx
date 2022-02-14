import { render, screen } from '@testing-library/react';
import { getPrismicClient } from '../../services/prismic';
import Posts, { getStaticProps } from '../../pages/posts';
import { mocked } from 'ts-jest/utils';

const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    excerpt: 'Post excerpt',
    updatedAt: 'February 15',
  },
];

jest.mock('../../services/prismic');

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [{ type: 'heading', text: 'My New Post' }],
              content: [{ type: 'paragraph', text: 'Post excerpt' }],
            },
            last_publication_date: '02-02-2022',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My New Post',
              excerpt: 'Post excerpt',
              updatedAt: '02 de fevereiro de 2022',
            },
          ],
        },
      })
    );
  });
});
