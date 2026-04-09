const contactForm = document.getElementById('contactForm');
const responseMsg = document.getElementById('responseMessage');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Redirect-ah thadukkum

    // Loading State
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json' 
            }
        });

        if (response.ok) {
            // Success Message kaattum
            responseMsg.textContent = "Your message has been sent successfully!";
            responseMsg.className = "form-response success";
            responseMsg.style.display = "block";
            contactForm.reset(); 
        } else {
            throw new Error();
        }
    } catch (err) {
        // Error Message
        responseMsg.textContent = "Oops! Something went wrong. Please try again.";
        responseMsg.className = "form-response error";
        responseMsg.style.display = "block";
    } finally {
        // Button Reset
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        
        // 6 seconds kalichu message maraiyum
        setTimeout(() => {
            responseMsg.style.opacity = '0';
            setTimeout(() => { 
                responseMsg.style.display = 'none'; 
                responseMsg.style.opacity = '1'; 
            }, 500);
        }, 6000);
    }
});