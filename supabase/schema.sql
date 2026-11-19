-- ====================================================================
-- DP GRAPHICS - COMPLETE RELATIONAL DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Production Printing & Graphic Design E-Commerce & Business Management
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & STAFF
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'designer', 'production', 'accounts', 'staff')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    pincode TEXT,
    city TEXT DEFAULT 'Bangalore',
    first_order_date TIMESTAMPTZ DEFAULT NOW(),
    total_orders INTEGER DEFAULT 0,
    total_billed NUMERIC(12, 2) DEFAULT 0.00,
    total_paid NUMERIC(12, 2) DEFAULT 0.00,
    outstanding_balance NUMERIC(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- 4. CATEGORIES & PRODUCTS
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    pricing_type TEXT NOT NULL CHECK (pricing_type IN ('fixed', 'sqft')),
    base_price NUMERIC(10, 2) NOT NULL,
    min_quantity INTEGER DEFAULT 1,
    min_billable_area NUMERIC(10, 2) DEFAULT 0.00,
    images JSONB DEFAULT '[]'::JSONB,
    materials JSONB DEFAULT '[]'::JSONB,
    finishing_options JSONB DEFAULT '[]'::JSONB,
    sizes JSONB DEFAULT '[]'::JSONB,
    colors JSONB DEFAULT '[]'::JSONB,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    turnaround_time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS & JOB CARDS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_number TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('online', 'walk_in')),
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_whatsapp TEXT,
    customer_email TEXT,
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('shop_collection', 'home_delivery')),
    delivery_address TEXT,
    delivery_pincode TEXT,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    design_charges NUMERIC(12, 2) DEFAULT 0.00,
    additional_charges NUMERIC(12, 2) DEFAULT 0.00,
    discount NUMERIC(12, 2) DEFAULT 0.00,
    delivery_charges NUMERIC(12, 2) DEFAULT 0.00,
    grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    advance_paid NUMERIC(12, 2) DEFAULT 0.00,
    balance_due NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    order_status TEXT NOT NULL DEFAULT 'Order Received' CHECK (order_status IN (
        'Order Received', 'Design Pending', 'Design Approved', 'Work in Progress',
        'Printing Completed', 'Ready for Collection', 'Out for Delivery', 'Delivered', 'Cancelled'
    )),
    payment_status TEXT NOT NULL DEFAULT 'Unpaid' CHECK (payment_status IN ('Unpaid', 'Partially Paid', 'Paid')),
    production_method TEXT NOT NULL DEFAULT 'in_house' CHECK (production_method IN ('in_house', 'vendor_outsourced', 'hybrid')),
    expected_completion_date DATE,
    internal_notes TEXT,
    customer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_job_number ON orders(job_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    pricing_type TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2),
    selected_size TEXT,
    selected_color TEXT,
    width NUMERIC(10, 2),
    height NUMERIC(10, 2),
    unit TEXT CHECK (unit IN ('feet', 'inches')),
    area_sqft NUMERIC(10, 2),
    rate_per_sqft NUMERIC(10, 2),
    material TEXT,
    finishing JSONB DEFAULT '[]'::JSONB,
    finishing_cost NUMERIC(10, 2) DEFAULT 0.00,
    custom_text TEXT,
    artwork_url TEXT,
    artwork_file_name TEXT,
    special_instructions TEXT,
    total_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VENDORS & VENDOR WORK ORDERS
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    business_name TEXT,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    category TEXT NOT NULL,
    services_provided JSONB DEFAULT '[]'::JSONB,
    total_work_assigned NUMERIC(12, 2) DEFAULT 0.00,
    total_paid NUMERIC(12, 2) DEFAULT 0.00,
    outstanding_balance NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_number TEXT UNIQUE NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE RESTRICT,
    job_number TEXT NOT NULL REFERENCES orders(job_number) ON DELETE CASCADE,
    task_description TEXT NOT NULL,
    specifications TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    dimensions TEXT,
    agreed_price NUMERIC(10, 2) NOT NULL,
    advance_paid NUMERIC(10, 2) DEFAULT 0.00,
    balance_due NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Assigned', 'In Progress', 'Completed', 'Rejected', 'Cancelled')),
    expected_delivery_date DATE,
    artwork_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCTION TASKS & MATERIAL CONSUMPTION
