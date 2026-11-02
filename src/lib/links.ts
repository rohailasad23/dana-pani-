import { site } from "@/content/site";

export const telHref = `tel:${site.phone.tel}`;
export const whatsappHref = (text?: string) =>
  `https://wa.me/${site.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.maps.query)}`;
export const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.maps.query)}&z=16&output=embed`;
export const fullAddress = `${site.address.plusCode}, ${site.address.street}, ${site.address.area}, ${site.address.city}, ${site.address.countryName}`;
