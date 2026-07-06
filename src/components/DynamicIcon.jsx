import React from 'react';
import * as Icons from 'lucide-react';

export default function DynamicIcon({ name, className, size }) {
  // Safe lookup for Lucide icons
  const IconComponent = Icons[name] || Icons.HelpCircle;
  
  return <IconComponent className={className} size={size} />;
}
