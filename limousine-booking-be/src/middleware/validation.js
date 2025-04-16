const Joi = require('joi');

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.method === 'GET' ? req.query : req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        next();
    };
};

// Auth schemas
const authSchemas = {
    login: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Email không hợp lệ',
            'any.required': 'Email là bắt buộc'
        }),
        password: Joi.string().required().messages({
            'any.required': 'Mật khẩu là bắt buộc'
        })
    }),
    register: Joi.object({
        fullName: Joi.string().required().messages({
            'any.required': 'Họ tên là bắt buộc'
        }),
        phoneNumber: Joi.string().required().pattern(/^[0-9]{10,11}$/).messages({
            'any.required': 'Số điện thoại là bắt buộc',
            'string.pattern.base': 'Số điện thoại không hợp lệ'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Email không hợp lệ',
            'any.required': 'Email là bắt buộc'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            'any.required': 'Mật khẩu là bắt buộc'
        })
    })
};

// Booking schemas
const bookingSchemas = {
    create: Joi.object({
        tripId: Joi.number().required().messages({
            'any.required': 'Mã chuyến đi là bắt buộc',
            'number.base': 'Mã chuyến đi phải là số'
        }),
        fullName: Joi.string().required().messages({
            'any.required': 'Họ tên là bắt buộc'
        }),
        phoneNumber: Joi.string().required().pattern(/^[0-9]{10,11}$/).messages({
            'any.required': 'Số điện thoại là bắt buộc',
            'string.pattern.base': 'Số điện thoại không hợp lệ'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Email không hợp lệ',
            'any.required': 'Email là bắt buộc'
        }),
        seatNumbers: Joi.array().items(Joi.string()).required().messages({
            'any.required': 'Số ghế là bắt buộc'
        }),
        note: Joi.string().allow('').optional(),
        subOriginId: Joi.number().required().messages({
            'any.required': 'Mã điểm xuất phát là bắt buộc'
        }),
        subDestinationId: Joi.number().required().messages({
            'any.required': 'Mã điểm đến là bắt buộc'
        })
    })
};

// Trip schemas
const tripSchemas = {
    list: Joi.object({
        departureTime: Joi.date().iso().optional().messages({
            'date.base': 'Thời gian khởi hành không hợp lệ'
        }),
        arrivalTime: Joi.date().iso().optional().messages({
            'date.base': 'Thời gian đến không hợp lệ'
        }),
        originLocationCode: Joi.string().optional().messages({
            'string.base': 'Mã điểm xuất phát không hợp lệ'
        }),
        destinationLocationCode: Joi.string().optional().messages({
            'string.base': 'Mã điểm đến không hợp lệ'
        }),
        type: Joi.string().valid('STANDARD', 'VIP').optional().messages({
            'any.only': 'Loại xe phải là STANDARD hoặc VIP'
        }),
        status: Joi.string().valid('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED').optional().messages({
            'any.only': 'Trạng thái không hợp lệ'
        }),
        limit: Joi.number().integer().optional().min(1).max(100).default(10).messages({
            'number.base': 'Giới hạn phải là số',
            'number.integer': 'Giới hạn phải là số nguyên',
            'number.min': 'Giới hạn phải lớn hơn 0',
            'number.max': 'Giới hạn không được vượt quá 100'
        }),
        offset: Joi.number().integer().optional().min(0).default(0).messages({
            'number.base': 'Offset phải là số',
            'number.integer': 'Offset phải là số nguyên',
            'number.min': 'Offset không được âm'
        })
    }),
    create: Joi.object({
        departureTime: Joi.date().required().greater('now').messages({
            'any.required': 'Thời gian khởi hành là bắt buộc',
            'date.greater': 'Thời gian khởi hành phải lớn hơn thời gian hiện tại'
        }),
        arrivalTime: Joi.date().required().greater(Joi.ref('departureTime')).messages({
            'any.required': 'Thời gian đến là bắt buộc',
            'date.greater': 'Thời gian đến phải lớn hơn thời gian khởi hành'
        }),
        originLocationCode: Joi.string().required().messages({
            'any.required': 'Mã điểm xuất phát là bắt buộc'
        }),
        destinationLocationCode: Joi.string().required().messages({
            'any.required': 'Mã điểm đến là bắt buộc'
        }),
        type: Joi.string().valid('STANDARD', 'VIP').required().messages({
            'any.required': 'Loại xe là bắt buộc',
            'any.only': 'Loại xe phải là STANDARD hoặc VIP'
        }),
        vehicleLicensePlate: Joi.string().required().messages({
            'any.required': 'Biển số xe là bắt buộc'
        }),
        price: Joi.number().required().min(0).messages({
            'any.required': 'Giá vé là bắt buộc',
            'number.min': 'Giá vé phải lớn hơn 0'
        }),
        status: Joi.string().valid('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').default('SCHEDULED')
    }),
    createDaily: Joi.object({
        departureTime: Joi.date().required().messages({
            'any.required': 'Thời gian khởi hành là bắt buộc'
        }),
        arrivalTime: Joi.date().required().greater(Joi.ref('departureTime')).messages({
            'any.required': 'Thời gian đến là bắt buộc',
            'date.greater': 'Thời gian đến phải lớn hơn thời gian khởi hành'
        }),
        originLocationCode: Joi.string().required().messages({
            'any.required': 'Mã điểm xuất phát là bắt buộc'
        }),
        destinationLocationCode: Joi.string().required().messages({
            'any.required': 'Mã điểm đến là bắt buộc'
        }),
        type: Joi.string().valid('STANDARD', 'VIP').required().messages({
            'any.required': 'Loại xe là bắt buộc',
            'any.only': 'Loại xe phải là STANDARD hoặc VIP'
        }),
        vehicleLicensePlate: Joi.string().required().messages({
            'any.required': 'Biển số xe là bắt buộc'
        }),
        price: Joi.number().required().min(0).messages({
            'any.required': 'Giá vé là bắt buộc',
            'number.min': 'Giá vé phải lớn hơn 0'
        }),
        status: Joi.string().valid('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').default('SCHEDULED'),
        startDate: Joi.date().required().greater('now').messages({
            'any.required': 'Ngày bắt đầu là bắt buộc',
            'date.greater': 'Ngày bắt đầu phải lớn hơn ngày hiện tại'
        }),
        endDate: Joi.date().required().greater(Joi.ref('startDate')).messages({
            'any.required': 'Ngày kết thúc là bắt buộc',
            'date.greater': 'Ngày kết thúc phải lớn hơn ngày bắt đầu'
        })
    }),
    search: Joi.object({
        departureTime: Joi.date().iso().optional().messages({
            'date.base': 'Thời gian khởi hành không hợp lệ'
        }),
        origin: Joi.string().optional().messages({
            'string.base': 'Tên điểm xuất phát không hợp lệ'
        }),
        destination: Joi.string().optional().messages({
            'string.base': 'Tên điểm đến không hợp lệ'
        }),
        type: Joi.string().valid('STANDARD', 'VIP').optional().messages({
            'any.only': 'Loại xe phải là STANDARD hoặc VIP'
        }),
        limit: Joi.number().integer().optional().min(1).max(100).default(10).messages({
            'number.base': 'Giới hạn phải là số',
            'number.integer': 'Giới hạn phải là số nguyên',
            'number.min': 'Giới hạn phải lớn hơn 0',
            'number.max': 'Giới hạn không được vượt quá 100'
        }),
        offset: Joi.number().integer().optional().min(0).default(0).messages({
            'number.base': 'Offset phải là số',
            'number.integer': 'Offset phải là số nguyên',
            'number.min': 'Offset không được âm'
        })
    })
};

