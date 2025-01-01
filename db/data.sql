-- Insert dummy data into `group` table
INSERT INTO `group` (id, name, avatar) VALUES
(UUID(), 'Dog Lovers', 'https://example.com/dog-lovers-avatar.jpg'),
(UUID(), 'Cat Enthusiasts', 'https://example.com/cat-enthusiasts-avatar.jpg'),
(UUID(), 'Exotic Pets', 'https://example.com/exotic-pets-avatar.jpg');

-- Insert dummy data into `user` table
INSERT INTO `user` (id, first_name, last_name, email, password, avatar, status, userType) VALUES
(UUID(), 'John', 'Doe', 'john@example.com', 'hashed_password_1', 'https://example.com/john-avatar.jpg', 1, 'regular'),
(UUID(), 'Jane', 'Smith', 'jane@example.com', 'hashed_password_2', 'https://example.com/jane-avatar.jpg', 1, 'regular'),
(UUID(), 'Admin', 'User', 'admin@example.com', 'hashed_password_3', 'https://example.com/admin-avatar.jpg', 1, 'admin');

-- Insert dummy data into `pet` table
INSERT INTO `pet` (id, avatar, name, species, sex, breed, date_of_birth, description, owner_id) VALUES
(UUID(), 'https://example.com/max-avatar.jpg', 'Max', 'Dog', 'Male', 'Golden Retriever', '2020-01-15', 'Friendly and energetic', (SELECT id FROM `user` WHERE email = 'john@example.com')),
(UUID(), 'https://example.com/whiskers-avatar.jpg', 'Whiskers', 'Cat', 'Female', 'Siamese', '2019-05-20', 'Loves to cuddle', (SELECT id FROM `user` WHERE email = 'jane@example.com'));

-- Insert dummy data into `post` table
INSERT INTO `post` (id, title, description, user_id) VALUES
(UUID(), 'My Dog''s First Birthday', 'Celebrating Max''s first year with us!', (SELECT id FROM `user` WHERE email = 'john@example.com')),
(UUID(), 'Cat Toys Review', 'Sharing my experience with different cat toys', (SELECT id FROM `user` WHERE email = 'jane@example.com'));

-- Insert dummy data into `comment` table
INSERT INTO `comment` (id, comment, post_id, user_id) VALUES
(UUID(), 'Happy birthday, Max!', (SELECT id FROM `post` WHERE title = 'My Dog''s First Birthday'), (SELECT id FROM `user` WHERE email = 'jane@example.com')),
(UUID(), 'Great review! My cat loves the laser pointer.', (SELECT id FROM `post` WHERE title = 'Cat Toys Review'), (SELECT id FROM `user` WHERE email = 'john@example.com'));

-- Insert dummy data into `tag` table
INSERT INTO `tag` (id, name) VALUES
(UUID(), 'DogBirthday'),
(UUID(), 'CatToys'),
(UUID(), 'PetCare');

-- Insert dummy data into `relationship` table
INSERT INTO `relationship` (id, isFriend, isBlocked, status, isFollowing, userId, friendId) VALUES
(UUID(), 1, 0, 'confirmed', 1, (SELECT id FROM `user` WHERE email = 'john@example.com'), (SELECT id FROM `user` WHERE email = 'jane@example.com'));

-- Insert dummy data into `message` table
INSERT INTO `message` (id, content, sender_id, receiver_id) VALUES
(UUID(), 'Hey Jane, how''s Whiskers doing?', (SELECT id FROM `user` WHERE email = 'john@example.com'), (SELECT id FROM `user` WHERE email = 'jane@example.com'));

-- Insert dummy data into `media` table
INSERT INTO `media` (id, link, type) VALUES
(UUID(), 'https://example.com/max-birthday-photo.jpg', 'image'),
(UUID(), 'https://example.com/cat-toys-video.mp4', 'video');

-- Link media to posts
UPDATE `post` SET media_id = (SELECT id FROM `media` WHERE link = 'https://example.com/max-birthday-photo.jpg') WHERE title = 'My Dog''s First Birthday';
UPDATE `post` SET media_id = (SELECT id FROM `media` WHERE link = 'https://example.com/cat-toys-video.mp4') WHERE title = 'Cat Toys Review';

