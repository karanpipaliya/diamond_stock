const CSV_URL = 'https://docs.google.com/spreadsheets/d/17OxYOg47SB8pGvdf6zMpcYBo5gRbdzWFksDI_gpbMqU/gviz/tq?tqx=out:csv&sheet=Sheet1';
let diamondsData = [];
let currentType = 'LG'; // Default to LG
let filtersApplied = false; // Track if filters have been applied

const naturalToggle = document.getElementById('naturalToggle');
const lgdToggle = document.getElementById('lgdToggle');
const naturalLink = document.getElementById('naturalLink');
const lgdLink = document.getElementById('lgdLink');
const filterIcon = document.getElementById('filterIcon');
const looseDiamondToggle = document.getElementById('looseDiamondToggle');
const looseDiamondLink = document.getElementById('looseDiamondLink');
const scrollToTopBtn = document.getElementById("scrollToTopBtn");



// Toggle button click events
naturalToggle.addEventListener('click', () => {
    setType('NATURAL');
    updateStoneData('NATURAL');
});

lgdToggle.addEventListener('click', () => {
    setType('LG');
    updateStoneData('LG');
});

looseDiamondToggle.addEventListener('click', () => {
    setType('LOOSE');
    updateStoneData('LOOSE');
});

// Function to update stone data based on type
function updateStoneData(type) {
    currentType = type;
    displayDiamonds(type); // Only show diamonds of selected type
}

// Function to set type and update UI
function setType(type) {
    currentType = type;
    naturalToggle.classList.toggle('active', type === 'NATURAL');
    lgdToggle.classList.toggle('active', type === 'LG');
    looseDiamondToggle.classList.toggle('active', type === 'LOOSE'); // New Line
    naturalLink.classList.toggle('active', type === 'NATURAL');
    lgdLink.classList.toggle('active', type === 'LG');
    looseDiamondLink.classList.toggle('active', type === 'LOOSE'); // New Line
    displayDiamonds(currentType); // Refresh display on type change
    highlightActiveTab();

}

// Function to apply filters
// Function to apply filters with validation
function applyFilters() {
    const filters = {
        lab: document.getElementById('labFilter').value,
        shape: document.getElementById('shapeFilter').value.toLowerCase(),
        weightRange: document.getElementById('weightRangeFilter').value,
        color: document.getElementById('colorFilter').value.toLowerCase(),
        clarity: document.getElementById('clarityFilter').value.toLowerCase(),
        cut: document.getElementById('cutFilter').value.toLowerCase(),
        polish: document.getElementById('polishFilter').value.toLowerCase(),
        symmetry: document.getElementById('symmetryFilter').value.toLowerCase()
    };

    // Check if either Natural or LG toggle is active
    const isNaturalActive = naturalToggle.classList.contains('active');
    const isLGDActive = lgdToggle.classList.contains('active');
    const islooseActive = looseDiamondToggle.classList.contains('active');

    if (!isNaturalActive && !isLGDActive && !islooseActive) {
        showRequiredFieldMessage();
        return; // Stop filter application if no type is selected
    }

    filtersApplied = true; // Mark filters as applied
    displayDiamonds(currentType, filters); // Apply filters and display diamonds

    // Close the filter drawer
    filterDrawer.classList.remove('open');
}

// Function to show the "required field" message
function showRequiredFieldMessage() {
    const errorMessage = document.getElementById('requiredFieldMessage');
    errorMessage.textContent = '*Please select either Natural or LGD before applying filters.';
    errorMessage.classList.remove('hidden');

    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 3000); // Hide message after 3 seconds
}

// Add a div for error message (if not already there)
const drawer = document.getElementById('filterDrawer');
const existingMessage = document.getElementById('requiredFieldMessage');
if (!existingMessage) {
    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.id = 'requiredFieldMessage';
    errorMessageDiv.className = 'error-message hidden';
    drawer.appendChild(errorMessageDiv);
}


// Event listener for "Apply Filters" button
document.getElementById('applyFilters').addEventListener('click', applyFilters);

