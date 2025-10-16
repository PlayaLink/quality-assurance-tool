import { 
  Camera, 
  Plus, 
  Search, 
  Home, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  X,
  Check,
  Upload,
  Image as ImageIcon,
  Package,
  Hash
} from 'lucide-react'

interface IconProps {
  name: string
  size?: number
  className?: string
  dataTestId?: string
  dataReferenceId?: string
}

const iconMap = {
  camera: Camera,
  plus: Plus,
  search: Search,
  home: Home,
  settings: Settings,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  x: X,
  check: Check,
  upload: Upload,
  image: ImageIcon,
  package: Package,
  hash: Hash
}

export const Icon = ({ 
  name, 
  size = 24, 
  className = '', 
  dataTestId,
  dataReferenceId 
}: IconProps) => {
  const IconComponent = iconMap[name as keyof typeof iconMap]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <IconComponent 
      size={size} 
      className={className}
      data-testid={dataTestId}
      data-referenceid={dataReferenceId}
    />
  )
}