-- Insert dummy data into `post_tags` table
INSERT INTO `post_tags` (tag_id, post_id) VALUES
((SELECT id FROM `tag` WHERE name = 'DogBirthday'), (SELECT id FROM `post` WHERE title = 'My Dog''s First Birthday')),
((SELECT id FROM `tag` WHERE name = 'CatToys'), (SELECT id FROM `post` WHERE title = 'Cat Toys Review')),
((SELECT id FROM `tag` WHERE name = 'PetCare'), (SELECT id FROM `post` WHERE title = 'My Dog''s First Birthday')),
((SELECT id FROM `tag` WHERE name = 'PetCare'), (SELECT id FROM `post` WHERE title = 'Cat Toys Review'));

-- Insert dummy data into `user_groups` table
INSERT INTO `user_groups` (group_id, user_id) VALUES
((SELECT id FROM `group` WHERE name = 'Dog Lovers'), (SELECT id FROM `user` WHERE email = 'john@example.com')),
((SELECT id FROM `group` WHERE name = 'Cat Enthusiasts'), (SELECT id FROM `user` WHERE email = 'jane@example.com'));

-- Insert dummy data into `post_likes` table
INSERT INTO `post_likes` (user_id, post_id) VALUES
((SELECT id FROM `user` WHERE email = 'jane@example.com'), (SELECT id FROM `post` WHERE title = 'My Dog''s First Birthday')),
((SELECT id FROM `user` WHERE email = 'john@example.com'), (SELECT id FROM `post` WHERE title = 'Cat Toys Review'));

-- Insert more dummy data into `group` table
INSERT INTO `group` (id, name, avatar) VALUES
(UUID(), 'Bird Watchers', 'https://example.com/bird-watchers-avatar.jpg'),
(UUID(), 'Reptile Lovers', 'https://example.com/reptile-lovers-avatar.jpg'),
(UUID(), 'Aquarium Enthusiasts', 'https://example.com/aquarium-enthusiasts-avatar.jpg'),
(UUID(), 'Rabbit Owners', 'https://example.com/rabbit-owners-avatar.jpg'),
(UUID(), 'Horse Riding Club', 'https://example.com/horse-riding-club-avatar.jpg');

-- Insert more dummy data into `user` table
INSERT INTO `user` (id, first_name, last_name, email, password, avatar, status, userType) VALUES
(UUID(), 'Alice', 'Johnson', 'alice@example.com', 'hashed_password_4', 'https://example.com/alice-avatar.jpg', 1, 'regular'),
(UUID(), 'Bob', 'Williams', 'bob@example.com', 'hashed_password_5', 'https://example.com/bob-avatar.jpg', 1, 'regular'),
(UUID(), 'Carol', 'Brown', 'carol@example.com', 'hashed_password_6', 'https://example.com/carol-avatar.jpg', 1, 'regular'),
(UUID(), 'David', 'Jones', 'david@example.com', 'hashed_password_7', 'https://example.com/david-avatar.jpg', 1, 'regular'),
(UUID(), 'Eva', 'Davis', 'eva@example.com', 'hashed_password_8', 'https://example.com/eva-avatar.jpg', 1, 'regular');

-- Insert more dummy data into `pet` table
INSERT INTO `pet` (id, avatar, name, species, sex, breed, date_of_birth, description, owner_id) VALUES
(UUID(), 'https://example.com/buddy-avatar.jpg', 'Buddy', 'Dog', 'Male', 'Labrador', '2019-03-10', 'Loves to play fetch', (SELECT id FROM `user` WHERE email = 'alice@example.com')),
(UUID(), 'https://example.com/luna-avatar.jpg', 'Luna', 'Cat', 'Female', 'Persian', '2020-07-22', 'Enjoys sunbathing', (SELECT id FROM `user` WHERE email = 'bob@example.com')),
(UUID(), 'https://example.com/polly-avatar.jpg', 'Polly', 'Parrot', 'Female', 'African Grey', '2018-11-05', 'Talkative and intelligent', (SELECT id FROM `user` WHERE email = 'carol@example.com')),
(UUID(), 'https://example.com/rex-avatar.jpg', 'Rex', 'Iguana', 'Male', 'Green Iguana', '2021-01-30', 'Loves basking under the heat lamp', (SELECT id FROM `user` WHERE email = 'david@example.com')),
(UUID(), 'https://example.com/nemo-avatar.jpg', 'Nemo', 'Fish', 'Male', 'Clownfish', '2022-04-15', 'Brightens up the aquarium', (SELECT id FROM `user` WHERE email = 'eva@example.com'));

