INSERT INTO content_items (id, category_type, title, image_url, meta_data) VALUES
('tt0468569', 'MOVIES', 'The Dark Knight', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', '{"year":2008,"genre":"Action","rating":9.0}'),
('tt1375666', 'MOVIES', 'Inception', 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', '{"year":2010,"genre":"Sci-Fi","rating":8.8}'),
('tt0137523', 'MOVIES', 'Fight Club', 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', '{"year":1999,"genre":"Drama","rating":8.8}'),
('tt0111161', 'MOVIES', 'The Shawshank Redemption', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', '{"year":1994,"genre":"Drama","rating":9.3}'),
('tt0109830', 'MOVIES', 'Forrest Gump', 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', '{"year":1994,"genre":"Drama","rating":8.8}'),
('rest_001', 'RESTAURANTS', 'The Italian Place', NULL, '{"cuisine":"Italian","price_range":"$$","rating":4.5}'),
('rest_002', 'RESTAURANTS', 'Sushi Central', NULL, '{"cuisine":"Japanese","price_range":"$$$","rating":4.7}'),
('rest_003', 'RESTAURANTS', 'Burger Joint', NULL, '{"cuisine":"American","price_range":"$","rating":4.2}'),
('rest_004', 'RESTAURANTS', 'Thai Garden', NULL, '{"cuisine":"Thai","price_range":"$$","rating":4.4}'),
('rest_005', 'RESTAURANTS', 'Mediterranean Mezze', NULL, '{"cuisine":"Mediterranean","price_range":"$$","rating":4.6}'),
('act_001', 'ACTIVITIES', 'Escape Room', NULL, '{"duration":"60-90 min","group_size":"2-8","price_range":"$$"}'),
('act_002', 'ACTIVITIES', 'Bowling Night', NULL, '{"duration":"2 hours","group_size":"2-10","price_range":"$"}'),
('act_003', 'ACTIVITIES', 'Laser Tag', NULL, '{"duration":"45 min","group_size":"2-20","price_range":"$"}'),
('act_004', 'ACTIVITIES', 'Board Game Cafe', NULL, '{"duration":"2-4 hours","group_size":"2-8","price_range":"$"}'),
('act_005', 'ACTIVITIES', 'Mini Golf', NULL, '{"duration":"1-2 hours","group_size":"2-8","price_range":"$"}')
ON CONFLICT (id) DO NOTHING;