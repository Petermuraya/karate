-- Verify admin roles for the two emails
SELECT a.email, ur.role
FROM public.user_roles ur
JOIN auth.users a ON a.id = ur.user_id
WHERE a.email IN ('sammypeteri944@gmail.com','kevokiash@gmail.com');
