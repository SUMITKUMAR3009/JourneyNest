const express =require("express");
const app = express();
const mongoose=require ("mongoose");
const Listing=require("./models/listing.js");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");


main().then(()=>{
    console.log("connection to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/JourneyNest");
}




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req,res) =>{
  res.send("Hi, I am root")
} );

const validateListing = (req,res,next) =>{
let {error}= listingSchema.validate(req.body);

if(error) {
  let errMsg = error.details.map((el) => el.message).join("");
  throw new ExpressError(400,result.errMsg);
} else{
  next();
}
}

  //index Route
app.get("/listings",  wrapAsync(async(req,res)=>{
 const allListings=await Listing.find({});
 res.render("./listings/index.ejs",{allListings});    
}));

// new route
app.get("/listings/new", wrapAsync (async (req,res)=>{
  res.render("listings/new.ejs");

})
)


//Show Route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
let {id}=req.params;
const listing = await Listing.findById(id);
res.render("listings/show.ejs",{listing});
}))

//Create Route
app.post("/listings", validateListing,
  wrapAsync(async(req,res,next)=> {

    const listing=new Listing(req.body.listing);
    await listing.save();
   res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
  let {id}=req.params;
const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}))


//Update Route
app.put("/listings/:id",
  validateListing,
  wrapAsync(async(req,res)=>{

  let {id}=req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.listing});
 res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let deletelisting =await Listing.findByIdAndDelete(id);
  console.log(deletelisting);
  res.redirect("/listings");
}))

 //app.get("/testListing",async(req,res) =>{
   // let sampleListing= new Listing({
  //   title:"My New Villa",
   //  description:"By the beach",
   //  price:1200,
 //    location:"calangute,Goa",
  //   country:"india",
  //  });
   
  // await sampleListing.save();
  // console.log("sample was saved");
  // res.send("successful testing");
// });

//  app.get("/",(req,res)=>{
    //  res.send("the server is working")
//  })

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"))
})

 app.use((err,req,res,next)=>{
  let {statusCode=500,message="somethings went wrong! "} = err;
  res.render("error.ejs",{message })
  // res.status(statusCode).send(message);
})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})