const {request, response} = require ('express');
const usersModel = require('../models/users');
const pool = require ('../db');


const usersList = async (req = request, res = response)=>{
    
    let conn;
    try {
        conn = await pool.getConnection();
        const users = await conn.query(usersModel.getAll, (err)=>{
            if(err){
                throw new Error(err);
            }
        })
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
       if(conn) conn.end();
    }
}

const listUserByID = async (req = request, res = response)=>{
    const{id} = req.params;
    let conn;

    if(isNaN(id)){
        res.status(400).json({msg:'Invalid ID'});
        return;
    }

    try {
        conn = await pool.getConnection();
        const [users] = await conn.query(usersModel.getByID,[id], (err)=>{
            if(err){
                throw new Error(err);
            }
        });

        if(!users){
            res.status(404).json({msg: 'User not found'});
            return;
        }

        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
       if(conn) conn.end();
    }
}

const addUser = async (req= request,res=response)=>{
    const {
        Nombre,
        Apellido,
        Trabajo,
        Genero,
        PaísOrigen,
        PersonajeActivo = 1
    } = req.body;

    if(!Nombre || !Apellido || !Trabajo || !Genero || !PaísOrigen|| !PersonajeActivo){
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const personaje = [
        Nombre,
        Apellido,
        Trabajo,
        Genero,
        PaísOrigen,
        PersonajeActivo];

    let conn;
    try {
        conn= await pool.getConnection();

        const [usernameUser] = await conn.query(usersModel.getByUsername,[Nombre], (err)=>{
            if (err) throw err;
        });

        if (usernameUser){
            res.status(409).json({msg:`Personaje con el nombre ${Nombre} ya existe`});
            return;
        }

        const userAdded = await conn.query(usersModel.addRow,[...personaje],(err)=>{
            if(err) throw err;
        })

        if(userAdded.affectedRows === 0) throw new error({msg:'Fallo al añadir personaje'});

        res.json({msg: 'Personaje añadido correctamente'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if(conn) conn.end();
    }
}

const patchUser = async (req,res)=>{
    const {
        Nombre,
        Apellido,
        Trabajo,
        Genero,
        PaísOrigen
    } = req.body;

    if(!Nombre || !Apellido || !Trabajo || !Genero || !PaísOrigen){
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const newUserData = [
        Nombre,
        Apellido,
        Trabajo,
        Genero,
        PaísOrigen];

    let conn;
    const{id} = req.params;

    if(isNaN(id)){
        res.status(400).json({msg:'ID no válida'});
        return;
    }

    try {
        conn = await pool.getConnection();
        const [userExists] = await conn.query(usersModel.getByID,[id], (err)=>{
            if(err){
                throw new Error(err);
            }
        });

        if(!userExists || userExists.is_active === 0){
            res.status(404).json({msg: 'Personaje no encontrado'});
            return;
        }

        if(Nombre){

        const [usernameUser] = await conn.query(usersModel.getByUsername,[Nombre], (err)=>{
            if (err) throw err;
        });
        if (usernameUser){
            res.status(409).json({msg:`Personaje con el nombre ${Nombre} ya existe`});
            return;
        }
        }

        const oldUserData=[
        userExists.Nombre,
        userExists.Apellido,
        userExists.Trabajo,
        userExists.Genero,
        userExists.PaísOrigen,
        userExists.PersonajeActivo,
        ];

        newUserData.forEach((userData, index) =>{
            if(!userData){
                newUserData[index] = oldUserData[index];
            }
        });

        const userUpdated = await conn.query(usersModel.updateRow,[...newUserData, id],(err)=>{
            if(err) throw err;
        })

        if(userUpdated.affectedRows === 0) throw new error({msg:'Fallo al actualizar datos de personaje'});

        res.json({msg: 'Personaje actualizado correctamente'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if(conn) conn.end();
    }
}

const deleteUser = async (req = request, res = response)=>{
    let conn;

    try {
    conn = await pool.getConnection();
    const {id} = req.params

    const [userExist] = await conn.query(usersModel.getByID,[id],(err)=>{
    if(err) throw err;
    });

    if (!userExist || userExist.is_active === 0){
        res.status(404).json({msg:'Personaje no encontrado'});
        return;
    }

    const userDeleted = await conn.query(usersModel.deleteRow,[id],(err)=>{
        if(err) throw err;
    });

    if(userDeleted.affectedRows === 0){
        throw new Error ({msg:'Fallo al eliminar personaje'});
    };
    res.json({msg:'Personaje eliminado correctamente'});


    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if(conn) conn.end();
    }
}

module.exports = {usersList, listUserByID, addUser, patchUser, deleteUser};