CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    interests JSON,
    photo VARCHAR(255)
);

CREATE TABLE travels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    town VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    start_date VARCHAR(255) NOT NULL,
    end_date VARCHAR(255) NOT NULL,
    general_vote FLOAT,
    votes JSON,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    photo JSON,
    lat FLOAT,
    lng FLOAT,
    travel_id INT NOT NULL,
    FOREIGN KEY (travel_id) REFERENCES travels(id) ON DELETE CASCADE
);