// Function to reset filters
function resetFilters() {
    // Reset dropdown filters to default
    document.querySelectorAll('.filters select').forEach(select => {
        select.selectedIndex = 0;
    });

    // Reset toggles to default (LG selected by default)
    naturalToggle.classList.remove('active');
    lgdToggle.classList.remove('active');
    looseDiamondToggle.classList.remove('active'); // New Line

    // Reset filter state
    filtersApplied = false;
    setType('LG'); // Ensure LG is set as the current type
    displayDiamonds('LG'); // Show all LG diamonds without filters
}

// Reset button event
document.getElementById('resetFilters').addEventListener('click', resetFilters);


// Ensure LG is selected by default on page load
window.addEventListener('load', () => {
    setType('LG');
    fetchData();
});

// Page load par LGD selected rahe aur LGD ka data dikhe
document.addEventListener('DOMContentLoaded', function () {
    updateStoneData('LG'); // LGD ka data load kare
    document.querySelector('.filter-links a[data-type="LG"]').classList.add('active'); // LGD selected dikhaye
});

const filterLinks = document.querySelectorAll('.filter-links a');

filterLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Sab links se active class hatao
        filterLinks.forEach(link => link.classList.remove('active'));

        // Clicked link par active class add karo
        this.classList.add('active');

        // Update stone data only if not filter drawer click
        const type = this.getAttribute('data-type');
        if (type) {
            updateStoneData(type);
        }
    });
});


