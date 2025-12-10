-- Update demo user passwords with correct hashes
-- Run this in your Supabase SQL Editor to fix the demo passwords

UPDATE users SET password_hash = '$2a$10$14dU0eEhJI9RA10dcs6XOOoFjkp.PD5Ppl09ECAMRsOY3.RvbxDJu' WHERE email = 'worker@taskapp.com';
UPDATE users SET password_hash = '$2a$10$JzsAXTKC8kgk/HIRf0DW7efPrVXPTOWjNMQRPDVXCIZHX8EJiM1T6' WHERE email = 'employer@taskapp.com';
UPDATE users SET password_hash = '$2a$10$t6O4uNmWJWs24cMuWzpbVuKvxcGsWKmTlYci5Kjb2oPVOGEwU8wO6' WHERE email = 'admin@taskapp.com';

-- Verify the updates
SELECT email, 
       CASE 
         WHEN email = 'worker@taskapp.com' THEN 'worker123'
         WHEN email = 'employer@taskapp.com' THEN 'employer123'
         WHEN email = 'admin@taskapp.com' THEN 'admin123'
       END as password,
       role 
FROM users 
WHERE email IN ('worker@taskapp.com', 'employer@taskapp.com', 'admin@taskapp.com');