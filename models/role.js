class Role {
    db;

    constructor(db) {
        this.db = db;
    }
//The method fetches all (or all remaining) rows of a query result set and returns a list of tuples. If no more rows are available, it returns an empty list
    fetchAll() {
        const sql = 'SELECT r.id, r.title, r.salary, d.name AS department FROM role r LEFT JOIN department d ON d.id = r.department_id';
        return this.db.query(sql)
            .then(([rows, junk]) => {
                return rows;
            });
    }
// ADDING ROLE
    add(roleData) {
        const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        const params = [roleData.title, roleData.salary, roleData.department];
        return this.db.query(sql, params)
            .then(([result, junk]) => {
                if (result.affectedRows) {
                    return { status: 'success', message: `Added ${roleData.title} role.` }
                } else {
                    return { status: 'error', message: `Unable to add ${roleData.title} role.` }
                }
                return result;
            })
            .catch(err => {
                return { status: 'error', message: `Unable to add ${roleData.title} role. [ ${err} ]` }
            });
    }


//DELETE BY ID -- BONUS +10 :)
    delete(id) {
        return this.db.query('DELETE FROM role WHERE id = ?', [id])
            .then(([result, junk]) => {
                if (result.affectedRows) {
                    return { status: 'success', message: `Deleted role ${id}.` }
                } else {
                    return { status: 'error', message: `Unable to delete role ${id}.` }
                }
                return result;
            })
            .catch(err => {
                return { status: 'error', message: `Unable to delete role ${id}. [ ${err} ]` }
            });
    }
};


module.exports = Role;

