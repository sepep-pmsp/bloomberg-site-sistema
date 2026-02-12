import { useState, useEffect } from 'react';
import ContentService from '../service/ContentService'; 

export function usePageContent(pageName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await ContentService.getPageContent(pageName);
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError(err.message || 'Erro desconhecido');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [pageName]); 

  return { data, loading, error };
}