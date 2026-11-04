-- ==============================================================================
-- HALL KHOJ FINDER — PRODUCTION SEED DATA (MIGRATED FROM BACKEND/DATA)
-- Generated on: 2026-11-04T12:45:11.172Z
-- ==============================================================================

BEGIN;

-- 1. CATEGORIES
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('5ad5ad53-e934-4d8c-a057-44611117e3b1', 'Marriage Hall', 'विवाह भवन / मैरिज हॉल', 'marriage-hall', '🏰', 'Expansive marriage palaces and banquet gardens with AC rooms, mandap, and reception halls.', 65000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('d373a872-b1b1-4050-a828-776abf2868ec', 'Banquet Hall', 'बैंक्वेट हॉल', 'banquet-hall', '🏛️', 'Climate-controlled luxury banquet halls ideal for weddings, sangeet, and large celebrations.', 50000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('958cb764-839f-4709-ae0b-f4a4aec5e684', 'Party Hall', 'पार्टी हॉल', 'party-hall', '🎉', 'Cozy indoor halls perfect for birthday parties, anniversaries, ring ceremonies, and kitty parties.', 25000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('fa9745b6-bc1f-495d-a803-b0e441aa6ea8', 'Wedding Venue', 'वेडिंग वेन्यू', 'wedding-venue', '💍', 'Full-destination wedding properties with bridal villas, vast parking, and pre-wedding photoshoot lawns.', 95000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('9fa64e9e-c2c2-4a45-a71f-ca3e2c049388', 'Resort', 'रिसॉर्ट', 'resort', '🌴', 'Scenic luxury resorts with swimming pools, cottages, and sprawling outdoor event lawns.', 120000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('019c27ec-f8db-4a58-ad9a-afe1d1e8eb9a', 'Community Hall', 'सामुदायिक भवन', 'community-hall', '🏢', 'Affordable municipal and community centers suited for neighborhood events and cultural functions.', 15000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('b478494e-55b0-40fa-a92b-bdcc0bf8c471', 'Tent House', 'टेंट हाउस', 'tent-house', '🎪', 'Waterproof German hangers, elegant shamianas, VIP carpets, and regal canopy structures.', 25000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('044d1970-9010-4369-aa30-d5462ed773f2', 'Decoration', 'डेकोरेशन / मंडप सजावट', 'decoration', '✨', 'Bespoke stage decoration, floral entry gates, fairy-light tunnels, and theme backdrops.', 20000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('07ab2423-11db-4d88-afb0-3e4a25092781', 'Catering', 'कैटरिंग सेवा', 'catering', '🍲', 'Authentic North Indian, Awadhi, pure veg, and multi-cuisine buffet spreads with live counters.', 650)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('1b207254-7afb-45e4-af33-b016751ed360', 'Photography', 'फोटोग्राफी', 'photography', '📸', 'Candid wedding photography, pre-wedding couple shoots, and luxury photo albums.', 35000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('94ba1420-de47-4f29-adeb-077e95091710', 'Videography', 'वीडियोग्राफी / सिनेमैटिक', 'videography', '🎥', 'Cinematic 4K teaser films, drone aerial coverage, live LED broadcast, and traditional video.', 40000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('64ca6097-2a6e-4926-a1c4-b9d31080c687', 'DJ', 'डीजे सर्विस', 'dj', '🎧', 'Celebrity club DJs, Bollywood sangeet mixes, bass rumbles, and energetic dance floor vibes.', 18000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('6aee8642-8ff8-4491-ae7e-9767c8d5fdcc', 'Sound System', 'साउंड सिस्टम', 'sound-system', '🔊', 'Line-array acoustic speakers, wireless cordless microphones, subwoofers, and audio mixers.', 12000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('8e0cc612-e58b-4376-a289-60e92c9b89e8', 'Lighting', 'लाइटिंग सेटअप', 'lighting', '💡', 'Sharpy beam moving heads, warm ambient halogen halters, par cans, and architectural wash lights.', 15000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('5b96bcc3-81cf-4ad5-a510-b5c0a52a6b3e', 'Flower Decoration', 'फूल सजावट', 'flower-decoration', '🌸', 'Fresh orchids, marigold cascades, Kolkata roses, and carnations for stage, mandap, and car decor.', 18000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('fd87f596-9eca-422e-aca6-67dd742f916d', 'Furniture', 'फर्नीचर रेंटल', 'furniture', '🪑', 'Maharaja sofa sets, chiavari banquet chairs, round banquet tables, and bar stools.', 10000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('d77f7ad2-f99c-4f54-a7d8-64a09e8b9270', 'Event Staff', 'इवेंट स्टाफ / कोऑर्डिनेटर', 'event-staff', '👔', 'Bilingual event hosts, trained uniform waiters, bouncers, security guards, and valet parking team.', 8000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('a812ce6d-3313-44f5-ab9f-6c22fdd32d43', 'Wedding Car', 'वेडिंग कार / दूल्हा गाड़ी', 'wedding-car', '🚗', 'Decorated Mercedes, Audi, BMW, and vintage luxury convertibles for baraat and vidaai.', 15000)
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.venue_categories (id, name, hindi_name, slug, icon, description, starting_price)
VALUES ('4a268c7f-b045-4517-a568-c5c15f70e184', 'Other Event Services', 'अन्य इवेंट सेवाएं', 'other-services', '🎪', 'Band baaja, dholak troupe, firework displays, mehndi artists, and event generators.', 10000)
ON CONFLICT (slug) DO NOTHING;

-- 2. PROFILES & ROLES
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('84736156-3eb5-448d-a230-329f9f122e9a', 'Test Customer', 'test_1789828781990@hallkhoj.com', '9876543210', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('84736156-3eb5-448d-a230-329f9f122e9a', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('c132f2e6-b9bc-4ace-a610-a80afc90327f', 'Priya Sharma', 'customer_1789829846386@hallkhoj.com', '9876501234', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('c132f2e6-b9bc-4ace-a610-a80afc90327f', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('de2ca6c0-d244-418f-ae87-82d681764403', 'Vikram Singh', 'owner_1789829846386@hallkhoj.com', '9876509876', 'Uttar Pradesh', 'Varanasi', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('de2ca6c0-d244-418f-ae87-82d681764403', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('3d295277-159b-44b2-aad2-15c119e29a26', 'Test Customer', 'test_1789829894663@hallkhoj.com', '9810000003', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('3d295277-159b-44b2-aad2-15c119e29a26', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('8e67593d-f06b-4bf3-ada4-2a7c1ce058c3', 'Manish Kumar', 'mkumar25843@gmail.com', '6203025057', 'Bihar', 'Chapra', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('8e67593d-f06b-4bf3-ada4-2a7c1ce058c3', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('5238729c-2ad5-4d9f-aa8b-f74ffada286e', 'Rohan Verma', '9876259636@hallkhoj.phone', '9876259636', 'Uttar Pradesh', 'Lucknow', 'Chinhat', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('5238729c-2ad5-4d9f-aa8b-f74ffada286e', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('4a84ce4d-f2df-4738-a138-1dde6e12773f', 'Kavita Singh', 'user_1789830695892@hallkhoj.com', '9876000001', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('4a84ce4d-f2df-4738-a138-1dde6e12773f', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('e629169c-29c8-46fe-a914-3ad6331edaba', 'Priya Sharma', 'customer_1789830703977@hallkhoj.com', '9810000007', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('e629169c-29c8-46fe-a914-3ad6331edaba', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('042f6066-49f9-4fc1-a4d2-677482c424ba', 'Vikram Singh', 'owner_1789830703977@hallkhoj.com', '9810000008', 'Uttar Pradesh', 'Varanasi', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('042f6066-49f9-4fc1-a4d2-677482c424ba', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('48471669-e378-4363-a036-7e5d32d0dc9d', 'Test Customer', 'test_1789830714934@hallkhoj.com', '9810000009', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('48471669-e378-4363-a036-7e5d32d0dc9d', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('567220ff-9293-42d4-a04f-5a0ed7fa6b24', 'Rajesh Verma', 'owner_p5_1789831168138@hallkhoj.com', '9810000010', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('567220ff-9293-42d4-a04f-5a0ed7fa6b24', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('92c1e1b5-b648-425b-aabc-ca5ee7a74420', 'Sunita Customer', 'cust_p5_1789831168138@hallkhoj.com', '9123456780', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('92c1e1b5-b648-425b-aabc-ca5ee7a74420', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('60cf1509-156f-45f5-aca7-40e4f0b19ce8', 'Rajesh Verma', 'owner_p5_1789831213242@hallkhoj.com', '9810000012', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('60cf1509-156f-45f5-aca7-40e4f0b19ce8', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('5be96dca-4531-4e02-a2d0-c676bcfc8e1e', 'Sunita Customer', 'cust_p5_1789831213242@hallkhoj.com', '9810000013', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('5be96dca-4531-4e02-a2d0-c676bcfc8e1e', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('4e8eaef3-843d-4fa4-aed0-c2701d4dc4a0', 'Priya Sharma', 'customer_1789831230423@hallkhoj.com', '9810000014', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('4e8eaef3-843d-4fa4-aed0-c2701d4dc4a0', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('6a503b46-0927-47b2-ad9b-d5be7532f0f0', 'Vikram Singh', 'owner_1789831230423@hallkhoj.com', '9810000015', 'Uttar Pradesh', 'Varanasi', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('6a503b46-0927-47b2-ad9b-d5be7532f0f0', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('c05dfeee-7f14-48e4-ab37-17bbc67e426b', 'Rohan Verma', '9876120342@hallkhoj.phone', '9876120342', 'Uttar Pradesh', 'Lucknow', 'Chinhat', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('c05dfeee-7f14-48e4-ab37-17bbc67e426b', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('293dc84f-e693-4ba8-a8b8-ad71e2a7e292', 'Kavita Singh', 'user_1789831237968@hallkhoj.com', '9810000017', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('293dc84f-e693-4ba8-a8b8-ad71e2a7e292', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('9dd005f5-26c6-433c-a14b-c0082ffe1af9', 'Platform Administrator', 'admin@hallkhoj.com', '9999999999', 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('9dd005f5-26c6-433c-a14b-c0082ffe1af9', 'admin')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('059241c9-2754-49b9-a2a5-c3fcf05d2df2', 'Target Customer', 'cust_p6_1789831433378@hallkhoj.com', '9888877777', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('059241c9-2754-49b9-a2a5-c3fcf05d2df2', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('7b7ba247-0d82-469b-ae5b-bc01d3ea2fc2', 'Pradeep Tiwari', 'owner_p6_1789831433378@hallkhoj.com', '9777766666', 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('7b7ba247-0d82-469b-ae5b-bc01d3ea2fc2', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('9697c20a-13f0-4287-ab66-05b0a5dbdc0b', 'Priya Sharma', 'customer_1789831441625@hallkhoj.com', '9810000021', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('9697c20a-13f0-4287-ab66-05b0a5dbdc0b', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('76dbd48f-b20b-41aa-ab61-4ecee9958d04', 'Vikram Singh', 'owner_1789831441625@hallkhoj.com', '9810000022', 'Uttar Pradesh', 'Varanasi', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('76dbd48f-b20b-41aa-ab61-4ecee9958d04', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('29a0dabf-b6cb-44b9-a27b-e14bade7ab23', 'Rohan Verma', '9876666503@hallkhoj.phone', '9876666503', 'Uttar Pradesh', 'Lucknow', 'Chinhat', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('29a0dabf-b6cb-44b9-a27b-e14bade7ab23', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('fb6d4df3-a522-4920-a808-1f1c54e186f4', 'Kavita Singh', 'user_1789831448806@hallkhoj.com', '9810000024', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('fb6d4df3-a522-4920-a808-1f1c54e186f4', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('55161483-ca92-46ef-a537-ce19924016e7', 'Rajesh Verma', 'owner_p5_1789831456827@hallkhoj.com', '9810000025', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('55161483-ca92-46ef-a537-ce19924016e7', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('d34f518d-519a-41e2-ad1f-b14cf13e75e8', 'Sunita Customer', 'cust_p5_1789831456827@hallkhoj.com', '9810000026', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('d34f518d-519a-41e2-ad1f-b14cf13e75e8', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('cd2a7fbd-742f-4215-a078-56cba3999d18', 'Priya Sharma', 'customer_1789831761343@hallkhoj.com', '9810000027', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('cd2a7fbd-742f-4215-a078-56cba3999d18', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('48c8f787-f1ec-4942-afe4-816c5eab6c50', 'Vikram Singh', 'owner_1789831761343@hallkhoj.com', '9810000028', 'Uttar Pradesh', 'Varanasi', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('48c8f787-f1ec-4942-afe4-816c5eab6c50', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('f3b681f3-a1cf-4cab-a7c1-7c575f77a9d9', 'Rohan Verma', '9876895567@hallkhoj.phone', '9876895567', 'Uttar Pradesh', 'Lucknow', 'Chinhat', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('f3b681f3-a1cf-4cab-a7c1-7c575f77a9d9', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('a8404623-eae7-4f39-a17f-cdc04f7c50d9', 'Kavita Singh', 'user_1789831779857@hallkhoj.com', '9810000030', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('a8404623-eae7-4f39-a17f-cdc04f7c50d9', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2227fb37-0d1b-4b1b-aee0-ef5447c76df6', 'Rajesh Verma', 'owner_p5_1789831793838@hallkhoj.com', '9810000031', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2227fb37-0d1b-4b1b-aee0-ef5447c76df6', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('501655b4-0d95-4e27-a994-74acdf8ba56d', 'Sunita Customer', 'cust_p5_1789831793838@hallkhoj.com', '9810000032', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('501655b4-0d95-4e27-a994-74acdf8ba56d', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('112374a3-778d-4351-a142-fe112df936ad', 'Target Customer', 'cust_p6_1789831804587@hallkhoj.com', '9810000033', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('112374a3-778d-4351-a142-fe112df936ad', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0433f799-02fb-4c7b-a280-9dd45c8c6cd1', 'Pradeep Tiwari', 'owner_p6_1789831804587@hallkhoj.com', '9810000034', 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0433f799-02fb-4c7b-a280-9dd45c8c6cd1', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('e455952f-1ee9-4962-a9c3-9a3330df7cca', 'Priya Sharma', 'customer_1789832738460@hallkhoj.com', '9810000035', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('e455952f-1ee9-4962-a9c3-9a3330df7cca', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('78c63982-f13d-4ad8-ac97-08e7d5c1bb8e', 'Vikram Singh', 'owner_1789832738460@hallkhoj.com', '9810000036', 'Uttar Pradesh', 'Varanasi', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('78c63982-f13d-4ad8-ac97-08e7d5c1bb8e', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b4d040ee-cb11-4ab0-aac8-e4de6b220b10', 'Rohan Verma', '9876195872@hallkhoj.phone', '9876195872', 'Uttar Pradesh', 'Lucknow', 'Chinhat', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b4d040ee-cb11-4ab0-aac8-e4de6b220b10', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('eb4b307a-e4d3-4005-a1dd-59c1929f1d3f', 'Kavita Singh', 'user_1789832747487@hallkhoj.com', '9810000038', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('eb4b307a-e4d3-4005-a1dd-59c1929f1d3f', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0f4bee81-abcb-403d-a828-cb4aa09cd06c', 'Rajesh Verma', 'owner_p5_1789832761322@hallkhoj.com', '9810000039', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0f4bee81-abcb-403d-a828-cb4aa09cd06c', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('9068b64d-1e81-4850-a82c-c00185d99fd8', 'Sunita Customer', 'cust_p5_1789832761322@hallkhoj.com', '9810000040', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('9068b64d-1e81-4850-a82c-c00185d99fd8', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('621afea7-4206-4f8b-aea4-3b5f3d388284', 'Target Customer', 'cust_p6_1789832776391@hallkhoj.com', '9810000041', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('621afea7-4206-4f8b-aea4-3b5f3d388284', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('cabf1c82-00a0-4d53-af60-dc60eb1b3df2', 'Pradeep Tiwari', 'owner_p6_1789832776391@hallkhoj.com', '9810000042', 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('cabf1c82-00a0-4d53-af60-dc60eb1b3df2', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('da722730-ae1f-4630-af36-538e0d3736ff', 'Rahul Customer', 'rahul_1789833096048@example.com', '9873268864', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('da722730-ae1f-4630-af36-538e0d3736ff', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('4890f7ca-771e-4a62-a783-f118724edea5', 'Priya Customer', 'priya_1789833096048@example.com', '9717392469', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('4890f7ca-771e-4a62-a783-f118724edea5', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('4a98da76-a0d7-444f-a327-169c24b6815a', 'Rahul Customer', 'rahul_1789833130263@example.com', '9879831002', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('4a98da76-a0d7-444f-a327-169c24b6815a', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('12b2e2a4-8cbd-4e2a-a051-575cb05228eb', 'Priya Customer', 'priya_1789833130263@example.com', '9739909172', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('12b2e2a4-8cbd-4e2a-a051-575cb05228eb', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('1a6ed119-ec3b-4020-ac61-be489e916cfd', 'Vikram Rajput Partner', 'vikram_partner_1789833130263@example.com', '9629277933', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('1a6ed119-ec3b-4020-ac61-be489e916cfd', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0d17a558-a17f-4e6c-a063-51e0e6ec3992', 'Aman Customer', 'aman_cust_1789833637874@example.com', '9835854650', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0d17a558-a17f-4e6c-a063-51e0e6ec3992', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('8fcd780c-50ef-4082-a24f-1cef86d625a0', 'Sunil Owner Partner', 'sunil_owner_1789833637874@example.com', '9754323456', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('8fcd780c-50ef-4082-a24f-1cef86d625a0', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('886d0822-1986-4b5a-af37-893036000a4e', 'Stranger User', 'stranger_1789833637874@example.com', '9642450592', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('886d0822-1986-4b5a-af37-893036000a4e', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('f99d9357-2aaf-49cd-a1a9-0e317c2b0249', 'Aman Customer', 'aman_cust_1789833735816@example.com', '9826680579', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('f99d9357-2aaf-49cd-a1a9-0e317c2b0249', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2f7024ab-d34a-43fb-afb2-c1067ef15732', 'Sunil Owner Partner', 'sunil_owner_1789833735816@example.com', '9784222328', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2f7024ab-d34a-43fb-afb2-c1067ef15732', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2bcb25f3-5169-42bf-a252-5be9f6541ee7', 'Stranger User', 'stranger_1789833735816@example.com', '9698093432', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2bcb25f3-5169-42bf-a252-5be9f6541ee7', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('3572b92a-ee49-492d-acf1-1915b4cfe278', 'Kavita Verma Customer', 'kavita_1789833810518@example.com', '9899300578', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('3572b92a-ee49-492d-acf1-1915b4cfe278', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('f0ba2926-d51a-49d0-a819-71fb938e6b23', 'Deepak Stranger', 'deepak_1789833810518@example.com', '9725186423', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('f0ba2926-d51a-49d0-a819-71fb938e6b23', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('d5151dd0-423d-4d85-afdf-2521d39c3c75', 'Manoj Singh Partner', 'manoj_1789833810518@example.com', '9672250438', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('d5151dd0-423d-4d85-afdf-2521d39c3c75', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2504848d-34aa-4000-ac54-4798e6571198', 'Kavita Verma Customer', 'kavita_1789833856065@example.com', '9854696533', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2504848d-34aa-4000-ac54-4798e6571198', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('55994f3a-bdfc-4471-af1f-b818af45107e', 'Deepak Stranger', 'deepak_1789833856065@example.com', '9742414108', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('55994f3a-bdfc-4471-af1f-b818af45107e', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('eecb86f9-b2c8-432f-a810-55a4b6b39494', 'Manoj Singh Partner', 'manoj_1789833856065@example.com', '9692186132', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('eecb86f9-b2c8-432f-a810-55a4b6b39494', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0d4d04c8-5f8d-4c5d-afc3-fdb122e4c904', 'Aman Customer', 'aman_cust_1789833866394@example.com', '9825664674', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0d4d04c8-5f8d-4c5d-afc3-fdb122e4c904', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('9bedca0b-f020-4d42-a29d-1289a9a50841', 'Sunil Owner Partner', 'sunil_owner_1789833866394@example.com', '9721974906', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('9bedca0b-f020-4d42-a29d-1289a9a50841', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('597bd136-255b-4524-a5f3-510444e8d492', 'Stranger User', 'stranger_1789833866394@example.com', '9654622714', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('597bd136-255b-4524-a5f3-510444e8d492', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('bab8a00d-766b-43d3-a4d2-97021758ff3d', 'Aman Customer', 'aman_cust_1789834398796@example.com', '9844367001', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('bab8a00d-766b-43d3-a4d2-97021758ff3d', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('4ec3bc1b-ac62-4ccd-a975-7168690d2e12', 'Sunil Owner Partner', 'sunil_owner_1789834398796@example.com', '9735286535', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('4ec3bc1b-ac62-4ccd-a975-7168690d2e12', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('7403edfd-c4de-410c-ae43-066de8fad77f', 'Stranger User', 'stranger_1789834398796@example.com', '9650601867', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('7403edfd-c4de-410c-ae43-066de8fad77f', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('8f217e6c-953d-4510-a829-f537255f6537', 'Kavita Verma Customer', 'kavita_1789834408837@example.com', '9843973393', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('8f217e6c-953d-4510-a829-f537255f6537', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('01a019cc-72f8-4e2b-a9c8-9586e89cfdac', 'Deepak Stranger', 'deepak_1789834408837@example.com', '9752922950', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('01a019cc-72f8-4e2b-a9c8-9586e89cfdac', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('8263da0b-e919-4d89-a1fb-87f34212522a', 'Manoj Singh Partner', 'manoj_1789834408837@example.com', '9672491807', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('8263da0b-e919-4d89-a1fb-87f34212522a', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('faeb10b8-6e49-49da-a08b-049ea0a0d6e6', 'Rahul Customer', 'rahul_1789834518810@example.com', '9872352473', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('faeb10b8-6e49-49da-a08b-049ea0a0d6e6', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('f6aba6fd-e23f-4676-ae20-a7a3f4a3b15f', 'Priya Customer', 'priya_1789834518810@example.com', '9755622763', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('f6aba6fd-e23f-4676-ae20-a7a3f4a3b15f', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('de87dba2-d305-42a7-a669-789c65080f43', 'Vikram Rajput Partner', 'vikram_partner_1789834518810@example.com', '9690443008', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('de87dba2-d305-42a7-a669-789c65080f43', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('618114d0-37b6-4e24-afe8-bd91b1b93fb8', 'Target Customer', 'cust_p6_1789834544684@hallkhoj.com', '9810000072', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('618114d0-37b6-4e24-afe8-bd91b1b93fb8', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('ff8183c5-c886-40a5-aaef-dbf8d9318add', 'Pradeep Tiwari', 'owner_p6_1789834544684@hallkhoj.com', '9810000073', 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('ff8183c5-c886-40a5-aaef-dbf8d9318add', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('5eb051bf-69b4-4e96-a6b5-cf882597ab20', 'Owner AI Test', 'owner_ai_4839@test.com', '9810000074', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('5eb051bf-69b4-4e96-a6b5-cf882597ab20', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('a6b23cbd-b61d-4320-a918-e220ef8bf835', 'Customer AI Test', 'cust_ai_4839@test.com', '9876543211', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('a6b23cbd-b61d-4320-a918-e220ef8bf835', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('d7d724af-7424-4360-ae0c-bd5906b320bc', 'Owner AI Test', 'owner_ai_3238@test.com', '9810000076', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('d7d724af-7424-4360-ae0c-bd5906b320bc', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0e3db9b7-c0d6-4d91-a733-9e51c3651644', 'Customer AI Test', 'cust_ai_3238@test.com', '9810000077', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0e3db9b7-c0d6-4d91-a733-9e51c3651644', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('dcf0fa32-598b-4d26-a267-137035c0a7f3', 'Owner AI Test', 'owner_ai_8132@test.com', '9810000078', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('dcf0fa32-598b-4d26-a267-137035c0a7f3', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('1733f150-5b59-4309-a8e2-8eadb7f0b331', 'Customer AI Test', 'cust_ai_8132@test.com', '9810000079', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('1733f150-5b59-4309-a8e2-8eadb7f0b331', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('46a122eb-6b3b-4120-a458-b95bff5d36f0', 'Owner AI Test', 'owner_ai_5315@test.com', '9810000080', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('46a122eb-6b3b-4120-a458-b95bff5d36f0', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('73bb31e9-e672-4751-aea9-2c5982bca7db', 'Customer AI Test', 'cust_ai_5315@test.com', '9810000081', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('73bb31e9-e672-4751-aea9-2c5982bca7db', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('cfc38b55-79e7-4b22-a1d0-3bb0c8aa3e55', 'Owner AI Test', 'owner_ai_8175@test.com', '9810000082', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('cfc38b55-79e7-4b22-a1d0-3bb0c8aa3e55', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('4221fd8b-65a9-434e-a0e3-69d3b497511c', 'Customer AI Test', 'cust_ai_8175@test.com', '9810000083', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('4221fd8b-65a9-434e-a0e3-69d3b497511c', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('5234f26e-442d-4b84-a937-ef48c8f9c6db', 'Owner AI Test', 'owner_ai_2966@test.com', '9810000084', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('5234f26e-442d-4b84-a937-ef48c8f9c6db', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0623c499-0760-45d6-a4c8-03c1b6d1d80b', 'Customer AI Test', 'cust_ai_2966@test.com', '9810000085', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0623c499-0760-45d6-a4c8-03c1b6d1d80b', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2288057a-58f4-4a6c-a213-2b9707f0a563', 'Owner AI Test', 'owner_ai_7127@test.com', '9810000086', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2288057a-58f4-4a6c-a213-2b9707f0a563', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b29be842-7799-4dc1-abf5-d5dfd9ae608b', 'Customer AI Test', 'cust_ai_7127@test.com', '9810000087', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b29be842-7799-4dc1-abf5-d5dfd9ae608b', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b4675697-c8ba-4a93-a1ee-c05a9974f4cf', 'Rahul Customer', 'rahul_1789897407316@example.com', '9880256397', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b4675697-c8ba-4a93-a1ee-c05a9974f4cf', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('8f02f49e-2879-4a0d-a5c1-b95f418f076a', 'Priya Customer', 'priya_1789897407316@example.com', '9765580489', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('8f02f49e-2879-4a0d-a5c1-b95f418f076a', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('f0336370-0367-4f58-aac7-c405b4ef6c2f', 'Vikram Rajput Partner', 'vikram_partner_1789897407316@example.com', '9661768949', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('f0336370-0367-4f58-aac7-c405b4ef6c2f', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('178c4dc8-d182-423b-a05f-85a7b1349046', 'Aman Customer', 'aman_cust_1789897417807@example.com', '9852467953', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('178c4dc8-d182-423b-a05f-85a7b1349046', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0766276e-d9f0-4289-a12a-ba0c1182a784', 'Sunil Owner Partner', 'sunil_owner_1789897417807@example.com', '9748729040', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0766276e-d9f0-4289-a12a-ba0c1182a784', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('9f9bebdb-c314-4bac-a3aa-1ca5feff0d7d', 'Stranger User', 'stranger_1789897417807@example.com', '9636979260', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('9f9bebdb-c314-4bac-a3aa-1ca5feff0d7d', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('c4f097e1-6c38-49f9-a596-56b299ef2a0b', 'Kavita Verma Customer', 'kavita_1789897425419@example.com', '9843961377', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('c4f097e1-6c38-49f9-a596-56b299ef2a0b', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('6a319d55-7ec3-4308-a322-f833e5b1be7b', 'Deepak Stranger', 'deepak_1789897425419@example.com', '9757605905', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('6a319d55-7ec3-4308-a322-f833e5b1be7b', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('970e7b39-44b6-4a8a-a5bc-0d14226b7d53', 'Manoj Singh Partner', 'manoj_1789897425419@example.com', '9661516281', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('970e7b39-44b6-4a8a-a5bc-0d14226b7d53', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('e3e248b4-3db8-4cfa-afa2-69dbb649190e', 'Rohan Verma', '9876101963@hallkhoj.phone', '9876101963', 'Uttar Pradesh', 'Lucknow', 'Chinhat', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('e3e248b4-3db8-4cfa-afa2-69dbb649190e', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0d3b14b9-fbc8-4e80-aeb7-0b6211fd254f', 'Kavita Singh', 'user_1789898159465@hallkhoj.com', '9810000098', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0d3b14b9-fbc8-4e80-aeb7-0b6211fd254f', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b3ec3805-51e2-4265-a099-187f09a34611', 'Rajesh Verma', 'owner_p5_1789898168036@hallkhoj.com', '9810000099', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b3ec3805-51e2-4265-a099-187f09a34611', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('fdeab50c-249f-48fb-a3fa-7e28f463a377', 'Sunita Customer', 'cust_p5_1789898168036@hallkhoj.com', '9810000100', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('fdeab50c-249f-48fb-a3fa-7e28f463a377', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('9d6d24c7-07df-42bf-aaf4-d3d29bc967af', 'Rajesh Verma', 'owner_p5_1789898187705@hallkhoj.com', '9810000101', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('9d6d24c7-07df-42bf-aaf4-d3d29bc967af', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('3f8fc8d9-2062-46ad-a122-fb377ba091b4', 'Sunita Customer', 'cust_p5_1789898187705@hallkhoj.com', '9810000102', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('3f8fc8d9-2062-46ad-a122-fb377ba091b4', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('541ac2f0-a846-449a-a5d6-6367b019cbc9', 'Target Customer', 'cust_p6_1789898196012@hallkhoj.com', '9810000103', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('541ac2f0-a846-449a-a5d6-6367b019cbc9', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('474278d0-4968-4335-a741-ebb47df88d1e', 'Pradeep Tiwari', 'owner_p6_1789898196012@hallkhoj.com', '9810000104', 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('474278d0-4968-4335-a741-ebb47df88d1e', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2c295bf0-4e9c-46e9-a3e2-3406578f638e', 'E2E Test Customer', 'e2e_cust_1789899449367@test.com', '9876500001', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2c295bf0-4e9c-46e9-a3e2-3406578f638e', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('a7448621-5810-48cb-a5b5-93ae2e14543b', 'E2E Venue Owner', 'e2e_owner_1789899449367@test.com', '9876500002', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('a7448621-5810-48cb-a5b5-93ae2e14543b', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('77cf7a20-5e26-4759-a865-fbd60f1ecc95', 'E2E Test Customer', 'e2e_cust_1789899546063@test.com', '9810000107', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('77cf7a20-5e26-4759-a865-fbd60f1ecc95', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('7ed23ed6-158e-4d23-abe2-2c2e3e21d13c', 'E2E Venue Owner', 'e2e_owner_1789899546063@test.com', '9810000108', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('7ed23ed6-158e-4d23-abe2-2c2e3e21d13c', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('fee1e73c-6197-44f2-afd9-1469c97776f5', 'E2E Test Customer', 'e2e_cust_1789899627529@test.com', '9810000109', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('fee1e73c-6197-44f2-afd9-1469c97776f5', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('6d7e361e-b67f-416f-aebf-6421be48ecd1', 'E2E Venue Owner', 'e2e_owner_1789899627529@test.com', '9810000110', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('6d7e361e-b67f-416f-aebf-6421be48ecd1', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('e5d6505a-4486-4ae1-a035-806fde8df272', 'E2E Test Customer', 'e2e_cust_1789899647320@test.com', '9810000111', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('e5d6505a-4486-4ae1-a035-806fde8df272', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('5f1dcff4-ba54-43c5-afbb-8d286cd0809e', 'E2E Venue Owner', 'e2e_owner_1789899647320@test.com', '9810000112', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('5f1dcff4-ba54-43c5-afbb-8d286cd0809e', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('aa6f6339-af05-4619-aa98-b8e041bd3031', 'E2E Test Customer', 'e2e_cust_1789899691559@test.com', '9810000113', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('aa6f6339-af05-4619-aa98-b8e041bd3031', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b43c3331-6363-4f4c-ace8-25760d559c6d', 'E2E Venue Owner', 'e2e_owner_1789899691559@test.com', '9810000114', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b43c3331-6363-4f4c-ace8-25760d559c6d', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('932e2efc-481e-4e5f-a8c3-03a329f3ff8a', 'Rohan Sharma', 'prod_cust_1789899757000@hallkhoj.in', '9810000115', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('932e2efc-481e-4e5f-a8c3-03a329f3ff8a', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('496e5893-a258-457a-a6b2-2bd9b43a8632', 'Vikram Singh', 'prod_owner_1789899757000@hallkhoj.in', '9810000116', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('496e5893-a258-457a-a6b2-2bd9b43a8632', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('9ca92914-1a92-4307-ab25-4ccd2806f8a4', 'Rohan Sharma', 'prod_cust_1789899823266@hallkhoj.in', '9810000117', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('9ca92914-1a92-4307-ab25-4ccd2806f8a4', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('340f8960-7a9a-46db-ac1f-176ffc096200', 'Rohan Sharma', 'prod_cust_1789899841500@hallkhoj.in', '9810000118', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('340f8960-7a9a-46db-ac1f-176ffc096200', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('c4b5041e-9e7b-4e5c-aa42-a54e6ffabdb6', 'Vikram Singh', 'prod_owner_1789899841500@hallkhoj.in', '9810000119', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('c4b5041e-9e7b-4e5c-aa42-a54e6ffabdb6', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('91decefd-a3f6-4530-ae01-4fd865e83759', 'Rohan Sharma', 'prod_cust_1789899888088@hallkhoj.in', '9810000120', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('91decefd-a3f6-4530-ae01-4fd865e83759', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('a5abf92a-c7a2-4897-ab31-0fc91644a78b', 'Vikram Singh', 'prod_owner_1789899888088@hallkhoj.in', '9810000121', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('a5abf92a-c7a2-4897-ab31-0fc91644a78b', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('525adf26-9920-4d31-a110-1e3e22c77c68', 'Rohan Sharma', 'prod_cust_1789899964242@hallkhoj.in', '9810000122', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('525adf26-9920-4d31-a110-1e3e22c77c68', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('d7bd62fe-f5f1-44d8-ad0b-0dbf5e830083', 'Vikram Singh', 'prod_owner_1789899964242@hallkhoj.in', '9810000123', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('d7bd62fe-f5f1-44d8-ad0b-0dbf5e830083', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('5076fddc-95e5-46d2-aa80-5d9812a7facc', 'E2E Test Customer', 'e2e_cust_1789899996399@test.com', '9810000124', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('5076fddc-95e5-46d2-aa80-5d9812a7facc', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('effdb8de-d0f5-44a9-a7e8-c4396b6140ce', 'E2E Venue Owner', 'e2e_owner_1789899996399@test.com', '9810000125', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('effdb8de-d0f5-44a9-a7e8-c4396b6140ce', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('75fbe0fa-f672-4b14-aa9b-48bbbc025091', 'Owner AI Test', 'owner_ai_5712@test.com', '9810000126', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('75fbe0fa-f672-4b14-aa9b-48bbbc025091', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b818068a-56b0-4916-ac80-f4d30c1c69aa', 'Customer AI Test', 'cust_ai_5712@test.com', '9810000127', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b818068a-56b0-4916-ac80-f4d30c1c69aa', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('abc2971d-0eaa-4333-a828-223706ce49b9', 'Owner AI Test', 'owner_ai_6905@test.com', '9810000128', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('abc2971d-0eaa-4333-a828-223706ce49b9', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2dbabdf2-bf71-40a6-a80c-53403959c850', 'Customer AI Test', 'cust_ai_6905@test.com', '9810000129', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2dbabdf2-bf71-40a6-a80c-53403959c850', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('4b7e8750-8375-4a15-a21b-2316de414d72', 'Rohan Sharma', 'prod_cust_1789900085893@hallkhoj.in', '9810000130', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('4b7e8750-8375-4a15-a21b-2316de414d72', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('d5f68eb4-3511-45b8-a982-2a7fd31ad00e', 'Vikram Singh', 'prod_owner_1789900085893@hallkhoj.in', '9810000131', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('d5f68eb4-3511-45b8-a982-2a7fd31ad00e', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('763a9fac-9163-41e3-a8a3-34cb21abe96c', 'Aman Customer', 'aman_cust_1789900091942@example.com', '9881959943', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('763a9fac-9163-41e3-a8a3-34cb21abe96c', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('f843f1c9-cfed-4e6b-ae5e-7b5f03948461', 'Sunil Owner Partner', 'sunil_owner_1789900091942@example.com', '9728697376', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('f843f1c9-cfed-4e6b-ae5e-7b5f03948461', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0a5184d8-2253-4938-a36b-78e065ba844e', 'Stranger User', 'stranger_1789900091942@example.com', '9678322829', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0a5184d8-2253-4938-a36b-78e065ba844e', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('77a5a7b4-a65f-4a32-a36f-b8ebf439e127', 'Kavita Verma Customer', 'kavita_1789900100116@example.com', '9867529956', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('77a5a7b4-a65f-4a32-a36f-b8ebf439e127', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('76b82a50-16e6-4a58-af30-c18fee7b09b8', 'Deepak Stranger', 'deepak_1789900100116@example.com', '9781910826', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('76b82a50-16e6-4a58-af30-c18fee7b09b8', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('54f07d2a-2ea1-4364-aa61-b0b4811e034e', 'Manoj Singh Partner', 'manoj_1789900100116@example.com', '9626801424', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('54f07d2a-2ea1-4364-aa61-b0b4811e034e', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('74dd72b1-4a2a-45f3-aedc-5796b6d742fd', 'Rahul Customer', 'rahul_1789900115926@example.com', '9831020693', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('74dd72b1-4a2a-45f3-aedc-5796b6d742fd', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('600e73ec-3f73-44d6-a504-8a8c9dec19ab', 'Priya Customer', 'priya_1789900115926@example.com', '9784550547', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('600e73ec-3f73-44d6-a504-8a8c9dec19ab', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('fd0b5c66-7ed1-405b-adbd-c30bc9bc99d4', 'Vikram Rajput Partner', 'vikram_partner_1789900115926@example.com', '9678369370', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('fd0b5c66-7ed1-405b-adbd-c30bc9bc99d4', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0a43da61-284c-4f97-a8e8-126c313c0ee1', 'Target Customer', 'cust_p6_1789900125038@hallkhoj.com', '9810000141', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0a43da61-284c-4f97-a8e8-126c313c0ee1', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('f1fd29be-3329-4bc1-a1ba-396f2836c85a', 'Pradeep Tiwari', 'owner_p6_1789900125038@hallkhoj.com', '9810000142', 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('f1fd29be-3329-4bc1-a1ba-396f2836c85a', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('94d1b3f4-68da-4648-acdc-8e26b21d5a61', 'Manish Kumar', 'manishkumar35@gmail.com', '9810000143', 'Bihar', 'Chapra', 'dhobwal', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('94d1b3f4-68da-4648-acdc-8e26b21d5a61', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0240c2c2-f0aa-4459-a4b9-865f18c23925', 'Vikram Singhania', 'banquet_owner_1790530546561@test.com', '9812358432', 'Uttar Pradesh', 'Varanasi', 'Sigra', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0240c2c2-f0aa-4459-a4b9-865f18c23925', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('43e65e36-8de1-4cd7-a2f6-88a4425b0f50', 'Rahul Verma', 'customer_1790530546561@test.com', '9765443171', 'Delhi NCR', 'Noida', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('43e65e36-8de1-4cd7-a2f6-88a4425b0f50', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2fc8bc77-9a04-4f5b-a374-26c11729ab22', 'Ramesh Sharma', 'usr_1790531943670_gkuyfz@hallkhoj.in', '6423490857', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2fc8bc77-9a04-4f5b-a374-26c11729ab22', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('edbb7e33-1828-4c92-aa21-9b77337b64b8', 'Suresh Verma', 'usr_1790531945374_tidn3h@hallkhoj.in', '6565627805', 'Bihar', 'Patna', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('edbb7e33-1828-4c92-aa21-9b77337b64b8', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('22927177-952b-4688-a1b2-95874977192f', 'Ramesh Sharma', 'usr_1790531967030_o9heeh@hallkhoj.in', '6463524268', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('22927177-952b-4688-a1b2-95874977192f', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('d87d16bf-a0d2-41b0-a65c-5c891b64acaa', 'Suresh Verma', 'usr_1790531967350_vy1868@hallkhoj.in', '7170570930', 'Bihar', 'Patna', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('d87d16bf-a0d2-41b0-a65c-5c891b64acaa', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('16b596c3-0723-43fb-a9e6-f0cddf3649de', 'Vikramaditya Singh', 'usr_1790533840949_pz3amj@hallkhoj.in', '7260014086', 'Uttar Pradesh', 'Lucknow', '', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('16b596c3-0723-43fb-a9e6-f0cddf3649de', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('a06633e7-aca5-498c-aea7-a690f88dd620', 'Manish Kumar', 'mkumar25843_151@gmail.com', '9810000151', 'amritsar', 'Amritsar', 'dhobwal', FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('a06633e7-aca5-498c-aea7-a690f88dd620', 'owner')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('e295bfcb-b96a-4eb4-ae18-b28ece8a0874', 'Autonomous Tester', 'test_email_user_1793777076519@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('e295bfcb-b96a-4eb4-ae18-b28ece8a0874', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('724fce1a-b3eb-4525-aec3-23b925553ad4', 'Google User', 'google_verified_1793777076654@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('724fce1a-b3eb-4525-aec3-23b925553ad4', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('4d326a9f-9cd2-490c-afbc-d71c483336a2', 'Autonomous Tester', 'test_email_user_1793777273225@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('4d326a9f-9cd2-490c-afbc-d71c483336a2', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('736b7ead-e2c2-4917-acac-2b1cd6bd8498', 'Google User', 'google_verified_1793777273363@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('736b7ead-e2c2-4917-acac-2b1cd6bd8498', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('ec469520-9bdd-4cbf-a3df-854818b4fc50', 'Autonomous Tester', 'test_email_user_1793777344359@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('ec469520-9bdd-4cbf-a3df-854818b4fc50', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('434a3cc0-9bce-4758-ab02-a938c01150d8', 'Google User', 'google_verified_1793777344493@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('434a3cc0-9bce-4758-ab02-a938c01150d8', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('e4b2ce30-7db3-4f10-afa2-37b9ca4732f7', 'Autonomous Tester', 'test_email_user_1793778031857@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('e4b2ce30-7db3-4f10-afa2-37b9ca4732f7', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('0781acf5-474e-47e6-ab6f-ce81e90e4189', 'Google User', 'google_verified_1793778032004@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('0781acf5-474e-47e6-ab6f-ce81e90e4189', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b8408d8c-5421-47d8-abf4-f954f62a7a97', 'Autonomous Tester', 'test_email_user_1793783081496@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b8408d8c-5421-47d8-abf4-f954f62a7a97', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('f9c0ab68-eb66-4fb9-a2c6-ba12b99a62b1', 'Google User', 'google_verified_1793783081635@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('f9c0ab68-eb66-4fb9-a2c6-ba12b99a62b1', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('98709546-2a0c-4246-a816-d9b68e7b3131', 'Autonomous Tester', 'test_email_user_1793785187063@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('98709546-2a0c-4246-a816-d9b68e7b3131', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('7d54f619-2496-4f72-a717-5a4e1345afbd', 'Google User', 'google_verified_1793785187198@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('7d54f619-2496-4f72-a717-5a4e1345afbd', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('9488167c-141f-4f51-a760-aec05f2f80bf', 'Autonomous Tester', 'test_email_user_1793788515647@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('9488167c-141f-4f51-a760-aec05f2f80bf', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('689f5068-19ed-4753-ae43-7000c54fbcc9', 'Google User', 'google_verified_1793788515794@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('689f5068-19ed-4753-ae43-7000c54fbcc9', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('d7280a3b-a616-4a68-ac66-c657f67781c8', 'Autonomous Tester', 'test_email_user_1793788549674@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('d7280a3b-a616-4a68-ac66-c657f67781c8', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('fe87f8c1-ba69-4c88-a9a1-04ba9e0b4a0c', 'Google User', 'google_verified_1793788549819@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('fe87f8c1-ba69-4c88-a9a1-04ba9e0b4a0c', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('7c15267a-1eb2-4598-a7e7-fe3394cef79a', 'Autonomous Tester', 'test_email_user_1793788579629@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('7c15267a-1eb2-4598-a7e7-fe3394cef79a', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b2a73121-442e-428f-ae3f-cb7dc30a2427', 'Google User', 'google_verified_1793788579773@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b2a73121-442e-428f-ae3f-cb7dc30a2427', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b7fa9a5e-ba3c-4052-a1a6-1378b6902ebc', 'Autonomous Tester', 'test_email_user_1793788646655@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b7fa9a5e-ba3c-4052-a1a6-1378b6902ebc', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('6b93039f-c180-4742-ae8b-9b0c3b766bcb', 'Google User', 'google_verified_1793788646793@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('6b93039f-c180-4742-ae8b-9b0c3b766bcb', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('943967c8-ed2f-4a7e-a983-8cffa20224b4', 'Autonomous Tester', 'test_email_user_1793788718264@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('943967c8-ed2f-4a7e-a983-8cffa20224b4', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2a19c8e1-f630-4375-aae8-1a5fb488862a', 'Google User', 'google_verified_1793788718406@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2a19c8e1-f630-4375-aae8-1a5fb488862a', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('737cb510-c59f-4820-adfa-d2446bc20284', 'Autonomous Tester', 'test_email_user_1793788834245@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('737cb510-c59f-4820-adfa-d2446bc20284', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('2c89e483-b181-4daf-a962-ce544c5d2b45', 'Google User', 'google_verified_1793788834379@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('2c89e483-b181-4daf-a962-ce544c5d2b45', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('a8ef40d7-a587-4899-a7da-b103e725d108', 'Autonomous Tester', 'test_email_user_1793789626065@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('a8ef40d7-a587-4899-a7da-b103e725d108', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('9d8ccf7b-5c2a-400b-a3b2-ab975f9b1622', 'Google User', 'google_verified_1793789626216@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('9d8ccf7b-5c2a-400b-a3b2-ab975f9b1622', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('3a92cc39-1d8d-4f13-a5a7-ca14c9f9c520', 'Autonomous Tester', 'test_email_user_1793790905420@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('3a92cc39-1d8d-4f13-a5a7-ca14c9f9c520', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('6708daf7-976f-46cb-afb6-58ee787d7edf', 'Google User', 'google_verified_1793790905655@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('6708daf7-976f-46cb-afb6-58ee787d7edf', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('a56c0a87-69d5-4f0c-afb6-fe511176a8e3', 'Autonomous Tester', 'test_email_user_1793790990505@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('a56c0a87-69d5-4f0c-afb6-fe511176a8e3', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('81d448a8-837a-44e8-a859-5d5764e6c0d5', 'Google User', 'google_verified_1793790990730@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('81d448a8-837a-44e8-a859-5d5764e6c0d5', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('b180ca49-f05a-416e-a325-616aa50e73bc', 'Autonomous Tester', 'test_email_user_1793791211594@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('b180ca49-f05a-416e-a325-616aa50e73bc', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('e668b385-627d-4f8f-a227-b11ea44647db', 'Google User', 'google_verified_1793791211801@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('e668b385-627d-4f8f-a227-b11ea44647db', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('009b96e5-79b2-4a5c-a868-86239903fc13', 'Autonomous Tester', 'test_email_user_1793791322681@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('009b96e5-79b2-4a5c-a868-86239903fc13', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('8231a6d6-5c01-4833-ac0c-ccb2f454d9a7', 'Google User', 'google_verified_1793791322916@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('8231a6d6-5c01-4833-ac0c-ccb2f454d9a7', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('5a02c815-fa74-4105-a959-9a907bb77a67', 'Autonomous Tester', 'test_email_user_1793792904102@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('5a02c815-fa74-4105-a959-9a907bb77a67', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('efe58271-0386-4467-afef-addedcad9c77', 'Google User', 'google_verified_1793792904351@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('efe58271-0386-4467-afef-addedcad9c77', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('20a15b4c-9838-4b79-abf4-35bfba51e7b1', 'Autonomous Tester', 'test_email_user_1793793920536@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('20a15b4c-9838-4b79-abf4-35bfba51e7b1', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('98dee29c-62c0-4311-a159-3b168a04db8e', 'Google User', 'google_verified_1793793920663@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('98dee29c-62c0-4311-a159-3b168a04db8e', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('56511cbd-afdc-4718-a342-78a154ea26a5', 'Autonomous Tester', 'test_email_user_1793794908920@example.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('56511cbd-afdc-4718-a342-78a154ea26a5', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;
INSERT INTO public.profiles (id, name, email, mobile, state, city, area, is_verified)
VALUES ('65a0f51a-f42c-4c16-a7b3-be0152082c93', 'Google User', 'google_verified_1793794909037@gmail.com', NULL, 'Uttar Pradesh', 'Lucknow', '', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  mobile = EXCLUDED.mobile;
INSERT INTO public.user_roles (profile_id, role)
VALUES ('65a0f51a-f42c-4c16-a7b3-be0152082c93', 'customer')
ON CONFLICT (profile_id, role) DO NOTHING;

-- 3. OWNERS
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('ed7e3de3-fefd-460b-a55c-76a8b13cf039', 'de2ca6c0-d244-418f-ae87-82d681764403', 'Singh Grand Resort', 'Marriage Hall', 'owner_1789829846386@hallkhoj.com', '9876509876', 'Varanasi', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('b21d886b-44f3-4851-aa20-655a91184050', '042f6066-49f9-4fc1-a4d2-677482c424ba', 'Singh Grand Resort', 'Marriage Hall', 'owner_1789830703977@hallkhoj.com', '9876509876', 'Varanasi', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('5b36221c-823b-4c79-a44a-45ca7c53a58f', '567220ff-9293-42d4-a04f-5a0ed7fa6b24', 'The Royal Grand Heritage Palace & Resort', 'Marriage Hall', 'owner_p5_1789831168138@hallkhoj.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('675c307f-7e78-4939-ab1c-1199b2714e97', '60cf1509-156f-45f5-aca7-40e4f0b19ce8', 'The Royal Grand Heritage Palace & Resort', 'Marriage Hall', 'owner_p5_1789831213242@hallkhoj.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('2f72434b-1f96-427a-a2d2-05f438b34e51', '6a503b46-0927-47b2-ad9b-d5be7532f0f0', 'Singh Grand Resort', 'Marriage Hall', 'owner_1789831230423@hallkhoj.com', '9876509876', 'Varanasi', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('85260eaf-60cb-460d-a80c-34b0205fd685', '7b7ba247-0d82-469b-ae5b-bc01d3ea2fc2', 'Tiwari Grand Lawn', 'Banquet Lawns', 'owner_p6_1789831433378@hallkhoj.com', '9777766666', 'Lucknow', 'Uttar Pradesh', 'APPROVED', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('49c1bdfd-b6f7-47ad-abeb-9d1dce0bdf1a', '76dbd48f-b20b-41aa-ab61-4ecee9958d04', 'Singh Grand Resort', 'Marriage Hall', 'owner_1789831441625@hallkhoj.com', '9876509876', 'Varanasi', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('0469dc1e-1a38-42f8-a8d7-7a5e229908df', '55161483-ca92-46ef-a537-ce19924016e7', 'The Royal Grand Heritage Palace & Resort', 'Marriage Hall', 'owner_p5_1789831456827@hallkhoj.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('38fb3b45-8d92-4237-ab03-f3f157c6c367', '48c8f787-f1ec-4942-afe4-816c5eab6c50', 'Singh Grand Resort', 'Marriage Hall', 'owner_1789831761343@hallkhoj.com', '9876509876', 'Varanasi', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('cb580662-d4df-41d7-a20f-f07653643b9e', '2227fb37-0d1b-4b1b-aee0-ef5447c76df6', 'The Royal Grand Heritage Palace & Resort', 'Marriage Hall', 'owner_p5_1789831793838@hallkhoj.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('41c06221-aed6-4573-abbc-cc0b869111d5', '0433f799-02fb-4c7b-a280-9dd45c8c6cd1', 'Tiwari Grand Lawn', 'Banquet Lawns', 'owner_p6_1789831804587@hallkhoj.com', '9777766666', 'Lucknow', 'Uttar Pradesh', 'APPROVED', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('52ad252b-24e0-4184-a467-9e572a5a21f3', '78c63982-f13d-4ad8-ac97-08e7d5c1bb8e', 'Singh Grand Resort', 'Marriage Hall', 'owner_1789832738460@hallkhoj.com', '9876509876', 'Varanasi', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('5fd0138a-79b8-4bce-a654-45242fe569a5', '0f4bee81-abcb-403d-a828-cb4aa09cd06c', 'The Royal Grand Heritage Palace & Resort', 'Marriage Hall', 'owner_p5_1789832761322@hallkhoj.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('ee4b4714-f357-454e-a55f-46f67cffff28', 'cabf1c82-00a0-4d53-af60-dc60eb1b3df2', 'Tiwari Grand Lawn', 'Banquet Lawns', 'owner_p6_1789832776391@hallkhoj.com', '9777766666', 'Lucknow', 'Uttar Pradesh', 'APPROVED', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('3ce0cfd5-ccb9-4988-a022-d91797737610', '1a6ed119-ec3b-4020-ac61-be489e916cfd', 'Rajput Heritage Venues', 'Marriage Hall', 'vikram_partner_1789833130263@example.com', '9629277933', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('4d1892ed-55ef-45d7-a5bf-d2daeebc196a', '8fcd780c-50ef-4082-a24f-1cef86d625a0', 'Sunil Banquets Lucknow', 'Marriage Hall', 'sunil_owner_1789833637874@example.com', '9754323456', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('cec90ed6-a89a-4555-a459-df1061e8c2eb', '2f7024ab-d34a-43fb-afb2-c1067ef15732', 'Sunil Banquets Lucknow', 'Marriage Hall', 'sunil_owner_1789833735816@example.com', '9784222328', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('a4fc2b10-2a87-4987-a115-8feb215e85b7', 'd5151dd0-423d-4d85-afdf-2521d39c3c75', 'Manoj Heritage Resort', 'Marriage Hall', 'manoj_1789833810518@example.com', '9672250438', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('f1423d2a-20c7-4976-a5d7-ae51d67e53da', 'eecb86f9-b2c8-432f-a810-55a4b6b39494', 'Manoj Heritage Resort', 'Marriage Hall', 'manoj_1789833856065@example.com', '9692186132', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('5da081b3-b507-4d47-aa73-b80d144d5529', '9bedca0b-f020-4d42-a29d-1289a9a50841', 'Sunil Banquets Lucknow', 'Marriage Hall', 'sunil_owner_1789833866394@example.com', '9721974906', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('c3ee5b33-0393-4a2f-a9c0-15d85dd71b45', '4ec3bc1b-ac62-4ccd-a975-7168690d2e12', 'Sunil Banquets Lucknow', 'Marriage Hall', 'sunil_owner_1789834398796@example.com', '9735286535', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('900ee3ed-2f7a-44b5-a7b1-d6b25855546b', '8263da0b-e919-4d89-a1fb-87f34212522a', 'Manoj Heritage Resort', 'Marriage Hall', 'manoj_1789834408837@example.com', '9672491807', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('8f1270c1-d94f-484a-af3d-b04f2d04d5b4', 'de87dba2-d305-42a7-a669-789c65080f43', 'Rajput Heritage Venues', 'Marriage Hall', 'vikram_partner_1789834518810@example.com', '9690443008', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('3f227aa4-300e-4e53-a551-fef967ef9e69', 'ff8183c5-c886-40a5-aaef-dbf8d9318add', 'Tiwari Grand Lawn', 'Banquet Lawns', 'owner_p6_1789834544684@hallkhoj.com', '9777766666', 'Lucknow', 'Uttar Pradesh', 'APPROVED', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('0ad71210-f25f-4752-ad38-761b4ce3ae40', '5eb051bf-69b4-4e96-a6b5-cf882597ab20', 'Owner AI Test', 'Marriage Hall', 'owner_ai_4839@test.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('222ca7ca-2d7c-4aa0-ab65-63d419c9c516', 'd7d724af-7424-4360-ae0c-bd5906b320bc', 'Owner AI Test', 'Marriage Hall', 'owner_ai_3238@test.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('b85903da-4aac-453f-a2ce-291d37f1c978', 'dcf0fa32-598b-4d26-a267-137035c0a7f3', 'Owner AI Test', 'Marriage Hall', 'owner_ai_8132@test.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('5ffa40f1-033a-4195-a1ae-be7a564458aa', '46a122eb-6b3b-4120-a458-b95bff5d36f0', 'Owner AI Test', 'Marriage Hall', 'owner_ai_5315@test.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('d7114776-7690-4da6-a766-0e9afe6e5c38', 'cfc38b55-79e7-4b22-a1d0-3bb0c8aa3e55', 'Owner AI Test', 'Marriage Hall', 'owner_ai_8175@test.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('2a4be2ca-51e9-45d7-a340-bd6fa02ae5d3', '5234f26e-442d-4b84-a937-ef48c8f9c6db', 'Owner AI Test', 'Marriage Hall', 'owner_ai_2966@test.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('45da4ee3-38c2-47be-a5b1-dc302b1267f5', '2288057a-58f4-4a6c-a213-2b9707f0a563', 'Owner AI Test', 'Marriage Hall', 'owner_ai_7127@test.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('b3e1cd0b-efcb-4c17-ab84-01570bb50d77', 'f0336370-0367-4f58-aac7-c405b4ef6c2f', 'Rajput Heritage Venues', 'Marriage Hall', 'vikram_partner_1789897407316@example.com', '9661768949', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('0749f608-9573-47e1-aff8-9e8ba47917e4', '0766276e-d9f0-4289-a12a-ba0c1182a784', 'Sunil Banquets Lucknow', 'Marriage Hall', 'sunil_owner_1789897417807@example.com', '9748729040', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('cc2ff3db-f74e-49e9-abad-a887daf7691a', '970e7b39-44b6-4a8a-a5bc-0d14226b7d53', 'Manoj Heritage Resort', 'Marriage Hall', 'manoj_1789897425419@example.com', '9661516281', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('396e08d7-56ad-42b3-a82e-c98c5ddfa93f', 'b3ec3805-51e2-4265-a099-187f09a34611', 'The Royal Grand Heritage Palace & Resort', 'Marriage Hall', 'owner_p5_1789898168036@hallkhoj.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('5de2e773-af78-44bf-a8c1-8bb00356826e', '9d6d24c7-07df-42bf-aaf4-d3d29bc967af', 'The Royal Grand Heritage Palace & Resort', 'Marriage Hall', 'owner_p5_1789898187705@hallkhoj.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('34071600-50bd-4d38-a68b-ec1119a834e5', '474278d0-4968-4335-a741-ebb47df88d1e', 'Tiwari Grand Lawn', 'Banquet Lawns', 'owner_p6_1789898196012@hallkhoj.com', '9777766666', 'Lucknow', 'Uttar Pradesh', 'APPROVED', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('4aad7bc7-9c9f-4077-a0df-22e8f6421d03', 'a7448621-5810-48cb-a5b5-93ae2e14543b', 'Royal Kohinoor Palace', 'Marriage Hall', 'e2e_owner_1789899449367@test.com', '9876500002', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('4fb09879-fa39-43be-a1cc-eb1304428f0c', '7ed23ed6-158e-4d23-abe2-2c2e3e21d13c', 'Royal Kohinoor Palace', 'Marriage Hall', 'e2e_owner_1789899546063@test.com', '9876500002', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('399dc319-f9bc-48ca-a707-d6dd1ba9f6b4', '6d7e361e-b67f-416f-aebf-6421be48ecd1', 'Royal Kohinoor Palace', 'Marriage Hall', 'e2e_owner_1789899627529@test.com', '9876500002', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('c88547e9-33aa-4ed1-a449-a5c6330c09d4', '5f1dcff4-ba54-43c5-afbb-8d286cd0809e', 'Royal Kohinoor Palace', 'Marriage Hall', 'e2e_owner_1789899647320@test.com', '9876500002', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('56f6825b-681a-449f-a565-c7070d18b4b4', 'b43c3331-6363-4f4c-ace8-25760d559c6d', 'Royal Kohinoor Palace', 'Marriage Hall', 'e2e_owner_1789899691559@test.com', '9876500002', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('af1e976c-a0b0-41a8-a6b0-8fe8f0f799d4', '496e5893-a258-457a-a6b2-2bd9b43a8632', 'The Royal Grand Heritage', 'Marriage Hall', 'prod_owner_1789899757000@hallkhoj.in', '9876543211', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('059ec842-5403-4c68-ab43-7d79ec65e045', 'c4b5041e-9e7b-4e5c-aa42-a54e6ffabdb6', 'The Royal Grand Heritage', 'Marriage Hall', 'prod_owner_1789899841500@hallkhoj.in', '9876543211', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('d8e66322-cc54-4bfc-aa50-73fa638dc504', 'a5abf92a-c7a2-4897-ab31-0fc91644a78b', 'The Royal Grand Heritage', 'Marriage Hall', 'prod_owner_1789899888088@hallkhoj.in', '9876543211', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('160fa110-ff7e-402c-a9ab-2d5547013a5a', 'd7bd62fe-f5f1-44d8-ad0b-0dbf5e830083', 'The Royal Grand Heritage', 'Marriage Hall', 'prod_owner_1789899964242@hallkhoj.in', '9876543211', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('cc6e48c4-edbf-4d2d-ae83-1951e67f70fd', 'effdb8de-d0f5-44a9-a7e8-c4396b6140ce', 'Royal Kohinoor Palace', 'Marriage Hall', 'e2e_owner_1789899996399@test.com', '9876500002', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('54249ccd-1514-4d14-a18e-bf26caf78803', '75fbe0fa-f672-4b14-aa9b-48bbbc025091', 'Owner AI Test', 'Marriage Hall', 'owner_ai_5712@test.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('b344b95e-daab-4175-a8f3-9cebd845f534', 'abc2971d-0eaa-4333-a828-223706ce49b9', 'Owner AI Test', 'Marriage Hall', 'owner_ai_6905@test.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('4bbbf5fa-e65a-4a01-ad55-6dd5779ae57e', 'd5f68eb4-3511-45b8-a982-2a7fd31ad00e', 'The Royal Grand Heritage', 'Marriage Hall', 'prod_owner_1789900085893@hallkhoj.in', '9876543211', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('c6bf641f-42c5-443e-ac58-71dc1aa939ed', 'f843f1c9-cfed-4e6b-ae5e-7b5f03948461', 'Sunil Banquets Lucknow', 'Marriage Hall', 'sunil_owner_1789900091942@example.com', '9728697376', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('e3f4c9ff-3184-4b78-a901-fe37a9ae2bf2', '54f07d2a-2ea1-4364-aa61-b0b4811e034e', 'Manoj Heritage Resort', 'Marriage Hall', 'manoj_1789900100116@example.com', '9626801424', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('780debd1-10f9-429e-ab93-f60f02dd9b3d', 'fd0b5c66-7ed1-405b-adbd-c30bc9bc99d4', 'Rajput Heritage Venues', 'Marriage Hall', 'vikram_partner_1789900115926@example.com', '9678369370', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('50bd282a-74cb-45de-add2-5d41a3cd292a', 'f1fd29be-3329-4bc1-a1ba-396f2836c85a', 'Tiwari Grand Lawn', 'Banquet Lawns', 'owner_p6_1789900125038@hallkhoj.com', '9777766666', 'Lucknow', 'Uttar Pradesh', 'APPROVED', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('cf9ece59-8cbf-4c97-a6a5-4b42337dae2a', '0240c2c2-f0aa-4459-a4b9-865f18c23925', 'Singhania Grand Banquet', 'Banquet Hall', 'banquet_owner_1790530546561@test.com', '9812358432', 'Varanasi', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('9be565c8-2a83-43e7-a57d-d54d4fe22f89', 'edbb7e33-1828-4c92-aa21-9b77337b64b8', 'Royal Shubh Garden', 'Marriage Garden', '', '6565627805', 'Patna', 'Bihar', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('0f988c6e-6813-44b2-abbd-1d053fe43c4a', 'd87d16bf-a0d2-41b0-a65c-5c891b64acaa', 'Royal Shubh Garden', 'Marriage Garden', '', '7170570930', 'Patna', 'Bihar', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('0cb9f106-40f7-4b37-a8f2-dff2c752143e', '8e67593d-f06b-4bf3-ada4-2a7c1ce058c3', 'Manish Kumar', 'Marriage Hall', 'mkumar25843@gmail.com', '9876543210', 'Chapra', 'Bihar', 'APPROVED', 4.9, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('df88e378-8ee6-45c6-ab0f-0eb65a465e7c', '16b596c3-0723-43fb-a9e6-f0cddf3649de', 'The Regal Grand Lawn & Banquet', 'Banquet Hall', '', '7260014086', 'Lucknow', 'Uttar Pradesh', 'PENDING', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('b04c41c6-cd91-4e73-a543-0a3686b21ae9', 'a06633e7-aca5-498c-aea7-a690f88dd620', 'HALL GARDEN', 'Marriage Hall / Wedding Venue', 'mkumar25843@gmail.com', '6203025057', 'Amritsar', 'Punjab', 'VERIFIED', 5, 0)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.owners (id, profile_id, business_name, business_type, email, mobile, city, state, verification_status, rating, review_count)
VALUES ('a031d362-2560-4f7b-a0fc-bd923ff03e47', '09cc413d-1921-45e6-a38d-9577d92f55de', 'Heritage Event Services', 'Marriage Hall', 'partner@hallkhoj.com', '9876543210', 'Lucknow', 'Uttar Pradesh', 'APPROVED', 4.9, 0)
ON CONFLICT (id) DO NOTHING;

-- 4. VENUES
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', 'The Royal Grand Heritage Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'APPROVED', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Gomti Nagar', '226010', 65000, 65000, 85000, 110000, 200, 1200, 5, 152, TRUE, TRUE, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', 'Lawn (25,000 sq ft)')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', 'Parking (150 Cars)')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', 'Generator Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', 'Bridal Suite')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', 'In-house Decor')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-10-15', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-10-16', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-10-17', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-10-18', 'Full Day', 'BLOCKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-10-19', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-10-20', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-11-20', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-11-28', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-11-15', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2027-08-15', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2027-06-29', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2027-05-08', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2027-03-14', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-10-23', 'Full Day', 'BLOCKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-11-04', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-10-05', 'Full Day', 'BLOCKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-11-13', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('37262382-60d2-4ea8-a4e4-a2781f08ccc9', '2026-12-06', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', '3c3f3af1-952a-420c-a76d-0f8e0474922a', 'Mayur Emerald Banquet & Lawn', 'Banquet Hall', 'Marriage Halls', 'marriage-halls', 'APPROVED', 'Bihar', 'Patna', 'Patna', 'Bailey Road', '800014', 45000, 45000, 60000, 85000, 100, 750, 4.8, 96, TRUE, TRUE, 'https://images.unsplash.com/photo-1544830254-20b1274f881b?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', 'Air Conditioned')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', 'Open Stage')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', 'Catering Kitchen')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', '2026-10-15', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', '2026-10-16', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', '2026-10-17', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('408bab40-46a5-44a6-a6d8-1385eb948fd2', '2026-10-18', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', 'f16b14e1-0b22-495b-ae06-2e06533e41b8', 'Sanskriti Luxury Resort & Lawn', 'Resort', 'Marriage Halls', 'marriage-halls', 'APPROVED', 'Haryana', 'Gurugram', 'Delhi NCR', 'Sector 48', '122018', 120000, 120000, 160000, 220000, 300, 2000, 4.95, 230, TRUE, TRUE, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', 'Poolside Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', '15 AC Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', 'Valet (300 Cars)')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', 'Full Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', 'Helipad')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', 'CCTV & Security')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', '2026-10-15', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', '2026-10-16', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', '2026-10-17', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', '2026-10-18', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('aa6530bc-a18d-41ae-a7fc-bfec99c16114', '2026-11-15', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('98f24656-3b37-4f3f-ae00-8e6363eab9ef', '7b7ba247-0d82-469b-ae5b-bc01d3ea2fc2', 'Tiwari Grand Banquet & Lawns', 'Marriage Hall', 'Banquet Lawns', 'marriage-halls', 'FLAGGED', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 60000, 60000, 75000, 90000, 100, 700, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('2c751fb3-7b38-44b9-a122-2dcd5504f8ea', '0433f799-02fb-4c7b-a280-9dd45c8c6cd1', 'Tiwari Grand Banquet & Lawns', 'Marriage Hall', 'Banquet Lawns', 'marriage-halls', 'FLAGGED', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 60000, 60000, 75000, 90000, 100, 700, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('dd1e3b0e-d928-4c70-af08-5400b8923a4a', 'cabf1c82-00a0-4d53-af60-dc60eb1b3df2', 'Tiwari Grand Banquet & Lawns', 'Marriage Hall', 'Banquet Lawns', 'marriage-halls', 'FLAGGED', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 60000, 60000, 75000, 90000, 100, 700, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', '1a6ed119-ec3b-4020-ac61-be489e916cfd', 'Rajput Royal Palace & Garden', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Gomti Nagar Extension', '226010', 75000, 75000, 93750, 112500, 200, 1000, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', 'Grand Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', 'Bridal Suites')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', '2026-10-15', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', '2026-10-17', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', '2026-12-18', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', '2026-11-23', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('ee45f82b-48a3-4e55-ac1a-c7ee598a13c7', '8fcd780c-50ef-4082-a24f-1cef86d625a0', 'Sunil Grand Imperial Banquet', 'Banquet Hall', 'Banquet Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Aliganj', '226010', 60000, 60000, 75000, 90000, 150, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('ee45f82b-48a3-4e55-ac1a-c7ee598a13c7', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('ee45f82b-48a3-4e55-ac1a-c7ee598a13c7', 'In-house Decor')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('ee45f82b-48a3-4e55-ac1a-c7ee598a13c7', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('ee45f82b-48a3-4e55-ac1a-c7ee598a13c7', '2026-12-15', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('ab9995e9-7c77-4c1f-afa2-44f6509840ba', '2f7024ab-d34a-43fb-afb2-c1067ef15732', 'Sunil Grand Imperial Banquet', 'Banquet Hall', 'Banquet Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Aliganj', '226010', 60000, 60000, 75000, 90000, 150, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('ab9995e9-7c77-4c1f-afa2-44f6509840ba', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('ab9995e9-7c77-4c1f-afa2-44f6509840ba', 'In-house Decor')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('ab9995e9-7c77-4c1f-afa2-44f6509840ba', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('ab9995e9-7c77-4c1f-afa2-44f6509840ba', '2026-12-15', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('2b22467b-8c8f-42b0-afa3-b8a196b7d631', 'd5151dd0-423d-4d85-afdf-2521d39c3c75', 'Manoj Royal Heritage Lawn', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Indira Nagar', '226010', 70000, 70000, 87500, 105000, 200, 1000, 5, 2, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2b22467b-8c8f-42b0-afa3-b8a196b7d631', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2b22467b-8c8f-42b0-afa3-b8a196b7d631', 'Grand Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2b22467b-8c8f-42b0-afa3-b8a196b7d631', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('2b22467b-8c8f-42b0-afa3-b8a196b7d631', '2026-12-28', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('8ceaa8c7-d89c-41eb-afdf-8bb8d8bca6ed', 'eecb86f9-b2c8-432f-a810-55a4b6b39494', 'Manoj Royal Heritage Lawn', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Indira Nagar', '226010', 70000, 70000, 87500, 105000, 200, 1000, 5, 2, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('8ceaa8c7-d89c-41eb-afdf-8bb8d8bca6ed', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('8ceaa8c7-d89c-41eb-afdf-8bb8d8bca6ed', 'Grand Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('8ceaa8c7-d89c-41eb-afdf-8bb8d8bca6ed', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('8ceaa8c7-d89c-41eb-afdf-8bb8d8bca6ed', '2026-12-28', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('2b2c21cb-2da2-4551-ab44-16b0f15f8c3a', '9bedca0b-f020-4d42-a29d-1289a9a50841', 'Sunil Grand Imperial Banquet', 'Banquet Hall', 'Banquet Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Aliganj', '226010', 60000, 60000, 75000, 90000, 150, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2b2c21cb-2da2-4551-ab44-16b0f15f8c3a', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2b2c21cb-2da2-4551-ab44-16b0f15f8c3a', 'In-house Decor')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2b2c21cb-2da2-4551-ab44-16b0f15f8c3a', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('2b2c21cb-2da2-4551-ab44-16b0f15f8c3a', '2026-12-15', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('7d0ea8ed-d152-4f76-a2a9-7cf9e3eb86d4', '4ec3bc1b-ac62-4ccd-a975-7168690d2e12', 'Sunil Grand Imperial Banquet', 'Banquet Hall', 'Banquet Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Aliganj', '226010', 60000, 60000, 75000, 90000, 150, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('7d0ea8ed-d152-4f76-a2a9-7cf9e3eb86d4', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('7d0ea8ed-d152-4f76-a2a9-7cf9e3eb86d4', 'In-house Decor')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('7d0ea8ed-d152-4f76-a2a9-7cf9e3eb86d4', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('7d0ea8ed-d152-4f76-a2a9-7cf9e3eb86d4', '2026-12-15', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('051661ce-e4b8-434b-a43f-9d8ad9a4dee4', '8263da0b-e919-4d89-a1fb-87f34212522a', 'Manoj Royal Heritage Lawn', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Indira Nagar', '226010', 70000, 70000, 87500, 105000, 200, 1000, 5, 2, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('051661ce-e4b8-434b-a43f-9d8ad9a4dee4', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('051661ce-e4b8-434b-a43f-9d8ad9a4dee4', 'Grand Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('051661ce-e4b8-434b-a43f-9d8ad9a4dee4', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('051661ce-e4b8-434b-a43f-9d8ad9a4dee4', '2026-12-28', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('2c932278-1ba4-4965-aa5f-93b966273d84', 'de87dba2-d305-42a7-a669-789c65080f43', 'Rajput Royal Palace & Garden', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Gomti Nagar Extension', '226010', 75000, 75000, 93750, 112500, 200, 1000, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2c932278-1ba4-4965-aa5f-93b966273d84', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2c932278-1ba4-4965-aa5f-93b966273d84', 'Grand Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2c932278-1ba4-4965-aa5f-93b966273d84', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('2c932278-1ba4-4965-aa5f-93b966273d84', 'Bridal Suites')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('2c932278-1ba4-4965-aa5f-93b966273d84', '2026-10-15', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('2c932278-1ba4-4965-aa5f-93b966273d84', '2026-10-17', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('2c932278-1ba4-4965-aa5f-93b966273d84', '2026-12-11', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('2c932278-1ba4-4965-aa5f-93b966273d84', '2026-11-21', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('f3d6c9f1-3540-4539-a1ed-68c0df629635', 'ff8183c5-c886-40a5-aaef-dbf8d9318add', 'Tiwari Grand Banquet & Lawns', 'Marriage Hall', 'Banquet Lawns', 'marriage-halls', 'FLAGGED', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 60000, 60000, 75000, 90000, 100, 700, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('bad2fd20-3122-482d-aa2d-2414ab028740', '5eb051bf-69b4-4e96-a6b5-cf882597ab20', 'Royal Heritage Grand Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 150000, 150000, 187500, 225000, 200, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bad2fd20-3122-482d-aa2d-2414ab028740', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bad2fd20-3122-482d-aa2d-2414ab028740', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bad2fd20-3122-482d-aa2d-2414ab028740', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bad2fd20-3122-482d-aa2d-2414ab028740', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bad2fd20-3122-482d-aa2d-2414ab028740', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('5aa5d622-e4b1-4960-a72b-f6c003394ce0', 'd7d724af-7424-4360-ae0c-bd5906b320bc', 'Royal Heritage Grand Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 150000, 150000, 187500, 225000, 200, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('5aa5d622-e4b1-4960-a72b-f6c003394ce0', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('5aa5d622-e4b1-4960-a72b-f6c003394ce0', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('5aa5d622-e4b1-4960-a72b-f6c003394ce0', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('5aa5d622-e4b1-4960-a72b-f6c003394ce0', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('5aa5d622-e4b1-4960-a72b-f6c003394ce0', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('740e21e6-9b8b-4c7c-af07-bcf353891c8e', 'dcf0fa32-598b-4d26-a267-137035c0a7f3', 'Royal Heritage Grand Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 150000, 150000, 187500, 225000, 200, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('740e21e6-9b8b-4c7c-af07-bcf353891c8e', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('740e21e6-9b8b-4c7c-af07-bcf353891c8e', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('740e21e6-9b8b-4c7c-af07-bcf353891c8e', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('740e21e6-9b8b-4c7c-af07-bcf353891c8e', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('740e21e6-9b8b-4c7c-af07-bcf353891c8e', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('71848242-13aa-4ad0-a563-dd179d5534a2', '46a122eb-6b3b-4120-a458-b95bff5d36f0', 'Royal Heritage Grand Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 150000, 150000, 187500, 225000, 200, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('71848242-13aa-4ad0-a563-dd179d5534a2', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('71848242-13aa-4ad0-a563-dd179d5534a2', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('71848242-13aa-4ad0-a563-dd179d5534a2', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('71848242-13aa-4ad0-a563-dd179d5534a2', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('71848242-13aa-4ad0-a563-dd179d5534a2', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('71848242-13aa-4ad0-a563-dd179d5534a2', '2026-11-25', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('30face69-d4de-4266-a247-5b90929ef361', 'cfc38b55-79e7-4b22-a1d0-3bb0c8aa3e55', 'Royal Heritage Grand Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 150000, 150000, 187500, 225000, 200, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('30face69-d4de-4266-a247-5b90929ef361', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('30face69-d4de-4266-a247-5b90929ef361', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('30face69-d4de-4266-a247-5b90929ef361', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('30face69-d4de-4266-a247-5b90929ef361', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('30face69-d4de-4266-a247-5b90929ef361', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('30face69-d4de-4266-a247-5b90929ef361', '2026-11-25', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('bc69801c-ed60-4c4c-a510-623ff189ee01', '5234f26e-442d-4b84-a937-ef48c8f9c6db', 'Royal Heritage Grand Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 150000, 150000, 187500, 225000, 200, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bc69801c-ed60-4c4c-a510-623ff189ee01', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bc69801c-ed60-4c4c-a510-623ff189ee01', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bc69801c-ed60-4c4c-a510-623ff189ee01', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bc69801c-ed60-4c4c-a510-623ff189ee01', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('bc69801c-ed60-4c4c-a510-623ff189ee01', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('bc69801c-ed60-4c4c-a510-623ff189ee01', '2026-11-25', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('22b319ce-f90e-4ba3-abae-6977598a7c69', '2288057a-58f4-4a6c-a213-2b9707f0a563', 'Royal Heritage Grand Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 150000, 150000, 187500, 225000, 200, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('22b319ce-f90e-4ba3-abae-6977598a7c69', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('22b319ce-f90e-4ba3-abae-6977598a7c69', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('22b319ce-f90e-4ba3-abae-6977598a7c69', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('22b319ce-f90e-4ba3-abae-6977598a7c69', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('22b319ce-f90e-4ba3-abae-6977598a7c69', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('22b319ce-f90e-4ba3-abae-6977598a7c69', '2026-11-25', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('34a9c325-7b93-4e13-a68e-844512909d42', 'f0336370-0367-4f58-aac7-c405b4ef6c2f', 'Rajput Royal Palace & Garden', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Gomti Nagar Extension', '226010', 75000, 75000, 93750, 112500, 200, 1000, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('34a9c325-7b93-4e13-a68e-844512909d42', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('34a9c325-7b93-4e13-a68e-844512909d42', 'Grand Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('34a9c325-7b93-4e13-a68e-844512909d42', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('34a9c325-7b93-4e13-a68e-844512909d42', 'Bridal Suites')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('34a9c325-7b93-4e13-a68e-844512909d42', '2026-10-15', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('34a9c325-7b93-4e13-a68e-844512909d42', '2026-10-17', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('34a9c325-7b93-4e13-a68e-844512909d42', '2026-12-16', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('34a9c325-7b93-4e13-a68e-844512909d42', '2026-11-21', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('443907e9-3a76-483a-a5ff-92f3b55978e6', '0766276e-d9f0-4289-a12a-ba0c1182a784', 'Sunil Grand Imperial Banquet', 'Banquet Hall', 'Banquet Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Aliganj', '226010', 60000, 60000, 75000, 90000, 150, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('443907e9-3a76-483a-a5ff-92f3b55978e6', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('443907e9-3a76-483a-a5ff-92f3b55978e6', 'In-house Decor')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('443907e9-3a76-483a-a5ff-92f3b55978e6', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('443907e9-3a76-483a-a5ff-92f3b55978e6', '2026-12-15', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('a5a33d9d-9ffd-4865-a9e4-ef52ea8f6dd6', '970e7b39-44b6-4a8a-a5bc-0d14226b7d53', 'Manoj Royal Heritage Lawn', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Indira Nagar', '226010', 70000, 70000, 87500, 105000, 200, 1000, 5, 2, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('a5a33d9d-9ffd-4865-a9e4-ef52ea8f6dd6', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('a5a33d9d-9ffd-4865-a9e4-ef52ea8f6dd6', 'Grand Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('a5a33d9d-9ffd-4865-a9e4-ef52ea8f6dd6', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('a5a33d9d-9ffd-4865-a9e4-ef52ea8f6dd6', '2026-12-28', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('464a60d3-74f2-4476-aa05-1e27eed531cd', '474278d0-4968-4335-a741-ebb47df88d1e', 'Tiwari Grand Banquet & Lawns', 'Marriage Hall', 'Banquet Lawns', 'marriage-halls', 'FLAGGED', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 60000, 60000, 75000, 90000, 100, 700, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('0b129fc8-9cf5-4618-aa3a-0db203a947df', 'a7448621-5810-48cb-a5b5-93ae2e14543b', 'Royal Kohinoor Palace Lucknow', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 120000, 120000, 150000, 180000, 100, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0b129fc8-9cf5-4618-aa3a-0db203a947df', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0b129fc8-9cf5-4618-aa3a-0db203a947df', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0b129fc8-9cf5-4618-aa3a-0db203a947df', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0b129fc8-9cf5-4618-aa3a-0db203a947df', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('10603187-5ed8-4043-a2a1-d1a5cb4d5e13', '7ed23ed6-158e-4d23-abe2-2c2e3e21d13c', 'Royal Kohinoor Palace Lucknow', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 120000, 120000, 150000, 180000, 100, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('10603187-5ed8-4043-a2a1-d1a5cb4d5e13', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('10603187-5ed8-4043-a2a1-d1a5cb4d5e13', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('10603187-5ed8-4043-a2a1-d1a5cb4d5e13', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('10603187-5ed8-4043-a2a1-d1a5cb4d5e13', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('10603187-5ed8-4043-a2a1-d1a5cb4d5e13', '2026-11-20', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('25958f87-b31a-404e-a2a5-2a9a1c602ab7', '6d7e361e-b67f-416f-aebf-6421be48ecd1', 'Royal Kohinoor Palace Lucknow', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 120000, 120000, 150000, 180000, 100, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('25958f87-b31a-404e-a2a5-2a9a1c602ab7', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('25958f87-b31a-404e-a2a5-2a9a1c602ab7', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('25958f87-b31a-404e-a2a5-2a9a1c602ab7', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('25958f87-b31a-404e-a2a5-2a9a1c602ab7', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('25958f87-b31a-404e-a2a5-2a9a1c602ab7', '2026-11-20', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('9ed1f117-0a5a-471c-ad72-3bc6db8b56fb', '5f1dcff4-ba54-43c5-afbb-8d286cd0809e', 'Royal Kohinoor Palace Lucknow', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 120000, 120000, 150000, 180000, 100, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('9ed1f117-0a5a-471c-ad72-3bc6db8b56fb', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('9ed1f117-0a5a-471c-ad72-3bc6db8b56fb', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('9ed1f117-0a5a-471c-ad72-3bc6db8b56fb', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('9ed1f117-0a5a-471c-ad72-3bc6db8b56fb', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('9ed1f117-0a5a-471c-ad72-3bc6db8b56fb', '2026-11-20', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('4bba7e2b-15b3-4143-ac8c-264e05ae64d7', 'b43c3331-6363-4f4c-ace8-25760d559c6d', 'Royal Kohinoor Palace Lucknow', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 120000, 120000, 150000, 180000, 100, 800, 5, 1, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('4bba7e2b-15b3-4143-ac8c-264e05ae64d7', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('4bba7e2b-15b3-4143-ac8c-264e05ae64d7', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('4bba7e2b-15b3-4143-ac8c-264e05ae64d7', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('4bba7e2b-15b3-4143-ac8c-264e05ae64d7', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('4bba7e2b-15b3-4143-ac8c-264e05ae64d7', '2026-11-20', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('d87b142c-b5d1-43ab-a0c7-e03c67728277', 'effdb8de-d0f5-44a9-a7e8-c4396b6140ce', 'Royal Kohinoor Palace Lucknow', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 120000, 120000, 150000, 180000, 100, 800, 5, 1, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('d87b142c-b5d1-43ab-a0c7-e03c67728277', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('d87b142c-b5d1-43ab-a0c7-e03c67728277', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('d87b142c-b5d1-43ab-a0c7-e03c67728277', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('d87b142c-b5d1-43ab-a0c7-e03c67728277', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('d87b142c-b5d1-43ab-a0c7-e03c67728277', '2026-11-20', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('e01aed5e-4ab0-44b8-a4ad-15a479c8265a', '75fbe0fa-f672-4b14-aa9b-48bbbc025091', 'Royal Heritage Grand Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 150000, 150000, 187500, 225000, 200, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e01aed5e-4ab0-44b8-a4ad-15a479c8265a', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e01aed5e-4ab0-44b8-a4ad-15a479c8265a', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e01aed5e-4ab0-44b8-a4ad-15a479c8265a', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e01aed5e-4ab0-44b8-a4ad-15a479c8265a', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e01aed5e-4ab0-44b8-a4ad-15a479c8265a', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('e01aed5e-4ab0-44b8-a4ad-15a479c8265a', '2026-11-25', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('04f030c2-220b-444c-a90f-ec4d4c8740fe', 'abc2971d-0eaa-4333-a828-223706ce49b9', 'Royal Heritage Grand Palace', 'Marriage Hall', 'Marriage Halls', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 150000, 150000, 187500, 225000, 200, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('04f030c2-220b-444c-a90f-ec4d4c8740fe', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('04f030c2-220b-444c-a90f-ec4d4c8740fe', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('04f030c2-220b-444c-a90f-ec4d4c8740fe', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('04f030c2-220b-444c-a90f-ec4d4c8740fe', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('04f030c2-220b-444c-a90f-ec4d4c8740fe', 'Power Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('04f030c2-220b-444c-a90f-ec4d4c8740fe', '2026-11-25', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('36926d03-62a2-413a-a6f0-98292965ea73', 'f843f1c9-cfed-4e6b-ae5e-7b5f03948461', 'Sunil Grand Imperial Banquet', 'Banquet Hall', 'Banquet Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Aliganj', '226010', 60000, 60000, 75000, 90000, 150, 800, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('36926d03-62a2-413a-a6f0-98292965ea73', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('36926d03-62a2-413a-a6f0-98292965ea73', 'In-house Decor')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('36926d03-62a2-413a-a6f0-98292965ea73', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('36926d03-62a2-413a-a6f0-98292965ea73', '2026-12-15', 'Full Day', 'PENDING')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('e8e81d96-f599-49cf-abfd-7335504a9e45', '54f07d2a-2ea1-4364-aa61-b0b4811e034e', 'Manoj Royal Heritage Lawn', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Indira Nagar', '226010', 70000, 70000, 87500, 105000, 200, 1000, 5, 2, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e8e81d96-f599-49cf-abfd-7335504a9e45', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e8e81d96-f599-49cf-abfd-7335504a9e45', 'Grand Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('e8e81d96-f599-49cf-abfd-7335504a9e45', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('e8e81d96-f599-49cf-abfd-7335504a9e45', '2026-12-28', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('b7d510d1-f24d-4519-a11e-01868700be4d', 'fd0b5c66-7ed1-405b-adbd-c30bc9bc99d4', 'Rajput Royal Palace & Garden', 'Marriage Hall', 'Marriage Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Gomti Nagar Extension', '226010', 75000, 75000, 93750, 112500, 200, 1000, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('b7d510d1-f24d-4519-a11e-01868700be4d', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('b7d510d1-f24d-4519-a11e-01868700be4d', 'Grand Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('b7d510d1-f24d-4519-a11e-01868700be4d', 'Valet Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('b7d510d1-f24d-4519-a11e-01868700be4d', 'Bridal Suites')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('b7d510d1-f24d-4519-a11e-01868700be4d', '2026-10-15', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('b7d510d1-f24d-4519-a11e-01868700be4d', '2026-10-17', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('b7d510d1-f24d-4519-a11e-01868700be4d', '2026-12-10', 'Full Day', 'BOOKED')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('b7d510d1-f24d-4519-a11e-01868700be4d', '2026-11-22', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('cbcaa965-0193-42de-a394-87ccdecfa1b3', 'f1fd29be-3329-4bc1-a1ba-396f2836c85a', 'Tiwari Grand Banquet & Lawns', 'Marriage Hall', 'Banquet Lawns', 'marriage-halls', 'FLAGGED', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 60000, 60000, 75000, 90000, 100, 700, 5, 0, FALSE, FALSE, '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('fa5f931d-44b5-4c20-a8fc-5bb42f3c9712', '16b596c3-0723-43fb-a9e6-f0cddf3649de', 'The Regal Grand Lawn & Banquet', 'Combined AC Hall + Lawn', 'Banquet Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Uttar Pradesh', 'Lucknow', 'Lucknow', '', '226010', 95000, 95000, 118750, 142500, 400, 1500, 5, 0, FALSE, FALSE, '/assets/uploads/listings_1790533840643_j7giyk.png')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('fa5f931d-44b5-4c20-a8fc-5bb42f3c9712', 'Central AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('fa5f931d-44b5-4c20-a8fc-5bb42f3c9712', 'Lawn')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('fa5f931d-44b5-4c20-a8fc-5bb42f3c9712', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('fa5f931d-44b5-4c20-a8fc-5bb42f3c9712', 'Generator Backup')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('fa5f931d-44b5-4c20-a8fc-5bb42f3c9712', 'Bridal Suite')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('fa5f931d-44b5-4c20-a8fc-5bb42f3c9712', 'DJ & Sound Allowed')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('fa5f931d-44b5-4c20-a8fc-5bb42f3c9712', 'Outside Catering Allowed')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venues (id, owner_id, name, type, category, category_slug, status, state, district, city, area, pin, starting_price, price_weekday, price_weekend, price_full_day, capacity_min, capacity_max, rating, review_count, is_verified, has_3d_model, cover_image_url)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'a06633e7-aca5-498c-aea7-a690f88dd620', 'The Diamond Banquet', 'Banquet Hall', 'Banquet Hall', 'marriage-halls', 'PENDING_APPROVAL', 'Punjab', 'Amritsar', 'Amritsar', 'Krishna square', '226010', 50000, 50000, 62500, 75000, 100, 500, 5, 0, FALSE, FALSE, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAxAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgABB//EAEIQAAIBAwMBBgQEAwMKBwAAAAECAwAEEQUSITEGEyJBUWEUcYGRMqGxwRUj0UJSYiQzNENTY4KS4fAHJTVEc5Oi/8QAGgEAAwEBAQEAAAAAAAAAAAAAAQIDAAQFBv/EACQRAAICAgMAAgMAAwAAAAAAAAABAhEDEiExQQQTIlFhMnGB/9oADAMBAAIRAxEAPwBz1GKDcGzbcozAx5H90/0phsqLLlSCMj0r56OSj3nEikgZfCcjFdbjwbvNjn+lAS7rFvWA9D/dPp8qYw47tcHjAxTt0Ci0GvQ4BwSAfTPNQ5+nrXhijdwzoCw6Eituai8Gprk1Wg3dOKvjBjYbkJFHc1HpDIRuBAozT4o7iYI8qxr+Zq+OSyuCwcdz4cBeuTXkumSptkhIPGfCQcCimybl4+Cq+tmt3KjJ9Gx1FD25PejJH1pjaym5fu78n0VmHIqi5sO6mba2EB4ZiFz96HlhUl1LsN1tMQROoXG3GQMUljQs4XFHSTySoI5bmJo16DOart1hjkDCeI4OTk4/ai3b4BBaxpjDZDZWDGVULPxjzHuKSbi7+AYFH37S3su4lXA6bGBwKrtJY7Yus9uXyuPlWvk0VSt9sna2neK5eREAGfF50vlKhtvBbPUUYsdzfSKnOOi/KrBZ21sjG5nG8HGwcmtZuE+RWQyjODU572aWIRPIxjHRc1dfywSMBaRSAAcknOaXyAqeeKDdDpX2S2NISVUn5CqXGD8qNs9Sms43jhIw/XjNAyEsfc0NjJMGuv8ANZzjac0vmmklfuYPxH8Tf3RROpd68IitxmR2wPYDqattLVbdNqnLZ5J6k1t0lZtSqK1iiQLtyfM+te0aISecV1T+wegxNpHFEwae90rmEjKDJBPJ+VBGOaCTZ1qcF+0UnBKuDwQahF88jyTrgqngB3RyJkHqGFUWkXcRiLJKr+A+3pR9xcG5cyyHMh6n1qj2pt/Da/siy7lK5Iz5jrUlG1cbi3ua4cEURcTQyRRiK3WNlXDMCTupthXweQKxPgAY+nWmSXMhbfJaxOAMcDGKWW1zJbnMbsp9RTC0uZZY2WS77teuG8z9qdMWSLAYGUCWCVWByTgEf1qYulsg3cySjd+FM8kftXR3AMm5rh3Z05ZUz9KX3YkaQO4IBHG4Yo7UIo7cMLga71CUR24EYxnw8ACmNtoMbnNzOzE+YxzQemStHGrWxG9Rhlp3b6jbMR3oMcmMEEcVozi+2Qzbx/w6B49Et9xDB9vkc9a8fQ4N+NjbfXcaeRlXQFSCPLFUT3cFvkSyAH06mnfx4xjbkcv3ZG+BHP2eQoWgmdSBnEgBz9aSvLPbPskbdjyfkGtDd30txnuVMcYHVqz+oTLK6RxePb1b1NQebaVRO7Ap1+YVbPHOkeZJEQE5ReSpqwpbxpJi2md88M3hAHvQlohtSfie+ib8QKp1PlRD3SdHvplDjL5Xz9OlUUmhmueDwmYy7obOMHZjByfrSa6UrJhiN3mB5Udc3rRgNHfSOWXHhbpSrvCz7my2T1PWllKykY0E2lz8IzP3UchIxiRcihXJJJ6VffXkc8ibIUiwMBUHX3ob5mlcvBox9PAviz1PTJpvpQs4Uaa6O515SPHB+dJ2k21RNdMVIBNKpOzONqhzc3kTzM21Rk9F6CvKhY6cZrdZG6tzXVNzVm4XBoJoUJBwM1nNXg7ucMnQ+laNn4FLL6MSMPakjwGCYlilIwKLQ5Ga8lsG6qKgm+E4cHb60XIpRNxkYOfpQ/xDRShZ+AfwuPM+9GKFfHiAB8/SoahbLE5i7xJUI/Ep4NNF+ivuj2ad55N7tuPTgAVfEjpbGZXTG7BGeaTK8kDbWV2HRXUc496vFw3+zkPHmMU9sDXg7t9Sl2RxqY0IPDbRzRLy26qBe3JmI6IhyB+1Z6G6aORX7liVOQDj+tTmu2nmaUxbCTnC7QKZSZNxVjhLV7hmntgbeEDI3P0+tQtby7eQRB1kJOORmgorwdw0dxvdceBQ2AD6+9V219JaSb4Www9RQer7NqxzNql1ZyGHMJYddmcVC9v7yEKZFRd43AhQT96RPO7OWLZycmp3F7LOiLI2QgwvHQUOGZY1+hxJDLd2QuEuTNj/ADiEY21VaTWDRdzcRmGUf61ecn3pMlxLGGCyNhuoU4zVbSMfQ/M4pk0ukHXirG19cmKcFbrv2ToScj86ou9UeaJEEKKRwWQfnSkvKBgGJQPLxGolpT/rYx/wtRdsySCWkHnjFDPO+4x24APmxH4arcSMMd8n/Kf61KIxRDG4D3J60rVDcBEKCMYXLt5sTyatJAGT0qM19ZBI1hVUYDxHvMlzUIVmvH2oPBSPsKdlEsjM21Ktgtdxy/nTCPTxEDvxmrViArbBoaWB2Wka+gryqoHxGB6V1TcTaBbNytDydc1Nj4lqD81mNFEUbJ5or4eOWEhl60MgwaKSTC0jBO/DHa+LmwkX4eTapJyMZpJNrF8pH80en4RWt7RIJO7+tZLVLPNxGi8FsZrpwuL4aFkERXN4fhnkuVaOfqsIUunzWo6nJe27AxtOUIGS6gHPn0zxSCUyxvtdWU9eeDjpXirJIrFcEKM8kfvXX9Ssk5B0eq3jShO/fk+RrpdQu0lZWuJvYbqDsNzajAjA8sKv1OHbey7mIHh2r0z8qbWKlQL4Lf4lc4/z0p/4jXi39yx5kk+rmowWEsqqyIcHjxPj9avnsu7jQ5TOBkbjyeefT7VtYhth9jmWItLJuIPQykeXzpXczTxkgOWPsxouWwkATuizqw6lCNtQbT9kzCWRo4Qx2s6EFh7D1pI632a2LjPLjkn71RId4O4bqZvp5ZTsdDz4cLk/X0/6UHc2jRMpYgBhyR09cfnVlqK7K7pDFHGwAAPHIrrVQ7gSyxxj1YZ/SmGrWzDTbVwCCwBG7zGKVw26OW7yTZhSc7c5PkKEacTO0xvePp3wyRI8LEEFniiIb7k0sxGZNqZAP4Q3XFULnxbAcKOattY//MIifMVlFRRrGWn2v86Peo4cEV9I0q3WCHpWQgjCzIcDyrZo+I/SvOzztnRGJG6xnpQZzmiJGySPOqTU0MTQ4FdUA1dR5MFs471cHPFSJr45Druupc91/FLng45CsfzHNaGy7ZajZSKmpxidMf3BG4/Y11ZPiyXTEjkvk+gg17u4rOWvbHSZziRp7c/7yIkfdc01g1OxnTfBdwyD/C4zXJPHOPaKJpg+ttzEPY1nNckELKc4cpn5Dp+f6U7upBcZklztjBI5HPtWZ16WM2z3UpIYx4UDpu8hT4FbFkKzh3QEDmLp772oRhIvCZp1bCykgjZ9m4qOsh/rQmp90jILTYExyVbPNd0cnOtCyxcXZfpMaPe27gkSBhkEcYxVurxv8c+5MqAMH6CvNN+G7gNMyLJk4O/Bx96IuDaEKQ6Elxuy2ePvUnke4yw8dldveNDHt2A/QfnxUg1q5yUZSepDZ8vT/rVxOn/2e4P2pXdM/wAQ/cjMZ5Ur0owns+gSxKPporXUXitXjRd5L+FpBkoPY/U/lS+7mSW5LytK3hHJIyD51bbz24t0EmwuBz4arnmtjNEVAK858B/pUlOpdDfSq7BxeCOFo40RSeM45PzzQs00kjK/mpyG+v8A396YPc2q9Qef92f6UidJnuGMSkorZyAeB610Y5bXwJLGo+j247k6Zb95tcg8qjgHPPz/AEpLs3kgDFMmvrVVB5PuI6p/iFuJ2cbtu0D8PnmkjKS8GeOP7AhGVRwFPI9KjAw+MhbyAwaZPerJayukcuxeC4UYGelJLZjDcLIzZ2nPBGTVouUk7QkoRTpM1vxsAKnvBx1ODxWkF58TY99ZOHDDII88V8//AIuo/sP9SB+9OdL7TaZY6YBc3K95vc93GN5AJJ6DpXLPBOuh9oLpjy1v7iRwsyBT5nGOKY5yaxU/bFZhIdM02WYryWkYA89OBk0Ib3tfqWVhiNqnpGqp9y2T+lFfGm3b4J/avOTZXN7p0Uuy5vooZAPwG4CH7Zrq+Y6tpd7aXZW/Vp53UOXDF+vqT58V1dEfjY67F3kVwNnURk/6wfrW+0S3hudRuxcRJKFhTh1B82r59YEm9i9TIv619C7M/wCnX/8A8cQ/N6HyeF/wfF/iw+60HSGVpHtY4lCklkOwAfSstZ6dbzXPxManuN26EF8nHkTTjtPfd/KukQswD83Dqudo8h9cVUHW3hyRhSQo2jAyfaudOSjy+WNwSnuH7w26gHCbuvU88Vldb1F5LmKGGPekK4IwOT5mnU100dxL3YPfSqkcZ8txJxms4ts7ahdW4x3gkKnPqM/0rowQS/JiZG3wi2w1pLVy8lsp8JGGj/D71bFqEcu4o27JycJ0o+zubiymu4rTuwZIxG29AwII6HI6Vnrdc6ZesPCQ/OOPOrKMZWyO0o8Db4/uRuRN5HRDkZoiDVnQu8mIWAKkbQwH3FJtHBa0kLEnEy9T70bqCfy7vH+0P60soR21KRcnHYPGr2e/wyqF9C1MpNWaS3WaRojFgKpUc459B+dZns8IPjJGliR1Hkyg+Zrctqdo1p3fcxYA6bRXJ8iscqSsthjKcbZnl16CFiUudrEEcA9PtUrfUVuQwtnU7QM8nH6UuvljF5gIig87ce9OdN1SO0jAVV6eQp8iUYpxQIJuTTYnv9djyFmd22jpz09ORQM3aGPvWNrFLEGTBCyHpjnn3o/tXeJd2zOFXOR5e9Zi3fbEw2qcA+Wa7MEIyhs0cnyJyjOkxlcNcLZLcGZim7Gwmln8QfI6DI546U1mYtonP+0J6f4RWf71mBBPG3Aq+GKd2iOeTi1TDVvbgjamdvmOmas7u5lwruq8ZwCc1PTUDaVct5gH96afDZtY7nnhFXGPUitKSizY4uSts7Quznx0TXd87Lb8bSHzyRnn08vvWh7PaNpU6SmSwQvFJt8ZLgj1weKlo6onZFHBGWjJY+44/ar9AvIzqV1YRQbO7jWQvuzuJx5fWuDLknLavDrhCEaC+zsMcdrcII1XZdzJwMYG84H2pfpc1zD2omtzJIYMvgEsQfTOTzTPRmPe6ig6rdv+YB/ejFtYBL33w0fe/wB/aM5+dQcqk79KKqMr2zt2k1SMqcDuAP8A9NXU81e27+5Vm67APzNeVfHllGCVCSVs+ZwymO4ByCyEH54p5p3aS7sJZXgjgZ59oO4HA25x5+9Z2IBpmOKa6Rbo9w0s3c9zFwRKeBkdfpiuzJCNcojCTo0WmwyB3e4AN3K38zx53HPB9qu1GRcIiMu0Sr9Tmh5LywVHQ6pABsOWiDPjPGOK9UJdaaJrCJ5xGRgiNiSQfMDn3rjcHtbOjZVwWaZIs+uIwAZbTjwnIYkdfpWWnv5odZupohgtO+MjPrWk7I2N7FHcTXNrJD/M8IlQoXG3yB5P0zRlvo+kWzvqSC9eVJDmKTwAkg5/Eoqsfwk01fRKX5JNMzWj3k9zfTPLglV9MVTYwyT6dfRqv8xn4HTzrZ2N3pcsTXcelSeJsMQUZs/4j0HTzNMtOaz1FXKWToikfzHRdrnzCkEg49qEsjjb1NGF9swFrby2NjMJ1Cv3isBn0rpJu+sbyTpubdx05Oa+kfw7S7WLFwkIQ/2p2GCfrREOmae8Q7i1t9rjI8AwR9qn93OzQ+tLVM+NwXU0TMUbGTyaY6deTXF3HFLM2wnnbjP6V9PttA0qKV54raOQynfuKggcdAMcCi/4bYD/ANnD/wDWv9KeXyIy8BHHKPphpLexLgtHDv8AI7Tx+dZvWpTBfFYGKoQCMYx7+Vb/ALZ9nLa90xri0ijiubdSU2DG4ZGRgdTxxWI0bSbz4+IXdqwt+d4J46e3NHG4qOzYs9m6EclxJKdkpJXaTtPGeKnBA9wjCEDdyCufLj1+daPtdpsFpDbz2sQVcsj43eY461nJAqcqW245Ujn71048inC4nPPG1LlksziP4YnBBwVzxuoOe1e38MqrvbkYOabWGnQ30YEd9FDd7jiOY7QcAEEN9T1pdn+Z/NORuwxz9+apF0xZxUkFaV/6fepkKDHwM49aBjkkMSYkfHTGTWhm0eFJ3tbq50+wlTbuDySMy5AI5JI6EUz06w028E9tbafYTzRBdjrdOd4z4mK7hxj0pXNJ2MsbqrJaU7P2LkXJ8EUgB+prG208yxORNKshAG4Oc4+9bCLQtTijeEXsFtp8mW5OQAfIcnj60sHZa7uPFYXdjNCOAwkIP1GOKnjSi3/R5c0Z/wCLuQSBPNk8se9YZPqea8N1c+csx+crH961Fl2au5N0a6ZDfsh2vLBeFDH7EZx+VB6roZtI8Q6VrcU2ct38ayR7fM7kWrKUX4T1l+xH8RKfxSy59pDXVAtGfOvabRA2/pq9M7KG6tYbpLtA81s0qwFgHLjoOeMe9Cd1q2jyOvw1sd/J3tFL+jHFdqGqabhH0+2vYZwMd7Lch8ADGNoXHSgYNQktZFV8XSA7u4uSzxk+4yP1pNWx9/DVaBFrUs9ssmn6TDZO6sz7IgSo54AYtn6Uxnn7UpeySJ2et3jBKxZwp2ZOMgOP0rJTa5cG5C20Vpp+B+KwhEJb2Yjk/etH2D1m5l1Waxup3lacZRpnJ8Sjp9v0pJR9Yyl4XTxa5eJNdzae2l3FtHujkidm731XbuIx9KOfRtUusE9obmCDG1iUVQfLqMU71d7+OKT4C3FxN3YEY3gDcSeTnjA4NYlY9W129l0zWtUVlscOUhTG5vYgDofal/0YV6r2YurS7ZIrlLlcFtxyOB+v0rY/+HlrdSaJ/NQpE0heJ36OCByPal9nBbfwjs7LKqtgyv3nQkndySfXjNa/Swo0+3CABdnhA6AZOKTJ+aoaP4uwXtBoFvqtr8PcjfjkSKuSvTOPnirorqCCNI1WbCAKMQyHgfSmSYCZYgAdc1BSh5HPvXHlk4ceHRBbC+wmX4SJdkoIXkNEwI/KihKvo3/If6UQoX0qW0emKh938KaAV06yW7RhWJb/AAHFCR2qg52AH5U3ZQVqsR1LJJyYyVCTUdLhvYDHPErqfIjzrCan2Q1CK5YWcJlhPRiwGPavqjRVW8Y8xT4c88XXQk8cZ9nyux0PV7O5i76ACKaeJHUMDnxg/tWu1LsLZ6vci5Fx8GWQK0SRjaxHn9q0IeKFwJEPiwFOMjP7UU67SARjAxXfjzTyc9MhLGo8GIPZV27T3k+qxQy2UoLRESdcYABx0wBTCw0bszds8unLbTyRLjYkmdh8uM4zR3aeZbfSZZi5QbXQMPUqf3rLXCpBo2h3+mMbW8uligaSP0xggg8EgjzFdC55JdMIi0Ca40NY57PuNQRSImbwlSDhefLjFAN2X7WqD/lZX1/y01q9K0jVraSWS51L46BxkCUYdG9vLH2o7tZM1p2fvbm33NKIyqqOuTxn6daZOnyB9GD0/T9Umt5BZ66ZXzv7u1kkkkfjHIIHoOc+dR1G2e1RO/1TX0nOMpLH3YPr/a/SsfA7oQY3ZSvQqxFXHULt2Ie5lk443MW/Wn0l4T+yPpcbCJHcIC6Z8JdRux717U4Ne1C1QxwXZjQndgKP6V1HTJ+zbY/0Vafp93qVwI7KAykck9APma+jaJ2BsYyH1UGeUjoHwgPtjr9a1Ntp2m6fG0VnZwQq3JESBRn6URnxDJyRTr8hGtRKey+k9xiDT7bvTjMndrn8xQ+gdiE0/Umv7m6WaUEmNFQKqZ8+PatDaMV3N/ZGB+X/AFokuQ+AfD5UJQvgMZ0QnQhPCoBA8qRQ6JHCb54WdJ7zO6Q87Tt2jA9utaE/2vlXgA8/OoThqVjKzO6doiWum2Vnd7JzbKVVivuft1ptFbosaqowFGBgkYFTbaZZAp/CcH2OKmtcEpSs7ElR4YUwM7iPTcaiF5q7qOK9VanJN9jJpFajHUVMDipkZIqRTip6G2KcVwFW7a82mjobYpK14U9quIrsVtDbA/dKQQwBB8jURbQr+GMCiCKi1NFNdAbTAb6wt7q3lhkjGJFKkjrg0PpfZ+ysdPSzSPvY433oZgGIOc8ennTJ+ASfL2q63eNwdjbhXVg2umSy1RC3jePPmDUtRsIb60kguRlHUq2Dg1emV9zjH1qiQdBk8mu9Y00cjnRipewFlYbntpY5IxyFuI97D69Pyoq60XSlTZDY2qeWDCuD6Z4rR3/FtcFQSUjYge4HFfEjquuNbveNe3pDYJPBX9OKqoL0jOVG6fsRokxEuyVN4ztjkIUfLmvaJ7E6k2oaGslyweRJGQsAOcYP711LTCmmrNYoy/P/AHxVSn8R+de11GHYZk7T/Rx86u81+Qrq6i+wImfOl+sXEtvBAYW2lpQpPsa6uqGUtjC4I1RhgdeufOvceI11dXns60TWrYvxV1dQYTyrT+BPlXV1KzMjXh615XUTHECvK9rqxiBqJrq6iYgv4qrhGLokE8p68V1dVsXZOfQWThPdmwTVfW6IPRegrq6vQh0cc+yhTl3z5/1r5lYRo9pqUDAd33jjb/xmva6mYgV/4fDbosyrwBdP+i11dXVmBH//2Q==')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'Parking')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'AC')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'Catering')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'Decoration')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'Stage')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'DJ/Music')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'Generator')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'Wi-Fi')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_facilities (venue_id, facility_name)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'Rooms')
ON CONFLICT (venue_id, facility_name) DO NOTHING;
INSERT INTO public.venue_availability (venue_id, event_date, time_slot, status)
VALUES ('0bf0c964-7c20-473e-a7da-27f7b41ad3c9', '2026-11-04', 'Full Day', 'AVAILABLE')
ON CONFLICT (venue_id, event_date, time_slot) DO NOTHING;

-- 5. BOOKINGS (Phase 9 State Compliance)
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('85f8cd4a-9b1d-4115-a2eb-afa1e5a13c74', 'HKF-2026-312920', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '84736156-3eb5-448d-a230-329f9f122e9a', 'Test Customer', '9876543210', 'test_1789828781990@hallkhoj.com', '2026-11-20', 'Evening', 500, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('cf07c1eb-bf27-40eb-adfc-7181f64d6ce0', 'HKF-2026-352160', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '3d295277-159b-44b2-aad2-15c119e29a26', 'Test Customer', '9876543210', 'test_1789829894663@hallkhoj.com', '2026-11-20', 'Evening', 500, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('9f1c72b8-09fc-4dee-ab1e-472cbeee72d8', 'HKF-2026-415243', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '5238729c-2ad5-4d9f-aa8b-f74ffada286e', 'Rohan Verma', '9876259636', '9876259636@hallkhoj.phone', '2026-11-20', 'Evening', 350, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('3d9da9c5-b9a8-4ed3-a065-e5c37580a901', 'HKF-2026-825315', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '48471669-e378-4363-a036-7e5d32d0dc9d', 'Test Customer', '9876543210', 'test_1789830714934@hallkhoj.com', '2026-11-20', 'Evening', 500, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('42c568f3-a1c9-44a8-a644-1efb73ff26a1', 'HKF-2026-119646', '1ff3e88c-861c-497c-aa2d-ea898923c021', '60cf1509-156f-45f5-aca7-40e4f0b19ce8', '5be96dca-4531-4e02-a2d0-c676bcfc8e1e', 'Sunita Customer', '9123456780', 'cust_p5_1789831213242@hallkhoj.com', '2026-12-10', 'Evening', 400, 97350, 97350, 24338, 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('803dadf9-cd4a-44ab-ab49-c8703a34cadc', 'HKF-2026-560837', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', 'c05dfeee-7f14-48e4-ab37-17bbc67e426b', 'Rohan Verma', '9876120342', '9876120342@hallkhoj.phone', '2026-11-20', 'Evening', 350, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('30783227-dda8-40a4-aee6-5d90e1730ebc', 'HKF-2026-133802', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '29a0dabf-b6cb-44b9-a27b-e14bade7ab23', 'Rohan Verma', '9876666503', '9876666503@hallkhoj.phone', '2026-11-20', 'Evening', 350, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('9ecb6e24-1e2d-45bf-ab20-b4e047cd9bdf', 'HKF-2026-647370', 'c032ad3b-4b45-4e24-a6c7-b65e1763bbbe', '55161483-ca92-46ef-a537-ce19924016e7', 'd34f518d-519a-41e2-ad1f-b14cf13e75e8', 'Sunita Customer', '9123456780', 'cust_p5_1789831456827@hallkhoj.com', '2026-12-10', 'Evening', 400, 97350, 97350, 24338, 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('a357ed46-4f4b-40c7-a04e-c8c553096fc8', 'HKF-2026-801070', 'bb0abd9b-63a6-4308-a458-82fca5132c48', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Vikas Malhotra', '9876500000', 'vikas@malhotra.com', '2026-11-28', 'Evening', 300, 50000, 50000, 12500, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('beb7045a-f03d-4249-a3ae-8364beec70f3', 'HKF-2026-401383', 'bb0abd9b-63a6-4308-a458-82fca5132c48', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Vikas Malhotra', '9876500000', 'vikas@malhotra.com', '2026-11-28', 'Evening', 300, 50000, 50000, 12500, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('76bfe30e-8218-4e3e-ab6f-f8c8f653052a', 'HKF-2026-308822', 'bb0abd9b-63a6-4308-a458-82fca5132c48', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Vikas Malhotra', '9876500000', 'vikas@malhotra.com', '2026-11-28', 'Evening', 300, 50000, 50000, 12500, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('adf3c8a6-5c73-422d-ad09-dfb337fea255', 'HKF-2026-317424', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', 'f3b681f3-a1cf-4cab-a7c1-7c575f77a9d9', 'Rohan Verma', '9876895567', '9876895567@hallkhoj.phone', '2026-11-20', 'Evening', 350, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('4dfe4e43-6cde-4c3b-a244-ec75e9a1dee0', 'HKF-2026-996009', '66c8bcdc-06d2-477b-a253-c44d26c02ae8', '2227fb37-0d1b-4b1b-aee0-ef5447c76df6', '501655b4-0d95-4e27-a994-74acdf8ba56d', 'Sunita Customer', '9123456780', 'cust_p5_1789831793838@hallkhoj.com', '2026-12-10', 'Evening', 400, 97350, 97350, 24338, 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('469a5b83-14c5-40c5-afd3-f28d3c73a34f', 'HKF-2026-745957', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', 'b4d040ee-cb11-4ab0-aac8-e4de6b220b10', 'Rohan Verma', '9876195872', '9876195872@hallkhoj.phone', '2026-11-20', 'Evening', 350, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('e6feecf1-665c-454b-a6ad-e75976e28556', 'HKF-2026-651144', '97d7564f-7d52-47e7-ac38-535cc8b96243', '0f4bee81-abcb-403d-a828-cb4aa09cd06c', '9068b64d-1e81-4850-a82c-c00185d99fd8', 'Sunita Customer', '9123456780', 'cust_p5_1789832761322@hallkhoj.com', '2026-12-10', 'Evening', 400, 97350, 97350, 24338, 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('6c6bd4f6-22a7-4c73-aca5-b16fb6972c67', 'HKF-2026-572108', 'bb0abd9b-63a6-4308-a458-82fca5132c48', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Vikas Malhotra', '9876500000', 'vikas@malhotra.com', '2026-11-28', 'Evening', 300, 50000, 50000, 12500, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('68a602af-6ff8-4d62-ab92-36e326ab2ed1', 'HKF-2026-222829', 'e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', '1a6ed119-ec3b-4020-ac61-be489e916cfd', '4a98da76-a0d7-444f-a327-169c24b6815a', 'Rahul Customer', '9876543210', 'rahul_1789833130263@example.com', '2026-12-18', 'Evening', 600, 85550, 85550, 21388, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('134238d4-53c6-4117-a527-3f02276b22b9', 'HKF-2026-583540', 'e44bffca-c9dc-46f7-aeb1-2e8953c6daf4', '1a6ed119-ec3b-4020-ac61-be489e916cfd', '4a98da76-a0d7-444f-a327-169c24b6815a', 'Rahul Customer', '9876543210', 'rahul_1789833130263@example.com', '2026-11-23', 'Morning', 300, 59000, 59000, 14750, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('1aaa9db5-a12d-4ae5-af4d-fdbbec8cd077', 'HKF-2026-524200', 'ee45f82b-48a3-4e55-ac1a-c7ee598a13c7', '8fcd780c-50ef-4082-a24f-1cef86d625a0', '0d17a558-a17f-4e6c-a063-51e0e6ec3992', 'Aman Customer', '9876543210', 'aman_cust_1789833637874@example.com', '2026-12-15', 'Evening', 400, 67850, 67850, 16963, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('21ed0d17-964a-47bb-aacb-55134828289e', 'HKF-2026-870923', 'ab9995e9-7c77-4c1f-afa2-44f6509840ba', '2f7024ab-d34a-43fb-afb2-c1067ef15732', 'f99d9357-2aaf-49cd-a1a9-0e317c2b0249', 'Aman Customer', '9876543210', 'aman_cust_1789833735816@example.com', '2026-12-15', 'Evening', 400, 67850, 67850, 16963, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('67e21efa-6bc2-478d-a463-0634a33f03b3', 'HKF-2026-104164', '2b22467b-8c8f-42b0-afa3-b8a196b7d631', 'd5151dd0-423d-4d85-afdf-2521d39c3c75', '3572b92a-ee49-492d-acf1-1915b4cfe278', 'Kavita Verma', '9876543210', 'kavita_1789833810518@example.com', '2026-12-28', 'Evening', 500, 79650, 79650, 19913, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('c001cf49-3581-4484-a6a7-01d7e37d5341', 'HKF-2026-742153', '8ceaa8c7-d89c-41eb-afdf-8bb8d8bca6ed', 'eecb86f9-b2c8-432f-a810-55a4b6b39494', '2504848d-34aa-4000-ac54-4798e6571198', 'Kavita Verma', '9876543210', 'kavita_1789833856065@example.com', '2026-12-28', 'Evening', 500, 79650, 79650, 19913, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('70bf5619-30ee-4c50-a7fc-1cbf29555e93', 'HKF-2026-243280', '2b2c21cb-2da2-4551-ab44-16b0f15f8c3a', '9bedca0b-f020-4d42-a29d-1289a9a50841', '0d4d04c8-5f8d-4c5d-afc3-fdb122e4c904', 'Aman Customer', '9876543210', 'aman_cust_1789833866394@example.com', '2026-12-15', 'Evening', 400, 67850, 67850, 16963, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('4ce3db7c-bcc6-4b56-ab22-0059203f113f', 'HKF-2026-253130', '7d0ea8ed-d152-4f76-a2a9-7cf9e3eb86d4', '4ec3bc1b-ac62-4ccd-a975-7168690d2e12', 'bab8a00d-766b-43d3-a4d2-97021758ff3d', 'Aman Customer', '9876543210', 'aman_cust_1789834398796@example.com', '2026-12-15', 'Evening', 400, 67850, 67850, 16963, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('e51d3a6e-bf35-457b-acca-b4afb950302a', 'HKF-2026-753946', '051661ce-e4b8-434b-a43f-9d8ad9a4dee4', '8263da0b-e919-4d89-a1fb-87f34212522a', '8f217e6c-953d-4510-a829-f537255f6537', 'Kavita Verma', '9876543210', 'kavita_1789834408837@example.com', '2026-12-28', 'Evening', 500, 79650, 79650, 19913, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('445ee667-7dc6-48b4-aede-c5a3644d2b2a', 'HKF-2026-402836', '2c932278-1ba4-4965-aa5f-93b966273d84', 'de87dba2-d305-42a7-a669-789c65080f43', 'faeb10b8-6e49-49da-a08b-049ea0a0d6e6', 'Rahul Customer', '9876543210', 'rahul_1789834518810@example.com', '2026-12-11', 'Evening', 600, 85550, 85550, 21388, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('dc947f45-e35d-476e-ade7-e4fe09649719', 'HKF-2026-776537', '2c932278-1ba4-4965-aa5f-93b966273d84', 'de87dba2-d305-42a7-a669-789c65080f43', 'faeb10b8-6e49-49da-a08b-049ea0a0d6e6', 'Rahul Customer', '9876543210', 'rahul_1789834518810@example.com', '2026-11-21', 'Morning', 300, 59000, 59000, 14750, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('ef0aa18e-fde9-4a19-a888-dde2d72bcc67', 'HKF-2026-369378', 'bb0abd9b-63a6-4308-a458-82fca5132c48', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Vikas Malhotra', '9876500000', 'vikas@malhotra.com', '2026-11-28', 'Evening', 300, 50000, 50000, 12500, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('26ab40be-aa64-4a07-aa1f-35f8c7a087df', 'HKF-2026-159000', '71848242-13aa-4ad0-a563-dd179d5534a2', '46a122eb-6b3b-4120-a458-b95bff5d36f0', '73bb31e9-e672-4751-aea9-2c5982bca7db', 'Customer AI Test', '9876543211', 'cust_ai_5315@test.com', '2026-11-25', 'Evening', 400, 174050, 174050, 43513, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('c13f48ee-c20e-4d07-a865-b7ff635fd2a6', 'HKF-2026-656966', '30face69-d4de-4266-a247-5b90929ef361', 'cfc38b55-79e7-4b22-a1d0-3bb0c8aa3e55', '4221fd8b-65a9-434e-a0e3-69d3b497511c', 'Customer AI Test', '9876543211', 'cust_ai_8175@test.com', '2026-11-25', 'Evening', 400, 174050, 174050, 43513, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('897195b4-d668-4b76-a374-da08ff17aaea', 'HKF-2026-467807', 'bc69801c-ed60-4c4c-a510-623ff189ee01', '5234f26e-442d-4b84-a937-ef48c8f9c6db', '0623c499-0760-45d6-a4c8-03c1b6d1d80b', 'Customer AI Test', '9876543211', 'cust_ai_2966@test.com', '2026-11-25', 'Evening', 400, 174050, 174050, 43513, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('dbafed15-4cc7-4b0f-ad01-51dc3b7eff83', 'HKF-2026-685035', '22b319ce-f90e-4ba3-abae-6977598a7c69', '2288057a-58f4-4a6c-a213-2b9707f0a563', 'b29be842-7799-4dc1-abf5-d5dfd9ae608b', 'Customer AI Test', '9876543211', 'cust_ai_7127@test.com', '2026-11-25', 'Evening', 400, 174050, 174050, 43513, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('2a089b3b-42d6-46bf-aad3-907c968fcbac', 'HKF-2026-798774', '34a9c325-7b93-4e13-a68e-844512909d42', 'f0336370-0367-4f58-aac7-c405b4ef6c2f', 'b4675697-c8ba-4a93-a1ee-c05a9974f4cf', 'Rahul Customer', '9876543210', 'rahul_1789897407316@example.com', '2026-12-16', 'Evening', 600, 85550, 85550, 21388, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('5e036f62-e42b-4473-ad00-6b123d9abdd0', 'HKF-2026-382626', '34a9c325-7b93-4e13-a68e-844512909d42', 'f0336370-0367-4f58-aac7-c405b4ef6c2f', 'b4675697-c8ba-4a93-a1ee-c05a9974f4cf', 'Rahul Customer', '9876543210', 'rahul_1789897407316@example.com', '2026-11-21', 'Morning', 300, 59000, 59000, 14750, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('890fca66-897a-4443-a693-3ac743a1128c', 'HKF-2026-143656', '443907e9-3a76-483a-a5ff-92f3b55978e6', '0766276e-d9f0-4289-a12a-ba0c1182a784', '178c4dc8-d182-423b-a05f-85a7b1349046', 'Aman Customer', '9876543210', 'aman_cust_1789897417807@example.com', '2026-12-15', 'Evening', 400, 67850, 67850, 16963, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('cd06f31a-112a-4258-aab9-fc8c2884c955', 'HKF-2026-341209', 'a5a33d9d-9ffd-4865-a9e4-ef52ea8f6dd6', '970e7b39-44b6-4a8a-a5bc-0d14226b7d53', 'c4f097e1-6c38-49f9-a596-56b299ef2a0b', 'Kavita Verma', '9876543210', 'kavita_1789897425419@example.com', '2026-12-28', 'Evening', 500, 79650, 79650, 19913, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('e2ce907b-f6eb-487f-ac1d-eeb0258521c6', 'HKF-2026-585564', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e3e248b4-3db8-4cfa-afa2-69dbb649190e', 'Rohan Verma', '9876101963', '9876101963@hallkhoj.phone', '2026-11-20', 'Evening', 350, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('614061f4-c634-4702-ab50-976ef53407f5', 'HKF-2026-772124', 'd284b84b-feaa-4e4c-ada2-67d9a56afb4a', 'b3ec3805-51e2-4265-a099-187f09a34611', 'fdeab50c-249f-48fb-a3fa-7e28f463a377', 'Sunita Customer', '9123456780', 'cust_p5_1789898168036@hallkhoj.com', '2026-12-10', 'Evening', 400, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('6f5034ef-54a6-448d-a1b7-272a1c6e85e8', 'HKF-2026-750826', 'cd0cdb7f-60bb-4f1e-ae9a-f8aecdb5c8b8', '9d6d24c7-07df-42bf-aaf4-d3d29bc967af', '3f8fc8d9-2062-46ad-a122-fb377ba091b4', 'Sunita Customer', '9123456780', 'cust_p5_1789898187705@hallkhoj.com', '2026-12-10', 'Evening', 400, 97350, 97350, 24338, 'APPROVED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('728544da-4abc-4b9c-a9b5-feca65dfa9b7', 'HKF-2026-552482', 'bb0abd9b-63a6-4308-a458-82fca5132c48', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Vikas Malhotra', '9876500000', 'vikas@malhotra.com', '2026-11-28', 'Evening', 300, 50000, 50000, 12500, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('69328969-606e-4eef-ae91-b57385eee359', 'HKF-2026-110252', '10603187-5ed8-4043-a2a1-d1a5cb4d5e13', '7ed23ed6-158e-4d23-abe2-2c2e3e21d13c', '77cf7a20-5e26-4759-a865-fbd60f1ecc95', 'E2E Test Customer', '9876500001', 'e2e_cust_1789899546063@test.com', '2026-11-20', 'Full Day', 600, 209450, 209450, 52363, 'APPROVED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('973c8a00-e4a7-4838-a001-5a4339a29689', 'HKF-2026-581753', '25958f87-b31a-404e-a2a5-2a9a1c602ab7', '6d7e361e-b67f-416f-aebf-6421be48ecd1', 'fee1e73c-6197-44f2-afd9-1469c97776f5', 'E2E Test Customer', '9876500001', 'e2e_cust_1789899627529@test.com', '2026-11-20', 'Full Day', 600, 209450, 209450, 52363, 'APPROVED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('debc1949-1b7a-45fa-a5e6-6e8c9ef17b71', 'HKF-2026-403979', '9ed1f117-0a5a-471c-ad72-3bc6db8b56fb', '5f1dcff4-ba54-43c5-afbb-8d286cd0809e', 'e5d6505a-4486-4ae1-a035-806fde8df272', 'E2E Test Customer', '9876500001', 'e2e_cust_1789899647320@test.com', '2026-11-20', 'Full Day', 600, 209450, 209450, 52363, 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('52c1922b-1bd0-48a5-abfa-a88315d163b8', 'HKF-2026-616053', '4bba7e2b-15b3-4143-ac8c-264e05ae64d7', 'b43c3331-6363-4f4c-ace8-25760d559c6d', 'aa6f6339-af05-4619-aa98-b8e041bd3031', 'E2E Test Customer', '9876500001', 'e2e_cust_1789899691559@test.com', '2026-11-20', 'Full Day', 600, 209450, 209450, 52363, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('32737b85-4bd9-4fa9-a73f-dac834fb72ea', 'HKF-2026-476694', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '932e2efc-481e-4e5f-a8c3-03a329f3ff8a', 'Rohan Sharma', '9876543210', 'prod_cust_1789899757000@hallkhoj.in', '2026-11-28', 'Evening', 500, 97350, 97350, 24338, 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('3935d0db-ff56-4318-a695-97a86ff2e9aa', 'HKF-2026-468209', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '340f8960-7a9a-46db-ac1f-176ffc096200', 'Rohan Sharma', '9876543210', 'prod_cust_1789899841500@hallkhoj.in', '2026-11-15', 'Evening', 500, 97350, 97350, 24338, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('a7aa389e-cd47-446f-a8e0-da4aedc32013', 'HKF-2026-658008', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '91decefd-a3f6-4530-ae01-4fd865e83759', 'Rohan Sharma', '9876543210', 'prod_cust_1789899888088@hallkhoj.in', '2027-08-15', 'Evening', 500, 97350, 97350, 24338, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('3640d415-f0f9-4c10-adbf-5d42ae571a51', 'HKF-2026-336486', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '525adf26-9920-4d31-a110-1e3e22c77c68', 'Rohan Sharma', '9876543210', 'prod_cust_1789899964242@hallkhoj.in', '2027-06-29', 'Evening', 500, 97350, 97350, 24338, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('06f8eb3f-287c-4b52-a0b3-774d5758cfcf', 'HKF-2026-997720', 'd87b142c-b5d1-43ab-a0c7-e03c67728277', 'effdb8de-d0f5-44a9-a7e8-c4396b6140ce', '5076fddc-95e5-46d2-aa80-5d9812a7facc', 'E2E Test Customer', '9876500001', 'e2e_cust_1789899996399@test.com', '2026-11-20', 'Full Day', 600, 209450, 209450, 52363, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('6415a6c9-92da-4472-ab4f-49241452a5dd', 'HKF-2026-417134', 'e01aed5e-4ab0-44b8-a4ad-15a479c8265a', '75fbe0fa-f672-4b14-aa9b-48bbbc025091', 'b818068a-56b0-4916-ac80-f4d30c1c69aa', 'Customer AI Test', '9876543211', 'cust_ai_5712@test.com', '2026-11-25', 'Evening', 400, 174050, 174050, 43513, 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('050b961f-e45e-48ff-a99c-28b58e204879', 'HKF-2026-165162', '04f030c2-220b-444c-a90f-ec4d4c8740fe', 'abc2971d-0eaa-4333-a828-223706ce49b9', '2dbabdf2-bf71-40a6-a80c-53403959c850', 'Customer AI Test', '9876543211', 'cust_ai_6905@test.com', '2026-11-25', 'Evening', 400, 174050, 174050, 43513, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('8a5d21c1-99ce-4f24-a4c9-79aee0393cde', 'HKF-2026-237296', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', '4b7e8750-8375-4a15-a21b-2316de414d72', 'Rohan Sharma', '9876543210', 'prod_cust_1789900085893@hallkhoj.in', '2027-05-08', 'Evening', 500, 97350, 97350, 24338, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('acb6a808-4115-4bf8-a6f5-a724e091f812', 'HKF-2026-981415', '36926d03-62a2-413a-a6f0-98292965ea73', 'f843f1c9-cfed-4e6b-ae5e-7b5f03948461', '763a9fac-9163-41e3-a8a3-34cb21abe96c', 'Aman Customer', '9876543210', 'aman_cust_1789900091942@example.com', '2026-12-15', 'Evening', 400, 67850, 67850, 16963, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('cd2df492-2df0-43e4-af1f-0e189e64e262', 'HKF-2026-526330', 'e8e81d96-f599-49cf-abfd-7335504a9e45', '54f07d2a-2ea1-4364-aa61-b0b4811e034e', '77a5a7b4-a65f-4a32-a36f-b8ebf439e127', 'Kavita Verma', '9876543210', 'kavita_1789900100116@example.com', '2026-12-28', 'Evening', 500, 79650, 79650, 19913, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('2670380c-0352-4d1b-a0bd-4b246bbda97a', 'HKF-2026-348943', 'b7d510d1-f24d-4519-a11e-01868700be4d', 'fd0b5c66-7ed1-405b-adbd-c30bc9bc99d4', '74dd72b1-4a2a-45f3-aedc-5796b6d742fd', 'Rahul Customer', '9876543210', 'rahul_1789900115926@example.com', '2026-12-10', 'Evening', 600, 85550, 85550, 21388, 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('e523b5e1-350d-46d7-a57b-225c89d92fad', 'HKF-2026-694268', 'b7d510d1-f24d-4519-a11e-01868700be4d', 'fd0b5c66-7ed1-405b-adbd-c30bc9bc99d4', '74dd72b1-4a2a-45f3-aedc-5796b6d742fd', 'Rahul Customer', '9876543210', 'rahul_1789900115926@example.com', '2026-11-22', 'Morning', 300, 59000, 59000, 14750, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('a0c0e3e1-8877-4a4c-a4e9-4b82a6bbed5f', 'HKF-2026-992838', 'bb0abd9b-63a6-4308-a458-82fca5132c48', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Vikas Malhotra', '9876500000', 'vikas@malhotra.com', '2026-11-28', 'Evening', 300, 50000, 50000, 12500, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('04c81267-3d42-4a88-a5f8-c83abf76170f', 'HKF-2026-512053', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Ramesh Sharma', '6463524268', 'customer@example.com', '2027-03-14', 'Morning', 250, 73750, 73750, 18438, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('93a01311-c297-4516-ad7e-77cdd17ea496', 'HKF-2026-200654', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', 'a06633e7-aca5-498c-aea7-a690f88dd620', 'Manish Kumar', '6203025057', 'customer@example.com', '2026-11-04', 'Full Day', 351, 126850, 126850, 31713, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('6fa70eb4-50ec-4cf7-a321-9575a3af2791', 'HKF-2026-939681', '0bf0c964-7c20-473e-a7da-27f7b41ad3c9', 'a06633e7-aca5-498c-aea7-a690f88dd620', 'a06633e7-aca5-498c-aea7-a690f88dd620', 'Manish Kumar', '6203025057', 'customer@example.com', '2026-11-04', 'Evening', 350, 56050, 56050, 14013, 'CANCELLED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('a2506860-6159-4dd8-ab80-ca9422710229', 'HKF-2026-492109', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Manish Kumar', '6203025057', 'customer@example.com', '2026-11-13', 'Evening', 350, 97350, 97350, 24338, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('6f5ff6ec-a0a7-421f-a821-a84cdb84233b', 'HKF-2026-578235', 'aa6530bc-a18d-41ae-a7fc-bfec99c16114', 'f16b14e1-0b22-495b-ae06-2e06533e41b8', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Manish Kumar', '6203025057', 'customer@example.com', '2026-11-15', 'Morning', 250, 138650, 138650, 41595, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.bookings (id, booking_code, venue_id, owner_id, customer_id, customer_name, customer_mobile, customer_email, event_date, time_slot, guest_count, base_price, total_amount, advance_required, status)
VALUES ('fc463f31-090f-42be-a1e0-807bfebe059e', 'HKF-2026-221427', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '09cc413d-1921-45e6-a38d-9577d92f55de', 'e6891811-2bc4-45a0-a1d5-217df7472621', 'Manish Kumar', '6203025057', 'customer@example.com', '2026-12-06', 'Morning', 350, 73750, 73750, 18438, 'REQUESTED')
ON CONFLICT (id) DO NOTHING;

-- 6. TRANSACTIONS
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('bad0b5a1-10ff-422c-a402-e6a6eb26c735', '897195b4-d668-4b76-a374-da08ff17aaea', '0623c499-0760-45d6-a4c8-03c1b6d1d80b', '5234f26e-442d-4b84-a937-ef48c8f9c6db', 'order_hkf_1789896696738_06r8ol', 43513, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('ff5c7041-7f72-4ad1-a4ab-841a7b802cd9', '897195b4-d668-4b76-a374-da08ff17aaea', '0623c499-0760-45d6-a4c8-03c1b6d1d80b', '5234f26e-442d-4b84-a937-ef48c8f9c6db', 'tran_1789896696787_u8wk9o', 25000, 'ADVANCE_TOKEN', 'REFUNDED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('1962e193-4bd5-449e-a8d5-a630196565c1', 'dbafed15-4cc7-4b0f-ad01-51dc3b7eff83', 'b29be842-7799-4dc1-abf5-d5dfd9ae608b', '2288057a-58f4-4a6c-a213-2b9707f0a563', 'order_hkf_1789897398512_8dblfv', 43513, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('a643b040-9f34-4c6e-aae5-c36f75c4ae10', 'dbafed15-4cc7-4b0f-ad01-51dc3b7eff83', 'b29be842-7799-4dc1-abf5-d5dfd9ae608b', '2288057a-58f4-4a6c-a213-2b9707f0a563', 'tran_1789897398581_piopd6', 25000, 'ADVANCE_TOKEN', 'REFUNDED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('f3ddca22-30ce-4eb4-ad90-5b2ded188b19', '69328969-606e-4eef-ae91-b57385eee359', '77cf7a20-5e26-4759-a865-fbd60f1ecc95', '7ed23ed6-158e-4d23-abe2-2c2e3e21d13c', 'order_hkf_1789899546627_28v76o', 52363, 'ADVANCE_TOKEN', 'CREATED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('00e2155f-d02b-4577-ab5f-4e95f1fcc068', '973c8a00-e4a7-4838-a001-5a4339a29689', 'fee1e73c-6197-44f2-afd9-1469c97776f5', '6d7e361e-b67f-416f-aebf-6421be48ecd1', 'order_hkf_1789899629503_bcao9v', 52363, 'ADVANCE_TOKEN', 'CREATED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('505460e0-d89c-4286-ad8f-f181181b131e', 'debc1949-1b7a-45fa-a5e6-6e8c9ef17b71', 'e5d6505a-4486-4ae1-a035-806fde8df272', '5f1dcff4-ba54-43c5-afbb-8d286cd0809e', 'order_hkf_1789899648715_zw7ruw', 52363, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('a589fb27-d43f-40fb-a50d-9da12bdec091', '52c1922b-1bd0-48a5-abfa-a88315d163b8', 'aa6f6339-af05-4619-aa98-b8e041bd3031', 'b43c3331-6363-4f4c-ace8-25760d559c6d', 'order_hkf_1789899692356_4xmiom', 52363, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('73290f61-a6f8-4562-a6b2-e16839db4b80', '32737b85-4bd9-4fa9-a73f-dac834fb72ea', '932e2efc-481e-4e5f-a8c3-03a329f3ff8a', '09cc413d-1921-45e6-a38d-9577d92f55de', 'order_hkf_1789899762402_k3mx5z', 24338, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('aab943fc-dcdc-4833-a719-509e336af976', '3935d0db-ff56-4318-a695-97a86ff2e9aa', '340f8960-7a9a-46db-ac1f-176ffc096200', '09cc413d-1921-45e6-a38d-9577d92f55de', 'order_hkf_1789899842190_dv4vo6', 24338, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('946a2522-29d7-4d54-a6e7-527747e7deb2', 'a7aa389e-cd47-446f-a8e0-da4aedc32013', '91decefd-a3f6-4530-ae01-4fd865e83759', '09cc413d-1921-45e6-a38d-9577d92f55de', 'order_hkf_1789899889722_iuwke3', 24338, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('b1a719ce-544b-449d-ac51-1d0f1c66eaa6', '3640d415-f0f9-4c10-adbf-5d42ae571a51', '525adf26-9920-4d31-a110-1e3e22c77c68', '09cc413d-1921-45e6-a38d-9577d92f55de', 'order_hkf_1789899965108_z4xzoq', 24338, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('73633b08-b8a2-4ede-ab1d-9c068f20c516', '06f8eb3f-287c-4b52-a0b3-774d5758cfcf', '5076fddc-95e5-46d2-aa80-5d9812a7facc', 'effdb8de-d0f5-44a9-a7e8-c4396b6140ce', 'order_hkf_1789899996789_rkunvg', 52363, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('5f7fa22a-01c3-4e60-aad5-2601b5b07891', '6415a6c9-92da-4472-ab4f-49241452a5dd', 'b818068a-56b0-4916-ac80-f4d30c1c69aa', '75fbe0fa-f672-4b14-aa9b-48bbbc025091', 'order_hkf_1789900007755_fppx0a', 43513, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('89998ee9-f60f-4947-a0c7-939e1fc3c9e4', '050b961f-e45e-48ff-a99c-28b58e204879', '2dbabdf2-bf71-40a6-a80c-53403959c850', 'abc2971d-0eaa-4333-a828-223706ce49b9', 'order_hkf_1789900081026_0waa3p', 43513, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('4bf44877-415d-4cc1-a761-c33fbac5640f', '050b961f-e45e-48ff-a99c-28b58e204879', '2dbabdf2-bf71-40a6-a80c-53403959c850', 'abc2971d-0eaa-4333-a828-223706ce49b9', 'tran_1789900081074_6hxy6w', 25000, 'ADVANCE_TOKEN', 'REFUNDED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.transactions (id, booking_id, customer_id, owner_id, transaction_code, amount, type, status)
VALUES ('f3894b74-ead8-4408-a629-d8310acffc11', '8a5d21c1-99ce-4f24-a4c9-79aee0393cde', '4b7e8750-8375-4a15-a21b-2316de414d72', '09cc413d-1921-45e6-a38d-9577d92f55de', 'order_hkf_1789900086383_ky95i6', 24338, 'ADVANCE_TOKEN', 'SUCCESS')
ON CONFLICT (id) DO NOTHING;

-- 7. REVIEWS
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('69c133f2-c62a-4e91-aac4-226f1f847243', '2b22467b-8c8f-42b0-afa3-b8a196b7d631', '3572b92a-ee49-492d-acf1-1915b4cfe278', 'Kavita Verma Customer', 5, 'Magical Royal Wedding Experience!', 'Everything was pristine. The lawn was vast, AC was superb, and Manoj ji was very hospitable.', '{"text":"Dhanyawaad Kavita ji! It was our privilege hosting your family. Wishing the couple a lifetime of happiness!","repliedAt":"2026-09-19T16:03:31.773Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('b5f5fb47-e0b1-4f2a-a5df-9c01a228d721', '8ceaa8c7-d89c-41eb-afdf-8bb8d8bca6ed', '2504848d-34aa-4000-ac54-4798e6571198', 'Kavita Verma Customer', 5, 'Magical Royal Wedding Experience!', 'Everything was pristine. The lawn was vast, AC was superb, and Manoj ji was very hospitable.', '{"text":"Dhanyawaad Kavita ji! It was our privilege hosting your family. Wishing the couple a lifetime of happiness!","repliedAt":"2026-09-19T16:04:17.556Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('71838772-3ee0-42f4-a65d-6f0ed451bf9b', '051661ce-e4b8-434b-a43f-9d8ad9a4dee4', '8f217e6c-953d-4510-a829-f537255f6537', 'Kavita Verma Customer', 5, 'Magical Royal Wedding Experience!', 'Everything was pristine. The lawn was vast, AC was superb, and Manoj ji was very hospitable.', '{"text":"Dhanyawaad Kavita ji! It was our privilege hosting your family. Wishing the couple a lifetime of happiness!","repliedAt":"2026-09-19T16:13:29.800Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('288fdb22-cde2-4e9a-ae47-5531249401f3', 'a5a33d9d-9ffd-4865-a9e4-ef52ea8f6dd6', 'c4f097e1-6c38-49f9-a596-56b299ef2a0b', 'Kavita Verma Customer', 5, 'Magical Royal Wedding Experience!', 'Everything was pristine. The lawn was vast, AC was superb, and Manoj ji was very hospitable.', '{"text":"Dhanyawaad Kavita ji! It was our privilege hosting your family. Wishing the couple a lifetime of happiness!","repliedAt":"2026-09-20T09:43:46.372Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('e198ee32-5eab-41cb-a445-a7a2bdffe1c8', '4bba7e2b-15b3-4143-ac8c-264e05ae64d7', 'aa6f6339-af05-4619-aa98-b8e041bd3031', 'E2E Test Customer', 5, 'Flawless wedding experience!', 'The 3D walkthrough was completely accurate to the real palace. Five stars!', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('91bfb0e8-c08c-49ba-a8d6-93141e9069e6', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '340f8960-7a9a-46db-ac1f-176ffc096200', 'Rohan Sharma', 5, 'Spectacular Event!', 'The venue lighting, AC and arrangements were top notch.', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('335604ef-997a-45c6-a986-6e7d703f4a97', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '91decefd-a3f6-4530-ae01-4fd865e83759', 'Rohan Sharma', 5, 'Spectacular Event!', 'The venue lighting, AC and arrangements were top notch.', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('20984611-b2f1-4188-a891-023f7a7d934f', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '525adf26-9920-4d31-a110-1e3e22c77c68', 'Rohan Sharma', 5, 'Spectacular Event!', 'The venue lighting, AC and arrangements were top notch.', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('9e9c4414-d0e5-4d95-a2e2-86ba52a18bc8', 'd87b142c-b5d1-43ab-a0c7-e03c67728277', '5076fddc-95e5-46d2-aa80-5d9812a7facc', 'E2E Test Customer', 5, 'Flawless wedding experience!', 'The 3D walkthrough was completely accurate to the real palace. Five stars!', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('e3524486-6e29-436c-aaf5-c888ef9c4b31', '37262382-60d2-4ea8-a4e4-a2781f08ccc9', '4b7e8750-8375-4a15-a21b-2316de414d72', 'Rohan Sharma', 5, 'Spectacular Event!', 'The venue lighting, AC and arrangements were top notch.', '')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, venue_id, customer_id, customer_name, rating, title, comment, owner_reply)
VALUES ('e7c6f58d-9d0e-4ad2-abcb-ec83a974b9c7', 'e8e81d96-f599-49cf-abfd-7335504a9e45', '77a5a7b4-a65f-4a32-a36f-b8ebf439e127', 'Kavita Verma Customer', 5, 'Magical Royal Wedding Experience!', 'Everything was pristine. The lawn was vast, AC was superb, and Manoj ji was very hospitable.', '{"text":"Dhanyawaad Kavita ji! It was our privilege hosting your family. Wishing the couple a lifetime of happiness!","repliedAt":"2026-09-20T10:28:20.752Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

COMMIT;
