const usersModel = {
    getAll: `SELECT 
                * 
            FROM 
                aceattorney
                `,
    getByID:` SELECT
                *
            FROM
                aceattorney
                    WHERE
                        id=?
    
    `,
    addRow:`
            INSERT INTO
            aceattorney (
                Nombre,
                Apellido,
                Trabajo,
                Genero,
                PaísOrigen,
                PersonajeActivo
            )
            VALUES(
                ?,?,?,?,?,?
            )`,
    updateRow:`
            UPDATE
                aceattorney 
            SET
                Nombre=?,
                Apellido=?,
                Trabajo=?,
                Genero=?,
                PaísOrigen=?
            WHERE
                id=?
            `,
    getByUsername: `
                SELECT
                    *
                FROM
                    aceattorney
                WHERE 
                    Nombre = ?
    `,
    deleteRow: `
                UPDATE
                    aceattorney
                SET
                    PersonajeActivo = 0
                WHERE
                    id=?
    `,
};

module.exports = usersModel;