'use client';

export default function PageContainer({ 
  children, 
  maxWidth = '1200px',
  className = '' 
}) {
  return (
    <div 
      className={`w-full px-4 md:px-20 py-8 md:py-20 ${className}`}
      style={{ maxWidth: '100%' }}
    >
      <div 
        className="mx-auto"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}