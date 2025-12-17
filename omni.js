// Dark/Light theme toggle  [currently deprecated]
// document.getElementById('themeToggle').addEventListener('click', () => {
//     const html = document.documentElement;
//     const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
//     html.setAttribute('data-theme', newTheme);
//     localStorage.setItem('theme', newTheme);
// });


//Sticky header. Auto hide/show on scroll.
let lastScrollTop = 0;
let scrollUpStart = null;
const header = document.querySelector("header.smart");

window.addEventListener("scroll", () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > lastScrollTop) {
        // Scrolling down
        //hide the header only after the user scrolls down at least 100px
        if (st > 100) {
            header.style.top = "-70px";
        }
        scrollUpStart = null;
    } else {
        if (scrollUpStart === null) scrollUpStart = st;

        if (scrollUpStart - st >= 5) {
        header.style.top = "0";
        }
    }

    lastScrollTop = st <= 0 ? 0 : st;
});


// Toggle Menus
const hamburgerIcon = document.getElementById("hamburgerIcon");
const candyIcon = document.getElementById("candyIcon");

if(hamburgerIcon) hamburgerIcon.addEventListener("click", () => toggleMenu('leftMenuContent', true));
if (candyIcon) candyIcon.addEventListener("click", () => toggleMenu('rightMenuContent', true));

function toggleMenu1(id, show) {
const el = document.getElementById(id);
if (show) {
    el.classList.add("show");
} else {
    el.classList.remove("show");
}
}

let scrollY = 0;

function toggleMenu(id, show) {
    const el = document.getElementById(id);

    if (show) {
        el.classList.add("show");

        scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
        document.body.classList.add("menu-open");
    } else {
        el.classList.remove("show");

        const leftOpen = document.getElementById("leftMenuContent").classList.contains("show");
        const rightOpen = document.getElementById("rightMenuContent").classList.contains("show");

        if (!leftOpen && !rightOpen) {
        document.body.classList.remove("menu-open");
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
        }
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
// const Dismissable = (() => {
//     const storageKeyPrefix = 'omni-dismissable';
  
//     // Get current timestamp in milliseconds
//     const now = () => new Date().getTime();
  
//     // Check if the notice should be shown
//     function shouldShow(id) {
//       const stored = localStorage.getItem(storageKeyPrefix + id);
//       if (!stored) return true;
//       try {
//         const data = JSON.parse(stored);
//         return now() > data.expiresAt;
//       } catch (e) {
//         return true; // Fail-safe: show if JSON parse fails
//       }
//     }
  
//     // Save dismissed state to localStorage
//     function dismiss(id, expiryMs) {
//       const expiresAt = now() + parseInt(expiryMs || 0, 10);
//       localStorage.setItem(storageKeyPrefix + id, JSON.stringify({ expiresAt }));
//     }
  
//     // Initialize all notices on the page
//     function initAll() {
//       document.querySelectorAll('.dismissable').forEach(notice => {
//         const id = notice.id || null;
//         const expiry = notice.dataset.expiry;
  
//         if (!id) return; // Skip if no ID set
  
//         if (shouldShow(id)) {
//           notice.classList.add('show');
  
//           // Attach event to internal dismiss button
//           const dismissBtn = notice.querySelector('.dismiss');
//           if (dismissBtn) {
//             dismissBtn.addEventListener('click', () => {
//               dismiss(id, expiry);
//               notice.classList.add('hide');
//               setTimeout(() => {
//                 notice.style.display = 'none';
//               }, 600); // Matches CSS transition
//             });
//           }
//         } else {
//           notice.style.display = 'none';
//         }
//       });
//     }
  
//     return {
//       initAll,
//       dismiss
//     };
//   })();
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    Dismissable.initAll();
  });
  



// <----- dismissable