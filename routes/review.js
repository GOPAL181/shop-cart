const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { validateReview } = require('../middleware');


router.post('/products/:productid/review',validateReview,async(req, res) => {


    try {
        const { productid } = req.params;
        const { rating, comment } = req.body;

        const product = await Product.findById(productid);

        const review = new Review({ rating, comment });

        // Average Rating Logic
        const newAverageRating = ((product.avgRating * product.reviews.length) + parseInt(rating)) / (product.reviews.length + 1);
        product.avgRating = parseFloat(newAverageRating.toFixed(1));

        product.reviews.push(review);

        await review.save();
        await product.save();

        req.flash('success', 'Added your review successfully!');
        res.redirect(`/products/${productid}`);
    }


    catch (e) {
        res.status(500).render('error', { err: e.message });
    }

 
    
});

router.delete("/products/:productid/review/:id", async(req, res)=>{
    console.log("chal rha h")
    const {productid , id} = req.params;
    console.log(productid)
    console.log(id)

    await Review.findByIdAndDelete(id);

    res.redirect(`/products/${productid}`)
})



module.exports = router;
