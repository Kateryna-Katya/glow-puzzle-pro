document.addEventListener('DOMContentLoaded', () => {

    function getHeaderOffset() {
        const header = document.getElementById('site-header');
        return header ? header.offsetHeight : 0;
    }


    function smoothScrollToElement(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const offset = getHeaderOffset();
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
        });
    }


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
      
          if (href.startsWith('index.html#') || href.startsWith('http')) return;
      
          e.preventDefault();
          const targetId = href.substring(1);
          smoothScrollToElement(targetId);
        });
      });


    const hash = window.location.hash;
    if (hash) {
        const targetId = hash.substring(1);
        setTimeout(() => {
            smoothScrollToElement(targetId);
        }, 1000);
    }
});