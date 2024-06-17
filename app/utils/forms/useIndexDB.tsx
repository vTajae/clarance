import UserService from 'api_v2/userService';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ApplicantFormValues } from '~/components/form86/lastTry/formDefinition';
import { useTypedSelector } from '~/state/hooks/user';
import { RootState } from '~/state/store';
import { setLoading } from '~/state/user/userSlice';

function useIndexedDB(section: string) {
  const [data, setData] = useState<ApplicantFormValues | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const dispatch = useDispatch();

  const isLoading = useTypedSelector(
    (state: RootState) => state.user.value.context.isLoading
  );


  useEffect(() => {
    async function fetchData() {
      dispatch(setLoading(true)); // Set loading to true at the start of the operation
      const userService = new UserService();

      try {
        const { formData } = await userService.loadUserFormData(section);
        setData(formData || null);
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setError(e as Error);
      } finally {
        dispatch(setLoading(false)); // Ensure loading is set to false upon completion or failure
      }
    }

    fetchData();
  }, [section, dispatch]); // Include dispatch in the dependency array

  return { data, isLoading, error };
}

export default useIndexedDB;
