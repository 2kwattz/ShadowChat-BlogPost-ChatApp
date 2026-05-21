# Current Implementation

### Security

#### Added SQL Injection Guard middleware to detect and block SQL Injection and log attacker's IP Address
#### Created custom XSS Cleanup utility to sanitize requests before proceeding
#### Added protection against Clickjacking, Basic XSS, MIME Sniffing Protection, Content Security Policy (CSP)
#### Added custom rate limiting for login, registration and other pages depending upon the sensitivity
#### Spoofed Headers to mimic random servers & tech

### Email Sending

#### Created a Custom Email Sender function using Resend for email sending
#### Added templates for onboarding and email verification with onboarding successfully triggering on POST Register

### Routes

#### Server side validations & Onboarding email sending implemented on POST/ Register

### Basic Configurations

#### Added MySQL connection, Dotenv for API Keys,Conn details, Custom Error Middleware etc, 
