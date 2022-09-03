SELECT
      e.id AS ID,
      e.first_name AS first,
      e.last_name AS Last,
      e.role_id AS Role,
      r.salary AS Salary,
      m.last_name AS Manager,
      d.name AS Department

  ---JOIN employee to its self
      FROM employee employee
      LEFT JOIN employee manager 
        ON e.manager_id = m.id
    ----JOIN role to employee table
    LEFT JOIN role r 
      ON e.role_id = r.title
      ----JOIN department to role table 
      LEFT JOIN department d
        ON r.department_id = d.id