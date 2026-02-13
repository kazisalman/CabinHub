
// Modal HTML Template
const modalHTML = `
<div class="modal-backdrop" id="enquiryModal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Request Callback
            </h2>
            <div class="modal-close" id="closeModal">&times;</div>
        </div>
        <div class="modal-body" id="modalBody">
            <form class="modal-form" id="enquiryForm">
                <div class="form-group">
                    <input type="text" name="name" placeholder="Enter Your Name" required>
                </div>
                <div class="form-group">
                    <input type="tel" name="mobile" placeholder="Enter Mobile Number" required pattern="[0-9]{10,12}">
                </div>
                <div class="form-group">
                    <textarea name="message" placeholder="Enter Your Message" required></textarea>
                </div>
                <button type="submit" class="modal-submit" id="submitBtn">
                    <span id="btnText">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 5px;">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                        Submit
                    </span>
                    <div class="loader" id="btnLoader"></div>
                </button>
            </form>
        </div>
        <div class="modal-success-screen" id="successScreen">
            <div class="icon">✓</div>
            <h3>Thank You!</h3>
            <p>Your request has been submitted successfully.</p>
            <p>Our team will contact you soon.</p>
            <button class="btn btn-primary" style="margin-top: 20px; width: 100%;" onclick="closeEnquiryModal()">Close</button>
        </div>
        <div class="modal-footer" id="modalFooter">
            <p>Our team will contact you soon.</p>
        </div>
    </div>
</div>
`;

// Inject Modal into Body
document.body.insertAdjacentHTML('beforeend', modalHTML);

// Variables
const modal = document.getElementById('enquiryModal');
const closeModalBtn = document.getElementById('closeModal');
const enquiryForm = document.getElementById('enquiryForm');
const modalBody = document.getElementById('modalBody');
const modalFooter = document.getElementById('modalFooter');
const successScreen = document.getElementById('successScreen');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwfgZ-twJux3DrOnM_O-ImOenCsmOsrvPdSlumakWV0Gmu4FG9ZB4Ao7XpZJG4IXn96JQ/exec";

// Functions
function openEnquiryModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEnquiryModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Reset form and screen after a delay
    setTimeout(() => {
        enquiryForm.reset();
        modalBody.style.display = 'block';
        modalFooter.style.display = 'block';
        successScreen.style.display = 'none';
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }, 300);
}

// Global Menu Toggle (Replacing inline scripts)
window.toggleMenu = function () {
    const nav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileOverlay');
    const hamburger = document.querySelector('.hamburger');

    if (nav) nav.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    if (hamburger) hamburger.classList.toggle('active');
};

// Event Listeners
closeModalBtn.addEventListener('click', closeEnquiryModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeEnquiryModal();
});

// Bind all "Enquire Now" buttons
document.addEventListener('click', (e) => {
    const target = e.target;
    // Check if clicked element is an Enquire Now button or link
    if (target.tagName === 'A' || target.classList.contains('btn')) {
        const text = target.innerText.toLowerCase();
        if (text.includes('enquire now')) {
            openEnquiryModal(e);
        }
    }
});

// Form Submission
enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';

    const formData = new FormData(enquiryForm);
    const params = new URLSearchParams(formData);

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: params,
        mode: 'no-cors'
    })
        .then(() => {
            modalBody.style.display = 'none';
            modalFooter.style.display = 'none';
            successScreen.style.display = 'block';
        })
        .catch(error => {
            console.error('Submission error:', error);
            modalBody.style.display = 'none';
            modalFooter.style.display = 'none';
            successScreen.style.display = 'block';
        });
});

// Close mobile menu when clicking on links
document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.toggleMenu) window.toggleMenu();
    });
});
