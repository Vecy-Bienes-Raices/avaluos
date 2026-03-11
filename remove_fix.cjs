const fs = require('fs');
const path = require('path');

// Use relative path since we run from project root
const filePath = path.join('src', 'pages', 'JanIAAgent.jsx');

console.log(`Reading file: ${filePath}`);

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // Define start and end markers
  const startMarker = "// 💰 EPAYCO RETURN LISTENER (PAYMENT SUCCESS)";
  const endMarker = "const fileToBase64 = (file) =>";

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1) {
    console.log("❌ Start marker not found.");
    process.exit(1);
  }
  if (endIndex === -1) {
    console.log("❌ End marker not found.");
    process.exit(1);
  }

  // Safety check: specific to this file structure
  const componentStart = content.indexOf("const JanIAAgent =");
  
  console.log(`Start Marker Index: ${startIndex}`);
  console.log(`End Marker Index: ${endIndex}`);
  console.log(`Component Start Index: ${componentStart}`);

  if (startIndex > componentStart) {
      console.log("⚠️ The first occurrence is INSIDE the component. The global (invalid) block seems to be already gone.");
      process.exit(0);
  }

  console.log(`✂️ Deleting blocking from ${startIndex} to ${endIndex}...`);
  
  // Construct new content
  // We keep everything before the start marker, and everything from the end marker onwards.
  const newContent = content.slice(0, startIndex) + "\n\n" + content.slice(endIndex);
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log("✅ File updated successfully. Invalid hook removed.");

} catch (err) {
  console.error("❌ Error processing file:", err);
  process.exit(1);
}