// Vehicle schemas
const vehicleSchemas = {
    create: Joi.object({
        licensePlate: Joi.string().required().pattern(/^\d{2}[A-Z]-\d{4,5}(\.\d{2})?$/).messages({
            'any.required': 'Biển số xe là bắt buộc',
            'string.pattern.base': 'Biển số xe không hợp lệ. Ví dụ: 30A-12345 hoặc 30A-12345.01'
        }),
        capacity: Joi.string().valid('Standard-34', 'VIP-20').required().messages({
            'any.required': 'Sức chứa là bắt buộc',
            'any.only': 'Sức chứa phải là Standard-34 hoặc VIP-20'
        })
    }),
    update: Joi.object({
        id: Joi.number().required().messages({
            'any.required': 'Mã xe là bắt buộc',
            'number.base': 'Mã xe phải là số'
        })
    })
};

// User schemas
const userSchemas = {
    update: Joi.object({
        fullName: Joi.string().optional(),
        phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/).optional().messages({
            'string.pattern.base': 'Số điện thoại không hợp lệ'
        }),
        email: Joi.string().email().optional().messages({
            'string.email': 'Email không hợp lệ'
        })
    })
};

// Location schemas
const locationSchemas = {
    create: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Tên địa điểm là bắt buộc'
        }),
        code: Joi.string().required().messages({
            'any.required': 'Mã địa điểm là bắt buộc'
        })
    }),
    update: Joi.object({
        id: Joi.number().required().messages({
            'any.required': 'Mã địa điểm là bắt buộc',
            'number.base': 'Mã địa điểm phải là số'
        })
    })
};

// SubLocation schemas
const subLocationSchemas = {
    create: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Tên địa điểm con là bắt buộc'
        }),
        locationCode: Joi.string().required().messages({
            'any.required': 'Mã địa điểm cha là bắt buộc'
        }),
        durationFromLocation: Joi.number().required().messages({
            'any.required': 'Thời gian đi từ điểm cha là bắt buộc'
        }),
        address: Joi.string().allow('').optional().messages({
            'string.base': 'Địa chỉ phải là chuỗi ký tự'
        })
    }),
    update: Joi.object({
        id: Joi.number().required().messages({
            'any.required': 'Mã địa điểm con là bắt buộc',
            'number.base': 'Mã địa điểm con phải là số'
        })
    })
};

module.exports = {
    validate,
    authSchemas,
    bookingSchemas,
    tripSchemas,
    vehicleSchemas,
    userSchemas,
    locationSchemas,
    subLocationSchemas
};