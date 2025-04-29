// header.js
const path = require('path');

// Get the absolute path to the Header.png image
const headerImagePath = path.resolve(__dirname, 'Header.png');

// Export just the HTML string for the header part
const header = `
<div class="header">
    <img src="cid:header-image-cid" alt="Banner Image" style="width: 100%; max-width: 600px; height: auto;">
</div>
`;

// Export both the header HTML and the image path
module.exports = {
    headerHtml: header,
    headerImagePath: headerImagePath
};