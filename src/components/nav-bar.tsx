import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { SidebarTrigger } from './ui/sidebar'
import { ModeToggle } from './toggle-button'

export default function NavBar() {
    return (
        <header>
            <nav >
                <ul className="flex items-center justify-between w-full pr-4 border-b-2 p-2">
                    <SidebarTrigger />
                    <div className='flex items-center gap-4 '>
                        <ModeToggle />
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </ul>
            </nav>
        </header>
    )
}
