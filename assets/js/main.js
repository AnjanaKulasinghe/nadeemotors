// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function () {
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            if (mobileOverlay) {
                mobileOverlay.classList.toggle('active');
            }
            // Prevent body scroll when menu is open
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking overlay
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function () {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close mobile menu when clicking a nav link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                if (mobileOverlay) {
                    mobileOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle form submissions
    document.querySelectorAll('.contact-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            // Get form data
            const formData = new FormData(this);

            // Submit to FormSubmit
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        // Show success message
                        const successDiv = document.createElement('div');
                        successDiv.style.cssText = `
                        background-color: #d4edda;
                        border: 1px solid #c3e6cb;
                        color: #155724;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        text-align: center;
                        animation: fadeIn 0.5s ease-out;
                    `;
                        successDiv.innerHTML = `
                        <i class="fas fa-check-circle" style="font-size: 32px; color: #28a745; margin-bottom: 10px;"></i>
                        <h4 style="margin: 10px 0; color: #155724;">Thank You!</h4>
                        <p style="margin: 0; color: #155724;">Your message has been sent successfully. We'll get back to you soon.</p>
                    `;

                        // Replace form with success message
                        this.style.display = 'none';
                        this.parentElement.insertBefore(successDiv, this);

                        // Reset form
                        this.reset();

                        // Show form again after 5 seconds
                        setTimeout(() => {
                            successDiv.remove();
                            this.style.display = 'block';
                            submitButton.disabled = false;
                            submitButton.innerHTML = originalButtonText;
                        }, 5000);
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    // Show error message
                    const errorDiv = document.createElement('div');
                    errorDiv.style.cssText = `
                    background-color: #f8d7da;
                    border: 1px solid #f5c6cb;
                    color: #721c24;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    text-align: center;
                `;
                    errorDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i> 
                    Something went wrong. Please try again or call us directly.
                `;
                    this.parentElement.insertBefore(errorDiv, this);

                    // Re-enable button
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;

                    // Remove error message after 5 seconds
                    setTimeout(() => errorDiv.remove(), 5000);
                });
        });
    });
});
