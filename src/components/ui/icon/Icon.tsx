// src/components/ui/Icon.tsx
import React from 'react'

interface IconProps {
    name: string
    className?: string
    size?: number
}

const Icon: React.FC<IconProps> = ({ name, className = '', size = 20 }) => {
    const getIconPath = (iconName: string) => {
        switch (iconName) {
            case 'chevron-down':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                )
            case 'chevron-up':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                    />
                )
            // Tambahkan icon lain sesuai kebutuhan
            default:
                return null
        }
    }

    return (
        <svg
            className={className}
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            {getIconPath(name)}
        </svg>
    )
}

export default Icon


// import Icon from '@/components/ui/Icon'
// 
// // Ganti ChevronDownIcon dengan:
// <Icon
//     name="chevron-down"
//     className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
//             openSubmenu?.index === index
//             ? "rotate-180 text-brand-500"
//             : ""
//         }`}
// />