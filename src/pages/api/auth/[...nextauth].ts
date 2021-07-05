import { query } from 'faunadb'

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna'

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope: 'read:user'
        }),
        // ...add more providers here
    ],


    callbacks: {
        async signIn(user, account, profile) {
            const { email } = user
            try {
                await fauna.query(
                    query.If(
                        query.Not(
                            query.Exists(
                                query.Match(
                                    query.Index('user_by_email'),
                                    query.Casefold(user.email)
                                )
                            )
                        ),
                        query.Create(
                            query.Collection('users'),
                            { data: { email } }
                        ),
                        //Else
                        query.Get(
                            query.Exists(
                                query.Match(
                                    query.Index('user_by_email'),
                                    query.Casefold(user.email)
                                )
                            )
                        )
                    )
                )
                return true
            } catch (err) {
                console.error(err);
            }
        }
    }
})

