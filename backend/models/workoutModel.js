const mongoose =require('mongoose')

const Schema =mongoose.Schema

const workoutSchema=new Schema({
title:{
    type: String,
    required:true
},
reps:{
    type:Number,
    required:true
},
load:{
    type:Number,
    required:true
}

}, {timestamps:true})// when we add documents it will automatically add createdAt and updatedAt property for us 

// create structure of a data to store by schema and model is apply that schema 

module.exports = mongoose.model('Workout',workoutSchema)
