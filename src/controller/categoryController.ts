import Category from "../database/models/Category"



class CategoryController {

    categoryData =[
        {
            categoryName:"Electronics"
        },
        {
            categoryName:"Groceries"
        },
        {
            categoryName:"food & Beverage"
        },
        {
            categoryName:"Beauty & Health"
        },

    ]
    async seedCategory() :Promise<void>
{
const data =await Category.findAll()
if(data.length===0){
    const newCategory = await Category.bulkCreate(this.categoryData)
    console.log("categories created successfully")
}
else{
    console.log("categories already added")
}
}
}
export default new CategoryController()