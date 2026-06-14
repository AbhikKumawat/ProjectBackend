const musicModel = require('../models/music.model');
const jwt = require('jsonwebtoken');
const { uploadFile } = require('../services/storage.services');

async function createMusic(req, res) {
    
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

        try {
           const decoded = jwt.verify(token, process.env.JWT_SECRET);
           console.log(decoded);
           if (decoded.role !== 'admin') {
            return res.status(403).json({
                message: 'You cannot create music!!'
            });
           }
    }catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    const result = await uploadFile(req.file.buffer,toString('base64'));
    const music = await musicModel.create({
        title: req.body.title,
        uri: result.url,
        artist: req.body.artist
    });
    res.status(201).json({
        message: 'Music created successfully',
        music
        
    });

}
module.exports = {
    createMusic
}

