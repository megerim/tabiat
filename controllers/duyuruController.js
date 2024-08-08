const Duyuru = require('../models/Duyuru');

exports.createDuyuru = async (req, res) => {
    try {
      await Duyuru.create(req.body);
      res.status(200).redirect('/users/dashboard');
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  exports.deleteDuyuru = async (req, res) => {
    try {
      await Duyuru.findByIdAndDelete(req.params.id);
      res.status(200).redirect('/users/dashboard');
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  