-- Insert more dummy data into `post` table
INSERT INTO `post` (id, title, description, user_id) VALUES
(UUID(), 'Buddy''s Park Adventure', 'A fun day out with Buddy at the local dog park', (SELECT id FROM `user` WHERE email = 'alice@example.com')),
(UUID(), 'Luna''s New Toy', 'Luna can''t get enough of her new catnip mouse', (SELECT id FROM `user` WHERE email = 'bob@example.com')),
(UUID(), 'Polly''s First Words', 'You won''t believe what Polly said today!', (SELECT id FROM `user` WHERE email = 'carol@example.com')),
(UUID(), 'Rex''s Terrarium Upgrade', 'Check out Rex''s newly renovated home', (SELECT id FROM `user` WHERE email = 'david@example.com')),
(UUID(), 'Nemo and Friends', 'Added some new fish to keep Nemo company', (SELECT id FROM `user` WHERE email = 'eva@example.com'));

-- Insert more dummy data into `comment` table
INSERT INTO `comment` (id, comment, post_id, user_id) VALUES
(UUID(), 'Buddy looks so happy!', (SELECT id FROM `post` WHERE title = 'Buddy''s Park Adventure'), (SELECT id FROM `user` WHERE email = 'bob@example.com')),
(UUID(), 'What a cute toy! Where did you get it?', (SELECT id FROM `post` WHERE title = 'Luna''s New Toy'), (SELECT id FROM `user` WHERE email = 'alice@example.com')),
(UUID(), 'That''s amazing! Polly is so smart.', (SELECT id FROM `post` WHERE title = 'Polly''s First Words'), (SELECT id FROM `user` WHERE email = 'david@example.com')),
(UUID(), 'The new terrarium looks fantastic!', (SELECT id FROM `post` WHERE title = 'Rex''s Terrarium Upgrade'), (SELECT id FROM `user` WHERE email = 'carol@example.com')),
(UUID(), 'Your aquarium is beautiful! What species did you add?', (SELECT id FROM `post` WHERE title = 'Nemo and Friends'), (SELECT id FROM `user` WHERE email = 'alice@example.com'));

-- Insert more dummy data into `tag` table
INSERT INTO `tag` (id, name) VALUES
(UUID(), 'DogPark'),
(UUID(), 'CatToy'),
(UUID(), 'ParrotTalk'),
(UUID(), 'ReptileCare'),
(UUID(), 'AquariumLife');

-- Insert more dummy data into `relationship` table
INSERT INTO `relationship` (id, isFriend, isBlocked, status, isFollowing, userId, friendId) VALUES
(UUID(), 1, 0, 'confirmed', 1, (SELECT id FROM `user` WHERE email = 'alice@example.com'), (SELECT id FROM `user` WHERE email = 'bob@example.com')),
(UUID(), 1, 0, 'confirmed', 1, (SELECT id FROM `user` WHERE email = 'carol@example.com'), (SELECT id FROM `user` WHERE email = 'david@example.com')),
(UUID(), 0, 0, 'pending', 1, (SELECT id FROM `user` WHERE email = 'eva@example.com'), (SELECT id FROM `user` WHERE email = 'alice@example.com'));

