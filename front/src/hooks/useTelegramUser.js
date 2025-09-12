import { useState, useEffect, useRef } from 'react';

export const useTelegramUser = (telegramUser) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false); // флаг "запрос уже выполнен"

  useEffect(() => {
    if (fetchedRef.current) return; // если уже выполняли, выходим
    fetchedRef.current = true;

    const fetchUser = async () => {
      try {
        const queryParams = new URLSearchParams(telegramUser).toString();
        const url = `http://localhost:8000/get_or_create_user?${queryParams}`;
        const response = await fetch(url);
        const data = await response.json();

        setUser(data.user);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [telegramUser]);

  return { user, loading, error };
};
