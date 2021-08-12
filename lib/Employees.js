const inquirer = require('inquirer');
const cTable = require('console.table');
const Employee = require('../models/Employee');
const Role = require('../models/Role');
const Department = require('../models/Department');

class Employees {

    static getPrompts(type, db) {
        const prompts = {
            view: [
                {
                    type: 'list',
                    name: 'filter',
                    message: 'Which employees do you want to see?',
                    loop: false,
                    choices: ['All', 'By department', 'By manager']
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Which manager's employees do you want to see?",
                    loop: false,
                    choices: answers => {
                        const employee = new Employee(db);
                        return employee.fetchManagers().then(managers => {
                            const managersArray = managers.map(m => { return { name: m.first_name + ' ' + m.last_name, value: m.id } });
                            managersArray.push({ name: '<no manager>', id: 0 });
                            return managersArray;
                        });
                    },
                    when: ({ filter }) => {
                        return filter === 'By manager';
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: "Which department's employees do you want to see?",
                    loop: false,
                    choices: answers => {
                        const department = new Department(db);
                        return department.fetchAll().then(departments => {
                            return departments.map(d => { return { name: d.name, value: d.id } });
                        });
                    },
                    when: ({ filter }) => {
                        return filter === 'By department';
                    }
                }
            ],

            add: [
                {
                    type: 'input',
                    name: 'firstName',
                    message: "What is the new employee's first name? (leave blank to cancel)",
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the employee's last name?",
                    validate: lastNameInput => {
                        if (lastNameInput.trim() === '') {
                            console.log("Please enter a last name.");
                            return false;
                        }
                        return true;
                    },
                    when: ({ firstName }) => {
                        return firstName.trim() !== '';
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's title?",
                    choices: answers => {
                        const role = new Role(db);
                        return role.fetchAll().then(roles => {
                            return roles.map(r => { return { name: r.title, value: r.id } });
                        });
                    },
                    loop: false,
                    when: ({ firstName }) => {
                        return firstName.trim() !== '';
                    }
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who does this employee report to?',
                    choices: answers => {
                        const employee = new Employee(db);
                        return employee.fetchAll().then(managers => {
                            const managersArray = managers.map(m => { return { name: m.first_name + ' ' + m.last_name, value: m.id } });
                            managersArray.push({ name: '__SKIP__', id: 0 });
                            return managersArray;
                        });
                    },
                    loop: false,
                    default: 0,
                    when: ({ firstName }) => {
                        return firstName.trim() !== '';
                    }
                }
            ],

            update: [
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee would you like to update?",
                    loop: false,
                    choices: answers => {
                        const employee = new Employee(db);
                        return employee.fetchAll().then(employees => {
                            let choices = employees.map(e => { return { name: e.first_name + ' ' + e.last_name, value: e.id } });
                            choices.push({ name: '__CANCEL__', value: 0 });
                            return choices;
                        });
                    },
                    when: ({ employee }) => {
                        return employee !== 0;
                    }
                },
                {
                    type: 'confirm',
                    name: 'roleConfirm',
                    message: "Update the employee's role?",
                    default: true,
                    when: ({ employee }) => {
                        return employee !== 0;
                    }
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Select the employee's new role:",
                    loop: false,
                    choices: answers => {
                        const role = new Role(db);
                        return role.fetchAll().then(roles => {
                            return roles.map(r => { return { name: r.title, value: r.id } });
                        });
                    },
                    when: ({ employee, roleConfirm }) => {
                        return employee !== 0 && roleConfirm;
                    }
                },
                {
                    type: 'confirm',
                    name: 'managerConfirm',
                    message: "Update the employee's manager?",
                    default: true,
                    when: ({ employee }) => {
                        return employee !== 0;
                    }
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Select the employee's new manager:",
                    loop: false,
                    choices: answers => {
                        const employee = new Employee(db);
                        return employee.fetchAll().then(managers => {
                            const managersArray = managers.map(m => { return { name: m.first_name + ' ' + m.last_name, value: m.id } });
                            managersArray.push({ name: '<none>', id: 0 });
                            return managersArray;
                        });
                    },
                    when: ({ employee, managerConfirm }) => {
                        return employee !== 0 && managerConfirm;
                    },
                    default: 0
                }
            ],

            delete: [
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee do you want to delete?",
                    loop: false,
                    choices: answers => {
                        const employee = new Employee(db);
                        return employee.fetchAll().then(employees => {
                            const employeesArray = employees.map(e => { return { name: e.first_name + ' ' + e.last_name, value: e.id } });
                            employeesArray.push({ name: '__CANCEL__', value: 0 });
                            return employeesArray;
                        });
                    },
                    default: 0
                },
                {
                    type: 'confirm',
                    name: 'confirmDelete',
                    message: 'Are you sure?',
                    default: false,
                    when: ({ employee }) => {
                        return employee !== 0;
                    }
                }
            ]
        };
        return prompts[type];
    };

    static viewEmployees = function (db) {
        const employee = new Employee(db);
        return inquirer.prompt(Employees.getPrompts('view', db))
            .then(employeeData => {
                return employee.fetch(employeeData)
                    .then(employees => {
                        let tableTitle = '*** EMPLOYEES ***';
                        switch (employeeData.filter) {
                            case 'By manager':
                                if (employees[0].manager) {
                                    tableTitle = '***  ' + employees[0].manager + "'s Employees  ***";
                                } else {
                                    tableTitle = '***  Employees With No Manager  ***';
                                }
                                break;
                            case 'By department':
                                tableTitle = '***  ' + employees[0].department + " Employees  ***";
                                break;
                        }
                        console.log('\n' + cTable.getTable(tableTitle, employees));
                    });
            });
    };

    static addEmployee = function (db) {
        const employee = new Employee(db);
        return inquirer.prompt(Employees.getPrompts('add', db))
            .then(employeeData => {
                if (employeeData.firstName !== '') {
                    return employee.add({ first_name: employeeData.firstName, last_name: employeeData.lastName, role_id: employeeData.role, manager_id: employeeData.manager })
                        .then(({ message }) => {
                            console.log(`\n${message}`)
                        });
                }
            });
    };

    static updateEmployee = function (db) {
        const employee = new Employee(db);
        return inquirer.prompt(Employees.getPrompts('update', db))
            .then(employeeData => {
                if (employeeData.employee !== 0) {
                    let payload = { id: employeeData.employee };
                    if (employeeData.roleConfirm) {
                        payload.role_id = employeeData.role;
                    }
                    if (employeeData.managerConfirm) {
                        payload.manager_id = employeeData.manager;
                    }
                    return employee.update(payload)
                        .then(({ message }) => {
                            console.log(`\n${message}`)
                        });
                }
            });
    };

    static deleteEmployee = function (db) {
        const employee = new Employee(db);
        return inquirer.prompt(Employees.getPrompts('delete', db))
            .then(employeeData => {
                if (employeeData.employee !== 0 && employeeData.confirmDelete) {
                    return employee.delete(employeeData.employee)
                        .then(({ message }) => {
                            console.log(`\n${message}`)
                        });
                }
            });
    };
};

module.exports = Employees;