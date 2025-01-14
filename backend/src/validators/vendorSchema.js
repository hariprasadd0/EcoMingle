import Joi from 'joi';

const locationSchema = Joi.object({
  address: Joi.string().optional().trim(),
  city: Joi.string().optional().trim(),
  state: Joi.string().optional().trim(),
  country: Joi.string().optional().trim(),
  postalCode: Joi.string().optional().trim(),
});

const vendorSchema = Joi.object({
  username: Joi.string().min(3).required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(6).required().trim(),
  description: Joi.string().optional().trim(),
  phone: Joi.string().optional().trim(),
  location: locationSchema,
  website: Joi.string().uri().optional().trim(),
  gstin: Joi.string().optional().trim(),
  pan: Joi.string().optional().trim(),
});

export default vendorSchema;
