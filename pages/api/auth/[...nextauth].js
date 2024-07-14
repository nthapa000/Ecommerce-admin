import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// const adminEmails = ['nishantthapa000000000@gmail.com']

export default NextAuth({
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter:  MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,
  callbacks:{
    session:({session,token,user}) => {
      // console.log({session,token,user})
      // if(adminEmails.includes(session?.user?.email)){
      //   return session;
      // }else{
      //   return false;
      // }
      return session;
    },
  }
})