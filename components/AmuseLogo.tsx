import React from 'react'

interface AmuseLogoProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function AmuseLogo ({ size = 'md' }: AmuseLogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  }


  return (
    <div className={sizeClasses[size]}>
        <img 
          src="/amuse_logo.png" 
          alt="AmuseApp Logo" 
          className="w-full h-full object-contain"
        />
    </div>
  )
}

