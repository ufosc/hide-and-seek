"use client";
import { useState, useEffect } from "react";
import { supabase } from "@lib/supabase"; 
import Auth from '@components/Auth';
import Account from '@components/Account';
import { Session } from '@supabase/supabase-js';
import { generateStaticParamsFor, importPage } from "nextra/pages";

import { useMDXComponents } from "../../mdx-components";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(props) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

const Wrapper = useMDXComponents().wrapper;

export default async function Page(props) {
  const params = await props.params;
  const result = await importPage(params.mdxPath);
  const { default: MDXContent, toc, metadata } = result;
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  return (
    <div>
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </div>
  );
}
