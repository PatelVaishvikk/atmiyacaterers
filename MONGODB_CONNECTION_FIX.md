# 🔧 MongoDB Connection Fix Guide

## 🚨 **Current Issue**
You're getting an SSL/TLS error when connecting to MongoDB:
```
SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

## 🛠️ **Solutions to Try**

### **Solution 1: Updated SSL Configuration (Already Applied)**
I've updated your `src/lib/mongodb.js` with better SSL settings:
```javascript
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  retryWrites: true,
  w: 'majority',
};
```

### **Solution 2: Check Your MongoDB URI**
Make sure your `.env.local` file has the correct MongoDB URI format:

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/atmiya_caterers
```

### **Solution 3: Alternative Configuration**
If the SSL fix doesn't work, try the alternative configuration:

1. **Temporarily replace** the import in your API routes:
```javascript
// Change this line in your API routes:
import clientPromise from '@/lib/mongodb';

// To this:
import clientPromise from '@/lib/mongodb-alternative';
```

2. **Test the connection** by visiting: `/api/test-mongodb`

### **Solution 4: MongoDB Atlas Network Access**
If using MongoDB Atlas:

1. **Check Network Access:**
   - Go to MongoDB Atlas Dashboard
   - Click "Network Access" in the left sidebar
   - Make sure your IP address is whitelisted
   - Or add `0.0.0.0/0` for all IPs (less secure but works for testing)

2. **Check Database User:**
   - Go to "Database Access" in MongoDB Atlas
   - Make sure your user has read/write permissions
   - Username and password in URI must match

### **Solution 5: Connection String Parameters**
Try adding these parameters to your MongoDB URI:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true&authSource=admin&tlsAllowInvalidCertificates=true
```

## 🧪 **Testing Steps**

### **Step 1: Test Basic Connection**
Visit: `http://localhost:3000/api/test-mongodb`

This will show detailed connection information and help identify the exact issue.

### **Step 2: Check Environment Variables**
Make sure your `.env.local` file exists and contains:
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### **Step 3: Test Admin Panel**
1. Go to `/admin`
2. Check the "Database Connection Test" section
3. Look for any error messages

## 🔍 **Common Issues & Solutions**

### **Issue 1: SSL Certificate Problems**
**Error:** `SSL routines:ssl3_read_bytes:tlsv1 alert internal error`

**Solutions:**
- Use the updated configuration (already applied)
- Try the alternative configuration without SSL
- Check if your MongoDB Atlas cluster supports the SSL version

### **Issue 2: Network/Firewall Issues**
**Error:** `ECONNREFUSED` or timeout errors

**Solutions:**
- Check MongoDB Atlas Network Access settings
- Whitelist your IP address
- Try connecting from a different network

### **Issue 3: Authentication Issues**
**Error:** `Authentication failed`

**Solutions:**
- Verify username/password in connection string
- Check database user permissions in MongoDB Atlas
- Make sure the database name is correct

### **Issue 4: Database Name Issues**
**Error:** `Database not found`

**Solutions:**
- Check if the database name in URI matches your actual database
- Create the database if it doesn't exist
- Use the default database name

## 🚀 **Quick Fixes to Try**

### **Fix 1: Restart Development Server**
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### **Fix 2: Clear Next.js Cache**
```bash
# Delete .next folder
rm -rf .next
# Or on Windows:
rmdir /s .next

# Restart server
npm run dev
```

### **Fix 3: Check MongoDB Atlas Status**
- Visit: https://status.mongodb.com/
- Check if there are any ongoing issues

### **Fix 4: Try Different Connection String**
If you're using MongoDB Atlas, try this format:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

## 📋 **Debugging Checklist**

- [ ] `.env.local` file exists and has correct MONGODB_URI
- [ ] MongoDB Atlas cluster is running
- [ ] Network access is configured (IP whitelisted)
- [ ] Database user has correct permissions
- [ ] Connection string format is correct
- [ ] No firewall blocking the connection
- [ ] Development server restarted after changes

## 🆘 **If Nothing Works**

### **Option 1: Use Local MongoDB**
Install MongoDB locally and use:
```env
MONGODB_URI=mongodb://localhost:27017/atmiya_caterers
```

### **Option 2: Use MongoDB Compass**
1. Download MongoDB Compass
2. Test your connection string there first
3. If it works in Compass, the issue is with the Node.js driver

### **Option 3: Contact Support**
- MongoDB Atlas Support
- Check MongoDB Community Forums
- Stack Overflow for specific error messages

## 🎯 **Expected Result**

After applying the fixes, you should see:
```json
{
  "success": true,
  "message": "MongoDB connection successful",
  "details": {
    "collections": 0,
    "ping": { "ok": 1 },
    "timestamp": "2024-01-XX..."
  }
}
```

## 📞 **Need Help?**

1. **Test the connection:** Visit `/api/test-mongodb`
2. **Check the admin panel:** Go to `/admin` and look at the database test
3. **Share the error:** Copy the exact error message for further help

The updated configuration should resolve the SSL/TLS issues you're experiencing!
