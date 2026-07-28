import React from 'react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ service, onSelect }) {
  const { id, title, category, description, image, features, tag } = service;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-outline-variant/30 clinical-shadow group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Service Image Container */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-surface-container-low">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-60"></div>
          {tag && (
            <span className="absolute top-3 right-3 bg-secondary-container text-on-secondary-container font-bold text-xs px-3 py-1 rounded-full shadow-sm">
              {tag}
            </span>
          )}
          <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-primary font-bold text-xs px-2.5 py-1 rounded-lg">
            {category}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
            {description}
          </p>

          {/* Features check list */}
          {features && (
            <ul className="space-y-2 mb-4">
              {features.map((feat, index) => (
                <li key={index} className="flex items-center gap-2 text-xs font-semibold text-on-surface">
                  <span className="material-symbols-outlined text-success-teal text-base">check_circle</span>
                  {feat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 pt-0 flex items-center justify-between border-t border-outline-variant/10 mt-auto">
        <button
          onClick={() => onSelect && onSelect(service)}
          className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
        >
          View Full Details
          <span className="material-symbols-outlined text-base">info</span>
        </button>

        <Link
          to={`/book-appointment?service=${encodeURIComponent(title)}`}
          className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
        >
          Book Treatment
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
