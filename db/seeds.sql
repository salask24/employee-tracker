-- DEPARTMENT
INSERT INTO department (name)
VALUES

('ENGINEERING'), --1
('HR'), -- 2
('ADMIN'), -- 3
('SALES'), -- 4
('CUSTOMER SERVICE'); -- 5

-- ROLE
INSERT INTO role (title, salary, department_id)
VALUES

('SOFTWARE ENGINEER', 120000, 1),
('HR LEAD', 70000, 2),
('FRONT DESK', 55000, 3),
('SALES', 80000, 4),
('TECH SUPPORT', 45000, 5),
('SALES MANAGER', 110000, 6),
('CTO', 200000, 7),
('CEO', 1000000, 8)
('ADMIN SUPERVISOR', 88000, 9)


-- EMPLOYEES
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES

('KIM', 'SALAS', 1, 5),
('LUCKY', 'SALAS', 8, NULL),
('NEO', 'POLITAN', 6, 2),
('RAMBO', 'PORTER', 4, 3),
('POOKAH', 'PONTIPIEDRA', 7, 2);