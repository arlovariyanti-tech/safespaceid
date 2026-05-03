
REVOKE ALL ON FUNCTION public.join_school(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_school(TEXT, TEXT) TO authenticated;
