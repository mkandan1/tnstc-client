const delayedNavigation = ( url, delay = 3000) => {
    if (!url) {
        console.error("URL is required for navigation.");
        return;
    } 

    setTimeout(() => {
        window.location.href = `${url.startsWith("/") ? url : `/${url}`}`
    }, delay);
};

export { delayedNavigation };
