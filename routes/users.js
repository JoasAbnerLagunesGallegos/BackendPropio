const {Router} = require ('express');
const{usersList, listUserByID, addUser, patchUser, deleteUser} = require('../controllers/users');
const router = Router();

// http://localhost:3000/api/v1/aceattorney/
router.get('/', usersList);
router.get('/:id', listUserByID);
router.put('/', addUser);
router.patch('/:id', patchUser);
router.delete('/:id', deleteUser);

module.exports = router;