const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
         filename: { type: String, default: "listingimage" },
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1603477849227-705c424d1d80?fm=jpg&q=60&w=3000",
  }
    },    
    price:Number,
    location:String,
    country:{
       type: String,
    },
    reviews: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }
]

});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
   await Review.deleteMany({_id:{$in:listing.reviews}});

  }
});
  
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;