// Dependencies
require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

const db = require("./db/connection");

// functionality of application
function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "start",
        message: "Please select what you would like to do.",
        choices: ["View", "Add", "Update", "Exit"],
      },
    ])
    .then(function (res) {
      switch (res.start) {
        case "View":
          view();
          break;
        case "Add":
          add();
          break;
        case "Update":
          updateEmployee();
          break;
        case "Exit":
          console.log("-------------------------");
          console.log("Goodbye!");
          console.log("-------------------------");
          break;
        default:
          console.log("default");
      }
    });
}
start();
function view() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "view",
        message: "Please select what information you would like to access",
        choices: ["All employees", "By department", "By role"],
      },
    ])
    .then(function (res) {
      switch (res.view) {
        case "All employees":
          viewAllEmployees();
          break;
        case "By department":
          viewByDepartment();
          break;
        case "By role":
          viewByrole();
        default:
          console.log("default");
      }
    });
  function viewAllEmployees() {
    db.query(
      "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
      function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
      }
    );
  }

  function viewByDepartment() {
    db.query("SELECT  * FROM department", function (err, results) {
      if (err) throw err;
      console.table(results);
      start();
    });
  }
}
function viewByrole() {
  db.query("SELECT title FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function () {
            var choiceArr = [];
            for (i = 0; i < results.length; i++) {
              choiceArr.push(results[i].title);
            }
            return choiceArr;
          },
          message: "Select role",
        },
      ])
      .then(function (answer) {
        console.log(answer.choice);
        db.query(
          "SELECT e.id AS ID e.first_name AS FIRST, e.last_name AS Last, e.role_id AS Role, r.salary AS Salary, m.last_name AS Manager, d.name AS Department FROM employee e LEFT JOIN employee m ON e.manager_id LEFT JOIN role r ON e.role_id = r.title LEFT JOIN department d ON r.department_id = d.id WHERE e.role_id =?",
          [answer.choice],
          function (err, results) {
            if (err) throw err;
            console.table(results);
            start();
          }
        );
      });
  });
}
//  FUNCTION SET
function add() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "add",
        message: "what would you like to add?",
        choices: ["Department", "Employee role", "Employee"],
      },
    ])
    .then(function (res) {
      switch (res.add) {
        case "Department":
          addDepartment();
          break;
        case "Employee role":
          addEmployeeRole();
          break;
        default:
          console.log("default");
      }
    });
}
//add department
function addDepartment() {
  //prompt
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "what would you like the department name to be?",
      },
    ])
    .then(function (answer) {
      db.query(
        "INSERT INTO department(name) VALUES (?)",
        [answer.department],
        function (err) {
          if (err) throw err;
          console.log("-----------------------------");
          console.log("Department updated with" + answer.department);
          console.log("-----------------------------");
          start();
        }
      );
    });
}
//add employee role
function addEmployeeRole() {
  //prompt
  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "Enter role title",
      },
      {
        name: "salary",
        type: "number",
        message: "Enter salary",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
      {
        name: "department_id",
        type: "number",
        message: "Enter department_id",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (answer) {
      db.query(
        "INSERT INFO Role SET ?",
        {
          title: answer.role,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        function (err) {
          console.log("-----------------------------");
          console.log("Employee Roles updated with" + answer.role);
          console.log("-----------------------------");
          start();
        }
      );
    });
  //add employee
  function addEmployee() {
    db.query("SELECT * FROM role", function (err, results) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter employee first name",
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter employee last name",
          },
          {
            name: "role",
            type: "rawlist",
            choices: function () {
              var choiceArr = [];
              for (i = 0; i < results.length; i++) {
                choiceArr.push(results.title);
              }
              return choiceArr;
            },
            message: "Select title",
          },
          {
            name: "manager",
            type: "number",
            validate: function (value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            },
            message: "Enter manager ID",
            default: "1",
          },
        ])
        .then(function (answer) {
          db.query("INSERT INFO employee SET?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role,
            manager_id: answer.manager,
          });
          console.log("---------------------------------"),
            console.log("Employee Added Successfully"),
            console.log("---------------------------------");
          start();
        });
    });
  }
}
//update employee
function updateEmployee() {
  db.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choices",
          type: "rawlist",
          choices: function () {
            let choiceArr = [];
            for (i = 0; i < results.length; i++) {
              choiceArr.push(results[i].last_name);
            }
            return choiceArr;
          },
          message: "Select employee to update",
        },
      ])
      .then(function (answer) {
        const SaveName = answer.choice;

        db.query("SELECT * FROM role", function (err, results) {
          if (err) throw err;

          inquirer
            .prompt([
              {
                name: "role",
                type: "rawlist",
                choices: function () {
                  var choiceArr = [];
                  for (i = 0; i < results.length; i++) {
                    choiceArr.push(results[i].title);
                  }
                  return choiceArr;
                },
                message: "Select title",
              },
              {
                name: "manager",
                type: "number",
                validate: function (value) {
                  if (isNaN(value) === false) {
                    return true;
                  }
                  return false;
                },
                message: "Enter new manager ID",
                default: "1",
              },
            ])
            .then(function (answer) {
              console.log(answer);
              console.log(answer);
              db.query("UPDATE employee SET ? WHERE last_name = ?", [
                {
                  role_id: answer.role,
                  manager_id: answer.manager,
                },
                SaveName,
              ]),
                console.log("-------------------------------");
              console.log("Employee updated");
              console.log("-------------------------------");
              start();
            });
        });
      });
  });
}