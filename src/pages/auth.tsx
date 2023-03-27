import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export const Auth = ({ children, role }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const hasUser = !!session?.user;
  const router = useRouter();

  useEffect(() => {
    if (!loading && !hasUser) {
      router.push('/login');
    }
    // else if (!hasAccess(session, role)) {
    //   router.push('/permission-denied');
    // }
  }, [loading, hasUser]);

  if (loading || !hasUser) {
    return <div>Waiting for session...</div>;
  }

  return children;
};
