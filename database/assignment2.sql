-- Data for table 'account'
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Update account type for Tony Stark to 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Delete account for Tony Stark
DELETE FROM public.account
WHERE account_id = 1;
-- Update and Replace on the 'inventory' table
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- Select all vehicles with 'Sport' classification
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
--Update and replace on the 'inventory' to add vehicles to the middle of the file path
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');