async function fetchData() {
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        const rows = data.split('\n').map(row => row.split(',').map(cell => cell.replace(/"/g, '').trim()));
        const headers = rows[0];
        const entries = rows.slice(1).filter(row => row.some(cell => cell.trim() !== ''));

        diamondsData = entries.map(row => {
            return {
                stockId: row[headers.indexOf('Stock #')],
                report: row[headers.indexOf('Report #')] || "None",
                shape: row[headers.indexOf('Shape')].split(' ')[0],
                weight: row[headers.indexOf('Weight')],
                color: row[headers.indexOf('Color')],
                clarity: row[headers.indexOf('Clarity')],
                cut: row[headers.indexOf('Cut')] || "",
                polish: row[headers.indexOf('Polish')],
                symmetry: row[headers.indexOf('Symmetry')],
                fluorescence: row[headers.indexOf('Fluorescence Intensity')],
                depth: row[headers.indexOf('Depth %')],
                table: row[headers.indexOf('Table %')],
                measurements: row[headers.indexOf('Measurements')],
                discount: row[headers.indexOf('Discount')],
                pricePerCarat: row[headers.indexOf('Price Per Carat')],
                price: row[headers.indexOf('Final Price')],
                treatment: row[headers.indexOf('Treatment')],
                lab: row[headers.indexOf('Lab')] || "Non Cert",
                imageUrl: row[headers.indexOf('Diamond Image')] || 'https://cdn.pixabay.com/photo/2022/03/05/10/08/beauty-7048849_1280.jpg',
                videoUrl: row[headers.indexOf('Video URL')] || '',
                type: row[headers.indexOf('TYPE')] || ''
            };
        });

        // Populate dropdowns with unique values
        populateDropdown('shapeFilter', 'shape', true); // Sort shapes with "Round" first
        populateDropdown('cutFilter', 'cut');
        populateDropdown('polishFilter', 'polish');
        populateDropdown('symmetryFilter', 'symmetry');
        populateDropdown('clarityFilter', 'clarity', false, ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3']); // Sort clarity from high to low
        populateDropdown('colorFilter', 'color'); // Populate color dropdown

        displayDiamonds(currentType); // Display default type on page load
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}

// Function to populate dropdowns with unique values
function populateDropdown(dropdownId, property, sortRoundFirst = false, predefinedOrder = []) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = `<option value="">Select ${property.charAt(0).toUpperCase() + property.slice(1)}</option>`;

    // Get unique values
    let uniqueValues = [...new Set(diamondsData.map(diamond => diamond[property].toLowerCase()))];

    // Sort shapes with "Round" first
    if (sortRoundFirst) {
        uniqueValues.sort((a, b) => {
            if (a === 'round') return -1;
            if (b === 'round') return 1;
            return a.localeCompare(b);
        });
    }

    // Sort clarity based on predefined order
    if (predefinedOrder.length > 0) {
        uniqueValues = predefinedOrder.filter(value => uniqueValues.includes(value.toLowerCase()));
    }

    // Add options to dropdown
    uniqueValues.forEach(value => {
        if (value) { // Ensure value is not empty
            dropdown.innerHTML += `<option value="${value}">${value.toUpperCase()}</option>`;
        }
    });
}

function displayDiamonds(type, filters = {}) {
    const cardContainer = document.getElementById('cardContainer');
    const noDataMessage = document.getElementById('noDataMessage');

    // Clear existing cards
    cardContainer.innerHTML = '';

    // Check if filters are applied
    const isAnyFilterApplied = filtersApplied && Object.values(filters).some(value => value !== '');

    // Filter diamonds based on type and filters
    const filteredDiamonds = diamondsData.filter(diamond => {
        if (diamond.type !== type) return false;

        // Apply filters only if filters are applied
        if (isAnyFilterApplied) {
            if (filters.lab && diamond.lab.toLowerCase() !== filters.lab.toLowerCase()) return false;
            if (filters.shape && diamond.shape.toLowerCase() !== filters.shape.toLowerCase()) return false;
            if (filters.weightRange && !isInWeightRange(diamond.weight, filters.weightRange)) return false;
            if (filters.color && diamond.color.toLowerCase() !== filters.color.toLowerCase()) return false;
            if (filters.clarity && diamond.clarity.toLowerCase() !== filters.clarity.toLowerCase()) return false;
            if (filters.cut && diamond.cut.toLowerCase() !== filters.cut.toLowerCase()) return false;
            if (filters.polish && diamond.polish.toLowerCase() !== filters.polish.toLowerCase()) return false;
            if (filters.symmetry && diamond.symmetry.toLowerCase() !== filters.symmetry.toLowerCase()) return false;
        }

        return true;
    });

    // Update the tab name and total count
    const tabNameElement = document.getElementById('tabName');
    const diamondCountElement = document.getElementById('diamondCount');

    // Set the tab name based on the current type
    let tabName = '';
    switch (type) {
        case 'NATURAL':
            tabName = 'Natural Diamonds';
            break;
        case 'LG':
            tabName = 'Lab Grown Diamonds'; // Updated to "Lab Grown Diamonds"
            break;
        case 'LOOSE':
            tabName = 'Loose Diamonds';
            break;
        default:
            tabName = 'All Diamonds';
    }
    tabNameElement.textContent = tabName;

    // Update the count of diamonds
    diamondCountElement.textContent = ` ${filteredDiamonds.length} results`;

    // Check if filtered data is empty
    if (filteredDiamonds.length === 0 && isAnyFilterApplied) {
        noDataMessage.classList.remove('hidden'); // Show no data message only if filters are applied
    } else {
        noDataMessage.classList.add('hidden'); // Hide no data message
        filteredDiamonds.forEach(diamond => {
            const card = createCard(diamond);
            cardContainer.appendChild(card);
        });
    }
}

// Function to check if weight is within the selected range
function isInWeightRange(weight, range) {
    const [min, max] = range.split('-').map(Number);
    if (max) {
        return weight >= min && weight <= max;
    } else {
        return weight >= min;
    }
}

function createCard(diamond) {
    const card = document.createElement('div');
    card.className = 'card';

    const innerCard = document.createElement('div');
    innerCard.className = 'inner-card';
    innerCard.style.backgroundImage = `url(${diamond.imageUrl})`;

    const videoButton = document.createElement('button');
    videoButton.className = 'image-video-btn';
    videoButton.onclick = () => showVideo(diamond.videoUrl, `${diamond.shape} | ${diamond.weight} | ${diamond.color} | ${diamond.clarity} | ${diamond.cut ? diamond.cut : '-'} | ${diamond.polish} | ${diamond.symmetry} | ${diamond.fluorescence}`);

    innerCard.appendChild(videoButton);
    card.appendChild(innerCard);

    const labTreatment = document.createElement('div');
    labTreatment.className = 'lab-treatment';
    labTreatment.innerHTML = `${diamond.lab} | ${diamond.treatment}`;
    card.appendChild(labTreatment);

    const reportStock = document.createElement('div');
    reportStock.className = 'report-stock';
    if (diamond.report !== "None") {
        reportStock.innerHTML = `
            <div>Report #: <a href="${diamond.report.startsWith('LG') ? 'https://www.igi.org/verify-your-report/?r=' + diamond.report : '#'}" target="_blank">${diamond.report}</a></div>
            <div>Stock #: ${diamond.stockId}</div>
        `;
    } else {
        reportStock.innerHTML = `
            <div>Report #: None</div>
            <div>Stock #: ${diamond.stockId}</div>
        `;
    }
    card.appendChild(reportStock);

    const details = document.createElement('div');
    details.className = 'bold-text details-text';
    details.style.whiteSpace = 'nowrap';
    details.innerHTML = `${diamond.shape} | ${diamond.weight} | ${diamond.color} | ${diamond.clarity} | ${abbreviate(diamond.cut)} | ${abbreviate(diamond.polish)} | ${abbreviate(diamond.symmetry)} | ${diamond.fluorescence}`;
    card.appendChild(details);

    const extraDetails = document.createElement('div');
    extraDetails.className = 'extra-details-text';
    extraDetails.innerHTML = `D: ${diamond.depth} | T: ${diamond.table} | M: ${diamond.measurements}`;
    card.appendChild(extraDetails);

    const pricing = document.createElement('div');
    pricing.className = 'highlight';
    pricing.innerHTML = `<div class="price-left">Discount: ${diamond.discount}<br>Price/ct: ${diamond.pricePerCarat}</div><div class="price-right">$${diamond.price}</div>`;
    card.appendChild(pricing);

    const inquiryButton = document.createElement('button');
    inquiryButton.className = 'inquiry-btn';
    inquiryButton.textContent = 'Send Inquiry';
    inquiryButton.onclick = () => {
    const phoneNumber = '917779003590'; // Country code ke saath number
    const customTextStart = "Hello! I'm interested in this diamond. Here are the details:"; 
    const customTextEnd = "Please let me know the availability and best price.";

    const message = `${customTextStart}\n\n` + // Start message
               `Stock ID: ${diamond.stockId}\n` +
               `Report ID: ${diamond.report}\n` +
               `Shape: ${diamond.shape}\n` +
               `Weight: ${diamond.weight}\n` +
               `Color: ${diamond.color}\n` +
               `Cut: ${diamond.cut}\n` +
               `Clarity: ${diamond.clarity}\n` +
               `Symmetry: ${diamond.symmetry}\n` +
               `Polish: ${diamond.polish}\n` +
               `Discount: ${diamond.discount}%\n`.replace(/%/g, '%25') + // Replace % with %25
               `Price Per Carat: $${diamond.pricePerCarat}\n` +
               `Final Price: $${diamond.price}\n` +
               `Image: ${diamond.imageUrl}\n` +
               `Video: ${diamond.videoUrl}\n\n` +
               `${customTextEnd}`; // End message

// Encode the entire message using encodeURIComponent
const encodedMessage = encodeURIComponent(message);

// Open WhatsApp with the encoded message
window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
};

    card.appendChild(inquiryButton);

    return card;
}

function abbreviate(value) {
    value = value.toUpperCase();
    if (value === 'EXCELLENT') return 'EX';
    if (value === 'VERY GOOD') return 'VG';
    if (value === 'IDEAL') return 'ID';
    return value;
}

function showVideo(videoUrl, details) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    const modalDetails = document.getElementById('modalDetails');
    const videoNotFoundMessage = document.getElementById('videoNotFoundMessage');

    if (videoUrl) {
        iframe.src = videoUrl; // Set video URL
        modalDetails.textContent = details; // Set details
        videoNotFoundMessage.classList.add('hidden'); // Hide "Video Not Found" message
        modal.style.display = 'flex'; // Show modal
    } else {
        iframe.src = ''; // Clear iframe src
        modalDetails.textContent = ''; // Clear details
        videoNotFoundMessage.classList.remove('hidden'); // Show "Video Not Found" message
        modal.style.display = 'none'; // Hide modal
    }
}

// Close modal when close button is clicked
document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'none'; // Hide modal
    const iframe = document.getElementById('videoFrame');
    iframe.src = ''; // Clear iframe src to stop video playback
});

