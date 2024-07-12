import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/model/Product";

export default async function handle(req,res){
    const {method} = req;
    // Now to put new products into database we need database connection hence we will use mongoose
    await mongooseConnect();

    if(method === 'GET'){
        if(req.query?.id){
            // No need for question mark here since we know query will exist
            res.json(await Product.findOne({_id:req.query.id}))
        }else{
            res.json(await Product.find())
        }
    }

    if(method==='POST'){
        const {title,description,price,images,category}= req.body;
        const productDoc = await Product.create({
            title,description,price,images,category
        })
        res.json(productDoc)
    }

    if(method === 'PUT'){
        const {title,description,price,images,category,_id}= req.body;
        await Product.updateOne({_id},{title,description,price,images,category})
        res.json(true);
    }

    if(method === 'DELETE'){
        if(req.query?.id){
            await Product.deleteOne({_id:req.query?.id});
            res.json(true)
        }
    }
}