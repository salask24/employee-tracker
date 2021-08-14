-- DEPARTMENT
INSERT INTO department (name)
VALUES

('ENGINEERING'), 
('HR'), 
('ADMIN'),
('SALES'),
('CUSTOMER SERVICE'),
('UPPER MANAGEMENT');

-- ROLE
INSERT INTO role (title, salary, department_id)
VALUES

('SOFTWARE ENGINEER', 120000, 1),
('HR LEAD', 70000, 2),
('FRONT DESK', 55000, 3),
('SALES', 80000, 4),
('TECH SUPPORT', 45000, 5),
('SALES MANAGER', 110000, 4),
('CTO', 200000, 6),
('CEO', 1000000, 6),
('ADMIN SUPERVISOR', 88000, 3),
('CFO', 990000, 6);


-- EMPLOYEES
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES

('LUCKY', 'SALAS', 8, NULL), 
('DOUG', 'DIMMADOME', 7, 1), 
('NEO', 'POLITAN-SALAS', 6, 1), 
('RAMBO', 'PORTER', 4, 3),
('KIM', 'SALAS', 1, 2),
('JAMSIN', 'DENA', 9, 3),
('COSMO', 'COSMA', 5,5),
('WANDA', 'FAIRYWINKLE-COSMA', 10, 1);