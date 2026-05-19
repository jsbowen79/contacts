const { body, validationResult } = require('express-validator'); 

const validContactRules = () => {
    return [
        body('lastName')
            .notEmpty()
            .withMessage("Please Provide a Last Name.")
            .isAlpha()
            .withMessage("Names may only contain letters.")
            .trim()
            .escape()
            .bail(),
      
        body('firstName')
            .notEmpty()
            .withMessage("Please Provide a First Name.")
            .isAlpha()
            .withMessage("Names may only contain letters.")
            .trim()
            .escape()
            .bail(),
        
      
        body('email')
            .notEmpty()
            .withMessage("Please Provide an Email.")
            .isEmail()
            .withMessage("Please provide a valid email.")
            .trim()
            .escape()
            .normalizeEmail()
            .bail(),
        
        body('favoriteColor')
            .notEmpty()
            .withMessage('Please provide a favorite color')
            .isAlpha()
            .withMessage('Colors can only contain letters')
            .trim()
            .escape()
            .bail(),
        
        body('birthday')
            .notEmpty().withMessage('Please provide a birthday')
            .custom(value => {
                const dateRegex =
                    /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

                if (!dateRegex.test(value)) {
                    throw new Error(
                        'Date must be in mm/dd/yyyy format.'
                    )
                }
                const [month, day, year] = value.split("/");
                const date = new Date(
                  Number(year),
                  Number(month) - 1,
                  Number(day),
                );

                if (
                    date.getFullYear() !== Number(year) ||
                    date.getMonth() + 1 !== Number(month) ||
                    date.getDate() !== Number(day)) {
                    throw new Error('Please enter a valid date.');
                }
                
                return true;
            })
        
        
      
    ];
}


const validateNew = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next();
    }; 
    const extractedErrors = []; 
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg })); 
    return res.status(422).json({
        errors: extractedErrors,
    })
}

const changeContactRules = () => {
    return [
        body("lastName")
        .optional()
        .isAlpha()
        .withMessage("Names may only contain letters.")
        .trim()
        .escape()
        .bail(),
        
        body("firstName")
        .optional()
        .isAlpha()
        .withMessage("Names may only contain letters.")
        .trim()
        .escape()
        .bail(),
        
        body("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email.")
        .trim()
        .escape()
        .normalizeEmail()
        .bail(),
        
        body("favoriteColor")
        .optional()
        .isAlpha()
        .withMessage("Colors can only contain letters")
        .trim()
        .escape()
        .bail(),
        
        body("birthday")
        .optional()
        .custom((value) => {
            const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            
            if (!dateRegex.test(value)) {
                throw new Error("Date must be in mm/dd/yyyy format.");
            }
            const [month, day, year] = value.split("/");
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            
            if (
                date.getFullYear() !== Number(year) ||
                date.getMonth() + 1 !== Number(month) ||
                date.getDate() !== Number(day)
            ) {
                throw new Error("Please enter a valid date.");
            }
            
            return true;
        }),
    ];
};

const validateChange = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = { validContactRules, validateNew, changeContactRules, validateChange }
