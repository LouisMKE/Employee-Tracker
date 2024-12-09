import inquirer from 'inquirer';
import db from './db/connection.js';
import consoleTable from 'console.table';

// Main menu function
const mainMenu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit',
            ],
        },
    ]);

    switch (action) {
        case 'View All Departments':
            viewAllDepartments();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'View All Employees':
            viewAllEmployees();
            break;
        case 'Add a Department':
            addDepartment();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update an Employee Role':
            updateEmployeeRole();
            break;
        default:
            db.end();
            console.log('Goodbye!');
    }
};

// View all departments
const viewAllDepartments = async () => {
    try {
        const result = await db.query('SELECT * FROM departments');
        console.table(result.rows);
        mainMenu();
    } catch (err) {
        console.error('Error fetching departments:', err);
    }
};

// View all roles
const viewAllRoles = async () => {
    try {
        const result = await db.query(`
            SELECT roles.id, roles.title, roles.salary, departments.name AS department
            FROM roles
            LEFT JOIN departments ON roles.department_id = departments.id
        `);
        console.table(result.rows);
        mainMenu();
    } catch (err) {
        console.error('Error fetching roles:', err);
    }
};

// View all employees
const viewAllEmployees = async () => {
    try {
        const result = await db.query(`
            SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role,
                   roles.salary, departments.name AS department,
                   CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employees
            LEFT JOIN roles ON employees.role_id = roles.id
            LEFT JOIN departments ON roles.department_id = departments.id
            LEFT JOIN employees AS manager ON employees.manager_id = manager.id
        `);
        console.table(result.rows);
        mainMenu();
    } catch (err) {
        console.error('Error fetching employees:', err);
    }
};

// Add a department
const addDepartment = async () => {
    const { name } = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter the department name:' },
    ]);
    try {
        await db.query('INSERT INTO departments (name) VALUES ($1)', [name]);
        console.log(`Department "${name}" added successfully!`);
        mainMenu();
    } catch (err) {
        console.error('Error adding department:', err);
    }
};

// Add a role
const addRole = async () => {
    const departments = await db.query('SELECT * FROM departments');
    const { title, salary, department_id } = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the role title:' },
        { type: 'input', name: 'salary', message: 'Enter the role salary:' },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select a department:',
            choices: departments.rows.map((d) => ({ name: d.name, value: d.id })),
        },
    ]);
    try {
        await db.query(
            'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
            [title, salary, department_id]
        );
        console.log(`Role "${title}" added successfully!`);
        mainMenu();
    } catch (err) {
        console.error('Error adding role:', err);
    }
};

// Add an employee
const addEmployee = async () => {
    const roles = await db.query('SELECT * FROM roles');
    const employees = await db.query('SELECT * FROM employees');
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: 'Enter the first name:' },
        { type: 'input', name: 'last_name', message: 'Enter the last name:' },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select a role:',
            choices: roles.rows.map((r) => ({ name: r.title, value: r.id })),
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select a manager:',
            choices: [{ name: 'None', value: null }].concat(
                employees.rows.map((e) => ({
                    name: `${e.first_name} ${e.last_name}`,
                    value: e.id,
                }))
            ),
        },
    ]);
    try {
        await db.query(
            'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
            [first_name, last_name, role_id, manager_id]
        );
        console.log(`Employee "${first_name} ${last_name}" added successfully!`);
        mainMenu();
    } catch (err) {
        console.error('Error adding employee:', err);
    }
};

// Update an employee role
const updateEmployeeRole = async () => {
    const employees = await db.query('SELECT * FROM employees');
    const roles = await db.query('SELECT * FROM roles');
    const { employee_id, role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select an employee to update:',
            choices: employees.rows.map((e) => ({
                name: `${e.first_name} ${e.last_name}`,
                value: e.id,
            })),
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role:',
            choices: roles.rows.map((r) => ({ name: r.title, value: r.id })),
        },
    ]);
    try {
        await db.query('UPDATE employees SET role_id = $1 WHERE id = $2', [
            role_id,
            employee_id,
        ]);
        console.log('Employee role updated successfully!');
        mainMenu();
    } catch (err) {
        console.error('Error updating employee role:', err);
    }
};

// Start the application
mainMenu();
