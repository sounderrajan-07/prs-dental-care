import React from 'react';

export default function LocationSection() {
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.6791638210344!2d80.20988637507914!3d13.125792987199144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264ff6e52ad51%3A0x8bb85a1e27a7cbb0!2sJambulingam%20Main%20Rd%2C%20Kolathur%2C%20Chennai%2C%20Tamil%20Nadu%20600082!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";
  const googleMapsDirectionsUrl = "https://maps.google.com/?q=No+59/14,+Jambulingam+main+road,+Annai+Anjugam+Nagar,+G.K.M+Colony,+Chennai+-+600082";

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-outline-variant/20 clinical-shadow overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Map Embed Column */}
        <div className="lg:col-span-7 h-80 lg:h-full min-h-[340px] relative">
          <iframe
            title="PRS Dental Care Location Map"
            src={mapEmbedUrl}
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-5 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full bg-surface-container-highest text-primary font-bold text-xs uppercase tracking-wider mb-3">
              Visit Our Clinic
            </span>
            <h3 className="text-2xl font-extrabold text-primary mb-3 font-display">
              Conveniently Located in Kolathur, Chennai
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Located right on Jambulingam Main Road in GKM Colony, our modern clinic features state-of-the-art sterilization and ample parking space.
            </p>
          </div>

          {/* Address Details */}
          <div className="space-y-3 pt-2 border-t border-outline-variant/15 text-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">
                location_on
              </span>
              <div>
                <strong className="text-on-surface block font-bold">Address</strong>
                <span className="text-on-surface-variant text-xs">
                  No 59/14, Jambulingam main road, Annai Anjugam Nagar, G.K.M Colony, Kolathur, Chennai - 600082
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-xl flex-shrink-0 mt-0.5">
                schedule
              </span>
              <div>
                <strong className="text-on-surface block font-bold">Working Hours</strong>
                <span className="text-on-surface-variant text-xs block">
                  Mon - Sat: 10:00 AM - 1:00 PM & 5:00 PM - 9:00 PM
                </span>
                <span className="text-secondary text-xs font-bold block">
                  Sunday: 10:00 AM - 1:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Amenities & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-high text-primary font-semibold text-[11px] rounded-lg">
              <span className="material-symbols-outlined text-xs">local_parking</span> Free Parking
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-high text-primary font-semibold text-[11px] rounded-lg">
              <span className="material-symbols-outlined text-xs">accessible</span> Wheelchair Accessible
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-high text-primary font-semibold text-[11px] rounded-lg">
              <span className="material-symbols-outlined text-xs">ac_unit</span> Fully Air Conditioned
            </span>
          </div>

          {/* Action Button */}
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">near_me</span>
            Get Directions on Google Maps
          </a>

        </div>

      </div>
    </section>
  );
}
