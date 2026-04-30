import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (!existing) {
          await supabase.from("users").insert({
            email: user.email,
            google_id: user.id,
            prompts_used: 0,
            prompts_paid: 0,
          });
        }
        return true;
      } catch (e) {
        return true;
      }
    },

    async session({ session }) {
      const { data: userData } = await supabase
        .from("users")
        .select("prompts_used, prompts_paid")
        .eq("email", session.user.email)
        .single();

      if (userData) {
        session.user.prompts_used = userData.prompts_used;
        session.user.prompts_paid = userData.prompts_paid;
      }
      return session;
    },
  },
  pages: {
    signIn: "/generar",
  },
};

export default NextAuth(authOptions);