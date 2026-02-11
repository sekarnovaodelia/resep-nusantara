/**
 * Optimizes a Supabase image URL if possible
 * @param {string} url - Original image URL
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedImageUrl = (url, { width, height, quality = 80 } = {}) => {
    if (!url) return url;

    // Check if it's a Supabase storage URL
    if (url.includes('supabase.co/storage/v1/object/public/')) {
        // Supabase supports transformations on some plans, but even if not, 
        // we can attempt to handle common patterns.
        // For now, let's assume standard URL and add common params if matched.
        // If the user's Supabase project has transformation enabled, this works:
        const urlObj = new URL(url);
        if (width) urlObj.searchParams.set('width', width);
        if (height) urlObj.searchParams.set('height', height);
        if (quality) urlObj.searchParams.set('quality', quality);
        return urlObj.toString();
    }

    // Check if it's an Unsplash URL
    if (url.includes('images.unsplash.com')) {
        const urlObj = new URL(url);
        if (width) urlObj.searchParams.set('w', width);
        if (height) urlObj.searchParams.set('h', height);
        urlObj.searchParams.set('q', quality);
        urlObj.searchParams.set('auto', 'format');
        return urlObj.toString();
    }

    return url;
};

/**
 * Preloads an array of images into browser cache
 * @param {string[]} urls - Array of image URLs to preload
 */
export const preloadImages = (urls) => {
    if (!urls || !Array.isArray(urls)) return;

    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
};