// Close modal when clicking outside the modal
window.addEventListener('click', (event) => {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        modal.style.display = 'none'; // Hide modal
        const iframe = document.getElementById('videoFrame');
        iframe.src = ''; // Clear iframe src to stop video playback
    }
});

// Debugging: Check if modal is hidden on page load
window.addEventListener('load', () => {
    const modal = document.getElementById('videoModal');
    console.log('Modal display on load:', modal.style.display); // Should be "none"
});

const filterDrawer = document.getElementById('filterDrawer');
const closeDrawer = document.getElementById('closeDrawer');

// Drawer open hone par filters reset karne ka event
filterIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Drawer kholne par click event bubble hone se roko
    filterDrawer.classList.add('open');

    // Sab dropdown filters reset karo
    document.querySelectorAll('.filters select').forEach(select => {
        select.selectedIndex = 0; // Pehla option (default) select kare
    });
});

// Drawer close karne ka event
closeDrawer.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDrawer.classList.remove('open');
    highlightActiveTab();
});

// Drawer ke bahar click hone par close karna
document.addEventListener('click', (e) => {
    if (!filterDrawer.contains(e.target) && e.target !== filterIcon) {
        filterDrawer.classList.remove('open');
    }
});

// Drawer ke andar click hone par close na ho
filterDrawer.addEventListener('click', (e) => {
    e.stopPropagation(); // Drawer ke andar click hone par kuch mat karo
});


