import Joi from 'joi';
import toast from 'react-hot-toast';

const formatErrorMessage = (errorDetails) => {
    if (errorDetails.length > 0) {
        const detail = errorDetails[0]; // Get the first error message
        const field = detail.context?.label || 'Field';
        let message = detail.message;

        // Customizing messages for better clarity
        if (message.includes('is required')) {
            message = `${field} is required.`;
        } else if (message.includes('must be a valid')) {
            message = `${field} must be a valid ${detail.context?.type}.`;
        } else if (message.includes('is not allowed to empty')) {
            message = `${field} is empty`;
        }
        return message;
    }
    return '';
};

// Generic Validation Function
const validateData = (data, schema) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        // Get and format the first error message
        const errorMessage = formatErrorMessage(error.details);

        // Display only the first error message
        if(errorMessage){
            toast.error(errorMessage, {
                duration: 4000, // Duration for the toast notification
                position: 'bottom-right',
                style: {
                    background: '#f44336',
                    color: '#fff',
                    borderRadius: '5px',
                    padding: '10px',
                },
            });
        }
        return false;
    }
    return true;
};

export default validateData;