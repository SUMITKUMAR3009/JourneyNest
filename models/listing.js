const mongoose=require("mongoose")
const Schema= mongoose.Schema;


const listingSchema=new Schema ({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       type: String,
       default:"https://www.istockphoto.com/photo/sunset-over-indian-ocean-maldives-gm1813433942-549475242?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Ftropical-sunset&utm_medium=affiliate&utm_source=unsplash&utm_term=tropical+sunset%3A%3A%3A",
    set: (v) => v === "" ? "https://www.istockphoto.com/photo/sunset-over-indian-ocean-maldives-gm1813433942-549475242?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Ftropical-sunset&utm_medium=affiliate&utm_source=unsplash&utm_term=tropical+sunset%3A%3A%3A":v, 
    },
    price:Number,
    location:String,
    country:String,
    });

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;