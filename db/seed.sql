-- Insert into Departments
INSERT INTO departments (name) VALUES ('Engineering'), ('HR'), ('Finance');

-- Insert into Roles
INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 100000, 1),
('HR Manager', 75000, 2),
('Accountant', 60000, 3);

-- Insert into Employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),  -- No manager
('Jane', 'Smith', 2, NULL), -- No manager
('Jim', 'Brown', 3, 1);    -- Reports to John Doe
