const { render } = require('ejs');
const Company = require('../../models/Company');


exports.getList = async (req, res) => {
    try {
        res.render('admin/companies/list');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        await Company.findByIdAndDelete(req.params.id);
        res.json({ message: "Company deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting Company", error: err });
    }
};

exports.getListData = async (req, res) => {
    try {

        const draw = parseInt(req.body.draw) || 0;
        const start = parseInt(req.body.start) || 0;
        const length = parseInt(req.body.length) || 10;
        const search = req.body.search?.value || "";
        const status = req.body.status; // Get the status filter

        const query = {};

        // Search condition
        if (search) {
            query.$or = [
                { name: new RegExp(search, "i") },
                { email: new RegExp(search, "i") },
                { mobile: new RegExp(search, "i") },
                { gender: new RegExp(search, "i") }
            ];
        }


        if (status) {
            query.status = status; // Add the status filter to the query
        }

        const totalRecords = await Company.countDocuments();
        const filteredRecords = await Company.countDocuments(query);



        const data_fetch = await Company.find(query)
            .sort({ createdAt: -1 })
            .skip(start)
            .limit(length)
            .exec();

        const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;

        const data = data_fetch.map(item => ({
            name__: item.name,
            name: `<div class="d-flex align-items-center">
                            <div class="avatar rounded">
                                <div class="avatar-content">
                                    <img src="${item.profile_url}" width="50"
                                        height="50" alt="Toolbar svg" />
                                </div>
                            </div>
                            <div>
                                <div class="fw-bolder">${item.name}</div>
                                <div class="font-small-2 text-muted">${item.email}</div>
                                <div class="font-small-2 text-muted">${item.phone}</div>
                                
                            </div>
                        </div>`,

            status: item.status === 1
                ? `<span class="badge rounded-pill badge-light-primary me-1">Active</span>`
                : `<span class="badge rounded-pill badge-light-danger me-1">Inactive</span>`,
            address: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
            datetime: new Date(item.createdAt).toLocaleString(), // Format datetime
            action: `<div class="dropdown">
                          <button type="button" class="btn btn-sm dropdown-toggle hide-arrow py-0" data-bs-toggle="dropdown">
                            <i data-feather="more-vertical"></i>
                          </button>
                          <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="#">
                              <i data-feather="edit-2" class="me-50"></i>
                              <span>Edit</span>
                            </a>
                           <a class="dropdown-item delete-Company" href="#" data-id="${item._id}" data-name="${item.name}" >
                              <i data-feather="trash" class="me-50"></i>
                              <span>Delete</span>
                            </a>
                          </div>
                </div>`
        }));

        res.json({
            draw,
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.storeData = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body); // should contain text inputs
        console.log("REQ FILE:", req.file); // should contain uploaded logo


        const { name, email, phone, address, latitude, longitude, status } = req.body || {};
        const logo = req.file; // Multer handles file upload

        const errors = {};

        // Validation
        if (!name) errors.name = "Company name is required";
        if (!status) errors.status = "Status is required";
        if (!email) errors.email = "Email is required";
        if (!phone) errors.phone = "Phone is required";
        if (!address) errors.address = "Address is required";
        if (!latitude) errors.latitude = "Latitude is required";
        if (!longitude) errors.longitude = "Longitude is required";


        // Format validations
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Invalid email format";
        }

        if (phone && !/^[0-9]{10}$/.test(phone)) {
            errors.phone = "Phone must be a 10-digit number";
        }

        if (latitude && !/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(latitude)) {
            errors.latitude = "Invalid latitude (-90 to 90)";
        }

        if (longitude && !/^[-+]?((1[0-7]\d)|([1-9]?\d))(\.\d+)?|180(\.0+)?$/.test(longitude)) {
            errors.longitude = "Invalid longitude (-180 to 180)";
        }
        // if (!logo) errors.logo = "Logo is required";

        // Return validation errors
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        // Create company
        const company = new Company({
            name,
            email,
            phone,
            address,
            latitude,
            longitude,
            status,
            // logo_url: logo.filename // store filename or path
        });

        await company.save();

        return res.status(201).json({
            message: "Company created successfully",
            data: company
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to save company. Please try again later." });
    }
};