CREATE TABLE IF NOT EXISTS production_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    job_number TEXT NOT NULL,
    task_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('in_house', 'outsourced')),
    assigned_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_staff_name TEXT,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    vendor_name TEXT,
    vendor_work_order_id UUID REFERENCES vendor_work_orders(id) ON DELETE SET NULL,
    material_cost NUMERIC(10, 2) DEFAULT 0.00,
    labour_cost NUMERIC(10, 2) DEFAULT 0.00,
    vendor_cost NUMERIC(10, 2) DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MATERIALS & INVENTORY
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    purchase_price NUMERIC(10, 2) NOT NULL,
    usage_cost_per_unit NUMERIC(10, 2) NOT NULL,
    stock_quantity NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    min_stock_alert NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    vendor_name TEXT,
    last_purchase_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_consumption (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    job_number TEXT NOT NULL,
    material_id UUID REFERENCES materials(id) ON DELETE RESTRICT,
    material_name TEXT NOT NULL,
    quantity_used NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. LABOUR & LABOUR TRANSACTIONS
CREATE TABLE IF NOT EXISTS labour (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    work_type TEXT NOT NULL,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('fixed_salary', 'per_job', 'per_unit')),
    default_rate NUMERIC(10, 2) NOT NULL,
    total_earnings NUMERIC(12, 2) DEFAULT 0.00,
    total_paid NUMERIC(12, 2) DEFAULT 0.00,
    pending_amount NUMERIC(12, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS labour_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    labour_id UUID REFERENCES labour(id) ON DELETE RESTRICT,
    labour_name TEXT NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    job_number TEXT,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    date DATE DEFAULT CURRENT_DATE,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BILLING & INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    job_number TEXT NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0.00,
    tax NUMERIC(12, 2) DEFAULT 0.00,
    delivery_charges NUMERIC(12, 2) DEFAULT 0.00,
    grand_total NUMERIC(12, 2) NOT NULL,
    amount_paid NUMERIC(12, 2) DEFAULT 0.00,
    balance_due NUMERIC(12, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Unpaid' CHECK (payment_status IN ('Unpaid', 'Partially Paid', 'Paid')),
    status TEXT NOT NULL DEFAULT 'Issued' CHECK (status IN ('Draft', 'Issued', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    job_number TEXT NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'Offline UPI', 'Bank Transfer', 'Cheque')),
    transaction_reference TEXT,
    notes TEXT,
    date DATE DEFAULT CURRENT_DATE,
    received_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE DEFAULT CURRENT_DATE,
    job_number TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'Material Purchase', 'Vendor Payment', 'Labour Charges', 'Transportation',
        'Delivery', 'Electricity', 'Maintenance', 'Rent', 'Equipment', 'Other Expenses'
    )),
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'Paid' CHECK (payment_status IN ('Paid', 'Unpaid', 'Pending')),
    payment_method TEXT DEFAULT 'Cash' CHECK (payment_method IN ('Cash', 'Offline UPI', 'Bank Transfer')),
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    vendor_name TEXT,
    labour_id UUID REFERENCES labour(id) ON DELETE SET NULL,
    labour_name TEXT,
    material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
    vendor_work_order_id UUID REFERENCES vendor_work_orders(id) ON DELETE SET NULL,
    notes TEXT,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ENQUIRIES
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    product_or_service TEXT NOT NULL,
    message TEXT NOT NULL,
    attachment_url TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Quotation Sent', 'Converted', 'Not Interested', 'Closed')),
    internal_notes TEXT,
    assigned_staff TEXT,
    converted_job_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. DESIGN REVISIONS & APPROVALS
CREATE TABLE IF NOT EXISTS design_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    job_number TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    preview_url TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Preview Uploaded' CHECK (status IN (
        'Design Pending', 'Preview Uploaded', 'Awaiting Approval', 'Approved', 'Revision Requested'
    )),
    customer_feedback TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 15. BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS business_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    business_name TEXT NOT NULL DEFAULT 'DP graphics',
    tagline TEXT DEFAULT 'Professional Printing & Graphic Design Studio',
    phone TEXT NOT NULL DEFAULT '+91 98450 12345',
    whatsapp TEXT NOT NULL DEFAULT '+91 98450 12345',
    email TEXT DEFAULT 'contact@dpgraphics.com',
    address TEXT NOT NULL DEFAULT 'No. 42, Commercial Print Street, Indiranagar',
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    pincode TEXT NOT NULL DEFAULT '560038',
    gst_number TEXT,
    bank_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    upi_id TEXT DEFAULT 'dpgraphics@upi',
    default_delivery_charge NUMERIC(10, 2) DEFAULT 100.00,
    free_delivery_threshold NUMERIC(10, 2) DEFAULT 2500.00,
    whatsapp_templates JSONB DEFAULT '{
        "orderConfirmation": "Hello {{name}}, thank you for your order with DP graphics! Your Job Number is {{jobNumber}}. Total amount: ₹{{total}}. Payment is offline upon shop collection or delivery. Track your order at https://dpgraphics.com/track?job={{jobNumber}}",
        "readyForCollection": "Hello {{name}}, your print job {{jobNumber}} ({{product}}) is READY FOR COLLECTION at our shop! Balance due: ₹{{balance}}. You can pay cash or UPI when picking up. Visit us between 9:30 AM to 8:30 PM.",
        "designReview": "Hello {{name}}, your design preview for {{jobNumber}} is ready for your review! Please review and approve it here: https://dpgraphics.com/design-review/{{jobNumber}}",
        "paymentReceipt": "Payment Received! Thank you {{name}}, we have recorded your payment of ₹{{amount}} for Job {{jobNumber}}. Remaining balance: ₹{{balance}}."
    }'::JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
