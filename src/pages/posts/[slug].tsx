import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import { RichText } from "prismic-dom"
import Head from 'next/head'
import { getPrismicClient } from "../../services/prismic"


import styles from './post.module.scss'

interface PostPros {
    posts: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}


export default function Post({ posts }: PostPros) {
    return (
        <>
            <Head>
                <title>{posts.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{posts.title}</h1>
                    <time>{posts.updatedAt}</time>
                    <div
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: posts.content }}
                    />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req })
    const { slug } = params

    if (!session?.activeSubscription) {
        return {
            redirect: {
                destination: `/posts/preview/${slug}`,
                permanent: false
            }
        }
    }

    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID('ignews', String(slug), {})

    const posts = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            posts
        }
    }


}