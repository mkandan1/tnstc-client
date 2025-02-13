import Joi from "joi";
// Define the Course Schema using Joi
const courseSchema = Joi.object({
    name: Joi.string().min(3).required().label("Course Name"),
    category: Joi.string().required().label("Category"),
    subCategory: Joi.string().required().label("Sub Category"),
    price: Joi.number().positive().required().label("Price"),
    status: Joi.string().valid('active', 'archived').required().label("Status"),
    description: Joi.string().min(10).required().label("Description"),
    thumbnail: Joi.string().label("Thumbnail").optional(),
    lessons: Joi.array().items().label("Lessons").optional(),
    practices: Joi.array().items().label("Practices").optional(),
    addedToDB: Joi.boolean().required(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
    __v: Joi.number().optional(),
    _id: Joi.string().optional().label('Id'),
});

export default courseSchema;