-- Add admin role for two instructor emails
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE email IN ('sammypeteri944@gmail.com','kevokiash@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
