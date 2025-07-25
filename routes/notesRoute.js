const express = require('express')
const notesController = require('../controllers/notesController')
const userController  =require('../controllers/userController')

const router = express.Router();

// router.get('/', notesController.getAllNotes)
// router.post('/', notesController.createNote)

router.route('/').get(userController.protect,notesController.getAllNotes).post(notesController.createNote)



router.get('/:id', userController.protect,notesController.getSingleNotes)

router.patch('/:id', notesController.updateSingleNotes)

router.delete('/:id',userController.protect,userController.ristrictTo('admin'),notesController.deleteSingleNotes)

// same route chaining
// router.route('/:id').get(notesController.getSingleNotes).patch(notesController.updateSingleNotes).delete(notesController.deleteSingleNotes)

module.exports = router;