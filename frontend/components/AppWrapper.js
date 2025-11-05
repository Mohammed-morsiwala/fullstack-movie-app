'use client';

export default function AppWrapper({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-[#093545] ${className}`}>
      {children}
    </div>
  );
}