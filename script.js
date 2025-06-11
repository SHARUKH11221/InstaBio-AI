document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Functionality (Runs on ALL pages) ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    if (menuBtn && mobileMenu && closeBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('open');
        });

        closeBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
        
        // Close menu when a link is clicked
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }


    // ==========================================================
    //  START OF THE FIX
    // ==========================================================

    // --- Bio Generator Functionality (ONLY runs if these elements exist) ---
    const generateBtn = document.getElementById('generateBtn');
    
    // This 'if' block is the key. The code inside will only execute
    // if 'generateBtn' is found on the current page (i.e., index.html).
    if (generateBtn) {
        const userInput = document.getElementById('userInput');
        const bioOutput = document.getElementById('bio-output');
        const loader = document.querySelector('.loader-container');

        generateBtn.addEventListener('click', generateBios);

        async function generateBios() {
            const userDescription = userInput.value.trim();
            
            if (!userDescription) {
                bioOutput.innerHTML = `<p class="placeholder-text" style="color: #ff4d4d;">Please describe yourself in the box above.</p>`;
                return;
            }

            loader.style.display = 'flex';
            bioOutput.innerHTML = '';
            bioOutput.appendChild(loader);

            const OPENROUTER_API_KEY = "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";
            const prompt = `Based on the following description, generate 5 creative, professional, and unique Instagram bios. Each bio must be short, engaging, and include relevant emojis. Each bio should be on a new line and no more than 150 characters.

Description: "${userDescription}"

Generated Bios:`;

            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": location.href, 
                        "X-Title": document.title 
                    },
                    body: JSON.stringify({
                        "model": "openai/gpt-3.5-turbo", 
                        "messages": [
                            { "role": "user", "content": prompt }
                        ]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("API Error Details:", errorData);
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                const rawBios = data.choices[0].message.content;
                
                loader.style.display = 'none';
                displayBios(rawBios);

            } catch (error) {
                console.error("Error generating bios:", error);
                loader.style.display = 'none';
                bioOutput.innerHTML = `<p class="placeholder-text" style="color: #ff4d4d;">Sorry, an error occurred. Please check the console for details and try again later.</p>`;
            }
        }

        function displayBios(rawText) {
            bioOutput.innerHTML = ''; 
            const biosArray = rawText.split('\n').filter(bio => bio.trim() !== '');

            if(biosArray.length === 0) {
                bioOutput.innerHTML = `<p class="placeholder-text">The AI couldn't generate bios from your description. Try being more specific.</p>`;
                return;
            }

            biosArray.forEach(bio => {
                const cleanBio = bio.replace(/^[\d-.]+\s*/, '').trim();
                const card = document.createElement('div');
                card.className = 'bio-card';
                const bioText = document.createElement('p');
                bioText.textContent = cleanBio;
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';

                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(cleanBio).then(() => {
                        copyBtn.textContent = 'Copied!';
                        copyBtn.classList.add('copied');
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
                            copyBtn.classList.remove('copied');
                        }, 2000);
                    });
                });

                card.appendChild(bioText);
                card.appendChild(copyBtn);
                bioOutput.appendChild(card);
            });
        }
    } // <-- The closing bracket for the 'if (generateBtn)' block
    // ==========================================================
    //  END OF THE FIX
    // ==========================================================
});