// Drawer ke LGD toggle button click event
document.getElementById('lgdToggle').addEventListener('click', function () {
    // Remove 'active' class from both toggles
    document.getElementById('naturalToggle').classList.remove('active');
    document.getElementById('lgdToggle').classList.add('active');

    // Show LGD data
    updateStoneData('LG');
});

// Reset button event — triggers drawer ke LGD button ka click
document.getElementById('resetFilters').addEventListener('click', function () {
    // Reset dropdown filters to default
    document.querySelectorAll('.filters select').forEach(select => {
        select.selectedIndex = 0;
    });

    // Reset to LG type
    setType('LG');
    displayDiamonds('LG'); // Show all LG diamonds without filters
});

// Smooth scroll for filter links (optional)
document.querySelectorAll('.filter-links a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) { // 300px scroll hone ke baad dikhai dega
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
});

// Click event for smooth scrolling to top
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

function highlightActiveTab() {
    console.log('Highlighting tab for currentType:', currentType); // Debug log

    // Remove 'active' class from all tabs
    naturalToggle.classList.remove('active');
    lgdToggle.classList.remove('active');
    looseDiamondToggle.classList.remove('active');
    naturalLink.classList.remove('active');
    lgdLink.classList.remove('active');
    looseDiamondLink.classList.remove('active');

    // Add 'active' class to the correct tab based on currentType
    if (currentType === 'NATURAL') {
        naturalToggle.classList.add('active');
        naturalLink.classList.add('active');
        console.log('Natural Diamonds tab highlighted'); // Debug log
    } else if (currentType === 'LG') {
        lgdToggle.classList.add('active');
        lgdLink.classList.add('active');
        console.log('Lab Grown Diamonds tab highlighted'); // Debug log
    } else if (currentType === 'LOOSE') {
        looseDiamondToggle.classList.add('active');
        looseDiamondLink.classList.add('active');
        console.log('Loose Diamonds tab highlighted'); // Debug log
    }
}

fetchData();