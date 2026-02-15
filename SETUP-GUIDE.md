# Google Sheets Integration Setup Guide

## Problem Identified
Your code is getting 200 response but not writing to sheets because:
1. Parameter names were wrong (looking for "No Name" instead of actual values)
2. Sheet might need proper headers

## Step-by-Step Fix

### Step 1: Setup Your Google Sheet
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1l-euxZSUlug_cOikXZmQ_F8-xRS8i16XvEH_aoP2rhI
2. In Row 1, add these headers:
   - A1: `name`
   - B1: `mobile`
   - C1: `message`
   - D1: `date`

### Step 2: Update Apps Script Code
1. Go to your Apps Script project
2. Replace the entire Code.gs with this CORRECTED version:

```javascript
function doPost(e) {
  try {
    // 1. Open your spreadsheet
    var sheet = SpreadsheetApp.openById("1l-euxZSUlug_cOikXZmQ_F8-xRS8i16XvEH_aoP2rhI").getSheets()[0];
    
    // 2. Extract parameters - FIXED: Use correct parameter names
    var name = e.parameter.name || "No Name";
    var mobile = e.parameter.mobile || "No Mobile";
    var message = e.parameter.message || "No Message";
    var date = new Date();
    
    // 3. Log for debugging
    Logger.log("Received - Name: " + name + ", Mobile: " + mobile + ", Message: " + message);
    
    // 4. Append to sheet
    sheet.appendRow([name, mobile, message, date]);
    
    // 5. Return success response
    return ContentService.createTextOutput("Success");
  } catch (err) {
    // Return error with details
    Logger.log("Error: " + err.toString());
    return ContentService.createTextOutput("Error: " + err.toString());
  }
}

// Test function - Run this first to verify sheet access
function testSheetAccess() {
  try {
    var sheet = SpreadsheetApp.openById("1l-euxZSUlug_cOikXZmQ_F8-xRS8i16XvEH_aoP2rhI").getSheets()[0];
    Logger.log("✓ Sheet name: " + sheet.getName());
    Logger.log("✓ Last row: " + sheet.getLastRow());
    
    // Try to write a test row
    sheet.appendRow(["Test Name", "1234567890", "Test Message", new Date()]);
    Logger.log("✓ Test row added successfully!");
    
  } catch (err) {
    Logger.log("✗ Error: " + err.toString());
  }
}
```

### Step 3: Test the Script
1. In Apps Script editor, select the function `testSheetAccess` from dropdown
2. Click "Run" button
3. Check your Google Sheet - you should see a test row added
4. Check "Execution log" to see the logs

### Step 4: Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Click gear icon ⚙️ > Select "Web app"
3. Settings:
   - Description: "Enquiry Form Handler"
   - Execute as: **Me (your email)**
   - Who has access: **Anyone** (important!)
4. Click "Deploy"
5. **Copy the Web App URL** (looks like: https://script.google.com/macros/s/ABC123.../exec)

### Step 5: Update Your Website
1. Open your website's HTML file (or create a separate script.js file)
2. Find this line in the modal code:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace with your actual Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec';
   ```

### Step 6: Test the Form
1. Open your website
2. Click "Enquire Now"
3. Fill in the form:
   - Name: Test User
   - Mobile: 9876543210
   - Message: Testing form
4. Click Submit
5. Check your Google Sheet - data should appear!

## Debugging Tips

### If data is still not appearing:

1. **Check Apps Script Logs:**
   - In Apps Script, go to "Executions" tab
   - Look for your recent executions
   - Check if there are any errors

2. **Check Browser Console:**
   - Open your website
   - Press F12 (Developer Tools)
   - Go to "Console" tab
   - Submit form and check for errors

3. **Check Network Tab:**
   - In Developer Tools, go to "Network" tab
   - Submit form
   - Look for the request to Google Script
   - Check if it's sending correct data

4. **Verify Permissions:**
   - Make sure Web App is set to "Anyone" can access
   - Re-deploy if you made changes

5. **Test Script Directly:**
   - Run `testSheetAccess()` function in Apps Script
   - This will confirm if the script can write to sheet

## Common Issues and Solutions

### Issue 1: "Access Denied"
**Solution:** Re-deploy with "Execute as: Me" and "Anyone" can access

### Issue 2: Sheet Not Updating
**Solution:** 
- Run `testSheetAccess()` to verify sheet access
- Check Sheet ID is correct
- Make sure sheet exists and has headers

### Issue 3: Getting "undefined" values
**Solution:** 
- Make sure form field names match: `name`, `mobile`, `message`
- Check the FormData is being sent correctly

### Issue 4: CORS Error
**Solution:** 
- Use `mode: 'no-cors'` in fetch request (already included in code)
- This is normal for Google Apps Script

## Expected Result
When working correctly:
- ✓ Form submits successfully
- ✓ Success message shows in modal
- ✓ Data appears in Google Sheet with timestamp
- ✓ Modal closes automatically after 3 seconds

## Support
If you still have issues after following all steps:
1. Check the Execution log in Apps Script
2. Check Browser console for JavaScript errors
3. Verify all URLs are correct
4. Make sure Sheet ID matches exactly
