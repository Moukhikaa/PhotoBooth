document.addEventListener('DOMContentLoaded', () => { 
    const homeStart = document.querySelector('#home-start')
    const welcomeStart = document.querySelector('#welcome-start')
    const homeNavLinks = document.querySelectorAll('.home-nav');

    // const resultHome = document.querySelector('#home-btn')

    if (homeStart) {
        homeStart.addEventListener('click', (e) => {
            e.preventDefault()
            window.location.href = 'welcome.html'
        })
    }

    if (welcomeStart) {
        welcomeStart.addEventListener('click', (e) => {
            e.preventDefault()
            window.location.href = 'canvas.html'
        })
    }

    homeNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
          
          const linkText = link.textContent.trim()
          
          switch(linkText) {
              case 'home':
                  window.location.href = 'index.html';
                  break;
              case 'about':
                  window.location.href = 'about.html';
                  break;
              case 'privacy policy':
                  window.location.href = 'privacy.html';
                  break;
              default:
                  alert('No navigation defined for this link');
            }
        });
    });

    // if (resultHome) {
    //     resultHome.addEventListener('click', (e) => {
    //         e.preventDefault()
    //         window.location.href = 'index.html'
    //     })
    // }
})