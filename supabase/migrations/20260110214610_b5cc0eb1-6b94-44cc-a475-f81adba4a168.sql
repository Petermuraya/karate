-- Drop the overly permissive notification insert policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Create a more secure policy that allows instructors/admins to create notifications
-- and also allows the system (via triggers/functions) to create them using service role
CREATE POLICY "Instructors can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'instructor'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow instructors to also manage roles (not just admins)
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins and instructors can manage roles"
ON public.user_roles
FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'instructor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'instructor'::app_role)
);