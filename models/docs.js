var mongoose = require("mongoose");
var docschema = new mongoose.Schema({
	username : [String],
	room     : String,
	Content  : String,
    owner    : String

	
});
module.exports = mongoose.model("Doc", docschema);