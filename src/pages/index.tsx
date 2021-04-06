import { useEffect } from 'react';
import { useRouter } from 'next/router';

function index() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      router.replace('/demo/login');
    }
  }, [])

  return (
    <></>
  )
}

export default index