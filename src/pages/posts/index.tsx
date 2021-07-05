import { GetStaticProps } from 'next'
import Head from 'next/head'
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'

export default function Posts() {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href="#">
                        <time>12 de março de 2019</time>
                        <strong>Dark Mode com CSS — mudando a aparência do Blog de maneira simples e rápida</strong>
                        <p>Umas das funcionalidades que está na moda em Blogs e Sites é o Dark Mode. Devs, em sua maioria, curtem bastante utilizar temas escuros, tanto na IDE quanto em outros apps.</p>
                    </a>
                    <a href="#">
                        <time>12 de março de 2019</time>
                        <strong>Dark Mode com CSS — mudando a aparência do Blog de maneira simples e rápida</strong>
                        <p>Umas das funcionalidades que está na moda em Blogs e Sites é o Dark Mode. Devs, em sua maioria, curtem bastante utilizar temas escuros, tanto na IDE quanto em outros apps.</p>
                    </a>
                    <a href="#">
                        <time>12 de março de 2019</time>
                        <strong>Dark Mode com CSS — mudando a aparência do Blog de maneira simples e rápida</strong>
                        <p>Umas das funcionalidades que está na moda em Blogs e Sites é o Dark Mode. Devs, em sua maioria, curtem bastante utilizar temas escuros, tanto na IDE quanto em outros apps.</p>
                    </a>
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'post')
    ], {
        fetch: ['post.title', 'post.content'],
        pageSize: 100
    })

    console.log(JSON.stringify(response, null, 2))

    return {
        props: {}
    }
}