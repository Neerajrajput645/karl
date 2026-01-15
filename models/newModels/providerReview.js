const {model, Schema} = require("mongoose");

// ================================ Provider Review Schema ===================================
const providerReview = new Schema({
    providerId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"ServiceProvider",
    },
    ratingBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    requestId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"serviceRequest",
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:true,
    }
},{
    timestamps:true
});

// ====================== Export Model =====================
module.exports = model("ProviderReview", providerReview);