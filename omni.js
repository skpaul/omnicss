
//Sticky header. Auto hide/show on scroll.
let lastScrollTop = 0;
let scrollUpStart = null;
const header = document.querySelector("header.smart");
if (header) {
    window.addEventListener("scroll", () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;

        if (st > lastScrollTop) {
            // Scrolling down
            //hide the header only after the user scrolls down at least 100px
            if (st > 100) {
                // header.style.top = "-70px";
                header.classList.add("is-hidden");
            }
            scrollUpStart = null;
        } else {
            if (scrollUpStart === null) scrollUpStart = st;

            if (scrollUpStart - st >= 5) {
                // header.style.top = "0";
                header.classList.remove("is-hidden");
            }
        }

        lastScrollTop = st <= 0 ? 0 : st;
    });
}


//Required markup for toggleTheme() function ::
//  <button class="theme-toggle" id="themeToggle" title="Toggle Theme" onclick="toggleTheme(this)">
//       <span class="icon">🌗</span>
//  </button>

function toggleTheme(btn) {
    const root = document.documentElement;
    const themeIcon = btn.querySelector('.icon');

    const isDark = root.classList.contains('dark') ||
        (!root.classList.contains('light') &&
         window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'light' : 'dark');

    if (themeIcon) {
        themeIcon.textContent = isDark ? '🌙' : '☀️';
    }
}


// The kebab menu, also known as the three dots menu, and the three vertical dots menu, is an icon used to open a menu with additional options.
// Select all .close-menu elements once
const elements = document.querySelectorAll('.close-menu');

// Add event listeners to each .close-menu element
elements.forEach((element) => {
    element.addEventListener('click', function (event) {
        const menuContainer = event.target.closest('.action-menu');
        if (menuContainer) {
            const checkbox = menuContainer.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = false;
        }
    });
});




// Disimissable ---->
const Dismissable = (() => {
    const storageKeyPrefix = 'omni-dismissable';

    // Get current timestamp in milliseconds
    const now = () => new Date().getTime();

    // Convert days to milliseconds (for storage)
    const daysToMs = (days) => days * 24 * 60 * 60 * 1000;

    // Check if the notice should be shown
    function shouldShow(id) {
        const stored = localStorage.getItem(storageKeyPrefix + id);
        if (!stored) return true;
        try {
            const data = JSON.parse(stored);
            return now() > data.expiresAt;
        } catch (e) {
            return true; // Fail-safe: show if JSON parse fails
        }
    }

    // Save dismissed state to localStorage (now accepts days instead of ms)
    function dismiss(id, expiryDays) {
        const expiresAt = now() + daysToMs(parseInt(expiryDays || 0, 10));
        localStorage.setItem(storageKeyPrefix + id, JSON.stringify({ expiresAt }));
    }

    // Initialize all notices on the page
    function initAll() {
        document.querySelectorAll('.dismissable').forEach(notice => {
            const id = notice.id || null;
            const expiry = notice.dataset.expiry;

            if (!id) return; // Skip if no ID set

            if (shouldShow(id)) {
                notice.classList.add('show');

                // Attach event to internal dismiss button
                const dismissBtn = notice.querySelector('.dismiss');
                if (dismissBtn) {
                    dismissBtn.addEventListener('click', () => {
                        dismiss(id, expiry);
                        notice.classList.add('hide');
                        setTimeout(() => {
                            notice.style.display = 'none';
                        }, 600); // Matches CSS transition
                    });
                }
            } else {
                notice.style.display = 'none';
            }
        });
    }

    return {
        initAll,
        dismiss
    };
})();


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Dismissable.initAll();
});




// <----- dismissable