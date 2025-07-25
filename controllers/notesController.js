
const Note = require('../models/nodeModel')

exports.getAllNotes = (req, res) => {
    res.send("<h1>HII</h1>")
};

exports.createNote = async (req, res) => {

    try {
        console.log(req.body)
        const note = await Note.create(req.body)
        res.status(201).json({
            status: "success",
            data: {
                note
            }
        })
    }
    catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
        })
    }
}



exports.getAllNotes = async (req, res) => {

    try {
        const notes = await Note.find();
        res.status(200).json({
            status: "success",
            no_notes: notes.length,
            Data: {
                notes,
            }
        })
    }
    catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
        })
    }
}


exports.getSingleNotes = async (req, res) => {
    try {

        // const id=req.params.id
        // const note=await Note.findById(id)
        const notes = await Note.findOne({ _id: req.params.id });

        if (!notes) {
            return res.status(404).json({
                status: 'fail',
                message: 'No notes found with that id'
            })
        }

        res.status(200).json({
            status: "success",
            // no_notes:notes.length,
            Data: {
                notes,
            }
        })
    }
    catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
        })
    }
}

exports.updateSingleNotes = async (req, res) => {
    try {
        const id = req.params.id;

        //   const note= await Note.findByIdAndUpdate(id,req.body,{new:true})

        const note = await Note.updateOne({ _id: id }, { $set: req.body })

        if (!note) {
            return res.status(404).json({
                status: 'fail',
                message: 'No notes found with that id'
            })
        }
        res.status(200).json({
            status: "success",
            // no_notes:notes.length,
            Data: {
                note,
            }
        })
    }
    catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
        })
    }
}

exports.deleteSingleNotes = async (req, res) => {
    try {
        const id = req.params.id;

        const note = await Note.deleteOne({ _id: id })

        if (!note) {
            return res.status(404).json({
                status: 'fail',
                message: 'No notes found with that id'
            })
        }

        res.status(204).json({
            status: "success",
        })

    }
    catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
        })
    }
}