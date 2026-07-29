import { useEffect } from 'react';

/**
 * SEO Helper Component to update document head dynamically
 * @param {Object} props
 * @param {string} props.title - Dynamic Page Title
 * @param {string} props.description - Dynamic Meta Description
 * @param {string} [props.keywords] - Dynamic Meta Keywords
 * @param {string} [props.canonical] - Dynamic Canonical Link URL
 * @param {string} [props.ogImage] - Open Graph Image URL
 * @param {string} [props.ogType] - Open Graph Type (website/article)
 * @param {Object} [props.jsonLd] - JSON-LD Schema Object
 */
export default function SEO({
  title = 'PRS Dental Care | Top Dental Clinic in Kolathur, Chennai',
  description = 'PRS Dental Care offers professional dental services in Kolathur, Chennai. Book online for painless root canal, implants, laser whitening & pediatric care.',
  keywords = 'Dental clinic in Kolathur, Dentist in Kolathur Chennai, Root canal treatment Kolathur, Dental implants Chennai, Teeth whitening, PRS Dental Care',
  canonical = 'https://prsdentalcare.com/',
  ogImage = 'https://prsdentalcare.com/Images/Hero%20Section%20Image.webp',
  ogType = 'website',
  jsonLd = null,
}) {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper function to update or create meta tags
    const setMetaTag = (nameAttr, nameValue, contentValue) => {
      let element = document.querySelector(`meta[${nameAttr}="${nameValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, nameValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Standard Meta
    setMetaTag('name', 'description', description);
    if (keywords) setMetaTag('name', 'keywords', keywords);

    // Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'PRS Dental Care');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // JSON-LD Script Injection
    const scriptId = 'dynamic-jsonld-schema';
    let scriptTag = document.getElementById(scriptId);

    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clean up dynamic json-ld script on unmount
      const existingTag = document.getElementById(scriptId);
      if (existingTag) {
        existingTag.remove();
      }
    };
  }, [title, description, keywords, canonical, ogImage, ogType, jsonLd]);

  return null;
}
