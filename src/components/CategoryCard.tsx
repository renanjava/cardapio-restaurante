import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  imageUrl?: string;
  delay?: number;
}

export function CategoryCard({ title, description, icon: Icon, href, imageUrl, delay = 0 }: CategoryCardProps) {
  return (
    <Link
      to={href}
      className="group block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-card shadow-card card-hover h-64">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 gradient-warm opacity-80" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/90 via-brown-dark/40 to-transparent" />
        
        <div className="relative h-full flex flex-col justify-end p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
          <p className="text-primary-foreground/80 text-sm">{description}</p>
          
          <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
