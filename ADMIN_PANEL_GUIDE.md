# ATMIYA CATERERS - Admin Panel Guide

## Overview
The admin panel provides a comprehensive interface for managing all aspects of your catering business website. It includes full CRUD (Create, Read, Update, Delete) operations for all content types.

## Access Methods

### 🚀 **Multiple Ways to Access Admin Panel:**

1. **Direct URL**: `/admin` or `/admin-access`
2. **Header Navigation**: Admin button appears in header when logged in
3. **Floating Button**: Scroll down on any page to see the floating admin access button
4. **Keyboard Shortcut**: Press `Ctrl + Shift + A` from anywhere on the site
5. **Bookmark**: Save `/admin-access` as a bookmark for quick access

### 🔐 **Login Details:**
- Default password: `admin123` (can be changed via environment variable `NEXT_PUBLIC_ADMIN_PASSWORD`)
- **Remember Me**: Check the "Remember me for 30 days" option to stay logged in
- **Auto-login**: If you've used "Remember Me", you'll be automatically logged in on future visits

## Features

### 1. Dashboard Overview
- Database connection status
- Statistics showing counts of menu items, services, gallery items, and testimonials
- Quick access to all management sections

### 2. Menu Items Management
- Add, edit, and delete menu items
- Fields: Name, Description, Price, Category, Image URL, Availability status
- Categories: Appetizers, Main Course, Desserts, Beverages, Tiffin

### 3. Services Management
- Manage catering services offered
- Fields: Title, Description, Icon (FontAwesome class)
- Icons help with visual representation on the website

### 4. Gallery Management
- Upload and manage gallery images
- Fields: Title, Image URL, Category, Description
- Categories: Food, Events, Kitchen, Delivery
- Preview images in the admin interface

### 5. Testimonials Management
- Manage customer reviews and testimonials
- Fields: Customer Name, Review, Rating (1-5 stars), Location, Customer Image URL
- Star ratings are displayed visually

### 6. Events Management
- Manage catering events and bookings
- Fields: Event Title, Description, Date/Time, Location, Price, Capacity, Image URL
- Date picker for easy event scheduling

### 7. Tiffin Plans Management
- Manage tiffin subscription plans
- Fields: Plan Name, Description, Price, Duration
- Perfect for managing meal subscription services

## How to Use

### Adding New Items
1. Navigate to the desired section (Menu, Services, Gallery, etc.)
2. Click "Add New [Item Type]" button
3. Fill in the required fields
4. Click "Add [Item Type]" to save

### Editing Items
1. Find the item you want to edit in the list
2. Click the "Edit" button
3. Modify the fields as needed
4. Click "Update [Item Type]" to save changes

### Deleting Items
1. Find the item you want to delete
2. Click the "Delete" button
3. Confirm the deletion in the popup dialog

### Form Features
- Required fields are marked and validated
- Image URLs are validated for proper format
- Date pickers for event scheduling
- Dropdown selections for categories
- Checkboxes for boolean values (like availability)

## Technical Details

### API Endpoints
All CRUD operations use RESTful API endpoints:
- `GET /api/admin/[section]` - Fetch all items
- `POST /api/admin/[section]` - Create new item
- `PUT /api/admin/[section]/[id]` - Update existing item
- `DELETE /api/admin/[section]/[id]` - Delete item

### Database Collections
- `menuItems` - Menu items and dishes
- `services` - Catering services
- `gallery` - Gallery images
- `testimonials` - Customer reviews
- `events` - Catering events
- `tiffinPlans` - Tiffin subscription plans

### Security
- Password-protected access
- All operations require authentication
- Input validation on both frontend and backend

## Responsive Design
The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

On mobile devices, the sidebar becomes a horizontal scrollable menu for better usability.

## Tips for Best Results

### Images
- Use high-quality images for gallery items
- Recommended image formats: JPG, PNG, WebP
- Optimal image sizes: 800x600px or similar aspect ratios

### Content
- Write clear, descriptive content for better SEO
- Use proper categories to organize items
- Keep descriptions concise but informative

### Regular Maintenance
- Regularly update menu items and prices
- Add new testimonials to build trust
- Update gallery with recent events and food photos
- Keep event information current

## Support
If you encounter any issues with the admin panel, check:
1. Database connection status on the dashboard
2. Internet connection for image loading
3. Form validation messages for input errors

The admin panel is designed to be intuitive and user-friendly, making it easy to manage your catering business website content efficiently.