-- Insert more dummy data into `message` table
INSERT INTO `message` (id, content, sender_id, receiver_id) VALUES
(UUID(), 'Hi Bob, want to meet at the dog park this weekend?', (SELECT id FROM `user` WHERE email = 'alice@example.com'), (SELECT id FROM `user` WHERE email = 'bob@example.com')),
(UUID(), 'Carol, do you have any tips for iguana care?', (SELECT id FROM `user` WHERE email = 'david@example.com'), (SELECT id FROM `user` WHERE email = 'carol@example.com'));

-- Insert more dummy data into `media` table
INSERT INTO `media` (id, link, type) VALUES
(UUID(), 'https://example.com/buddy-at-park.jpg', 'image'),
(UUID(), 'https://example.com/luna-playing.mp4', 'video'),
(UUID(), 'https://example.com/polly-talking.mp3', 'video'),
(UUID(), 'https://example.com/rex-new-home.jpg', 'image'),
(UUID(), 'https://example.com/nemo-aquarium.jpg', 'image');

-- Link media to posts
UPDATE `post` SET media_id = (SELECT id FROM `media` WHERE link = 'https://example.com/buddy-at-park.jpg') WHERE title = 'Buddy''s Park Adventure';
UPDATE `post` SET media_id = (SELECT id FROM `media` WHERE link = 'https://example.com/luna-playing.mp4') WHERE title = 'Luna''s New Toy';
UPDATE `post` SET media_id = (SELECT id FROM `media` WHERE link = 'https://example.com/polly-talking.mp3') WHERE title = 'Polly''s First Words';
UPDATE `post` SET media_id = (SELECT id FROM `media` WHERE link = 'https://example.com/rex-new-home.jpg') WHERE title = 'Rex''s Terrarium Upgrade';
UPDATE `post` SET media_id = (SELECT id FROM `media` WHERE link = 'https://example.com/nemo-aquarium.jpg') WHERE title = 'Nemo and Friends';

-- Insert more dummy data into `post_tags` table
INSERT INTO `post_tags` (tag_id, post_id) VALUES
((SELECT id FROM `tag` WHERE name = 'DogPark'), (SELECT id FROM `post` WHERE title = 'Buddy''s Park Adventure')),
((SELECT id FROM `tag` WHERE name = 'CatToy'), (SELECT id FROM `post` WHERE title = 'Luna''s New Toy')),
((SELECT id FROM `tag` WHERE name = 'ParrotTalk'), (SELECT id FROM `post` WHERE title = 'Polly''s First Words')),
((SELECT id FROM `tag` WHERE name = 'ReptileCare'), (SELECT id FROM `post` WHERE title = 'Rex''s Terrarium Upgrade')),
((SELECT id FROM `tag` WHERE name = 'AquariumLife'), (SELECT id FROM `post` WHERE title = 'Nemo and Friends'));

-- Insert more dummy data into `user_groups` table
INSERT INTO `user_groups` (group_id, user_id) VALUES
((SELECT id FROM `group` WHERE name = 'Bird Watchers'), (SELECT id FROM `user` WHERE email = 'carol@example.com')),
((SELECT id FROM `group` WHERE name = 'Reptile Lovers'), (SELECT id FROM `user` WHERE email = 'david@example.com')),
((SELECT id FROM `group` WHERE name = 'Aquarium Enthusiasts'), (SELECT id FROM `user` WHERE email = 'eva@example.com'));

-- Insert more dummy data into `post_likes` table
INSERT INTO `post_likes` (user_id, post_id) VALUES
((SELECT id FROM `user` WHERE email = 'bob@example.com'), (SELECT id FROM `post` WHERE title = 'Buddy''s Park Adventure')),
((SELECT id FROM `user` WHERE email = 'alice@example.com'), (SELECT id FROM `post` WHERE title = 'Luna''s New Toy')),
((SELECT id FROM `user` WHERE email = 'david@example.com'), (SELECT id FROM `post` WHERE title = 'Polly''s First Words')),
((SELECT id FROM `user` WHERE email = 'carol@example.com'), (SELECT id FROM `post` WHERE title = 'Rex''s Terrarium Upgrade')),
((SELECT id FROM `user` WHERE email = 'alice@example.com'), (SELECT id FROM `post` WHERE title = 'Nemo and Friends'));