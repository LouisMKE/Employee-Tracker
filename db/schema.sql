-- Create the Departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,  -- Auto-incremented unique ID for each department
    name VARCHAR(50) NOT NULL -- Name of the department
);

-- Create the Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,  -- Auto-incremented unique ID for each role
    title VARCHAR(50) NOT NULL, -- Title of the role
    salary DECIMAL(10, 2) NOT NULL, -- Salary for the role
    department_id INTEGER REFERENCES departments(id) -- Foreign key linking to departments table
);

-- Create the Employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,  -- Auto-incremented unique ID for each employee
    first_name VARCHAR(50) NOT NULL, -- First name of the employee
    last_name VARCHAR(50) NOT NULL, -- Last name of the employee
    role_id INTEGER REFERENCES roles(id), -- Foreign key linking to roles table
    manager_id INTEGER REFERENCES employees(id) -- Self-referencing foreign key for manager
);
