'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserIcon from '../icons/userIcon';
import LogoutButton from '../auth/LogoutButton';

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="m-0 p-0" asChild>
        <Button variant="default">
          <UserIcon className="w-6 h-6 hover:text-yellow-600 transition-colors duration-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-2 w-56 text-[var(--text-color-primary-800)] bg-[var(--popover-text)] border-[var(--text-color-primary-400)]">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[var(--text-color-primary-400)]" />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem className="cursor-pointer">
            Profile
          </DropdownMenuItem>{' '}
          <DropdownMenuItem className="cursor-pointer">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Invoice
          </DropdownMenuItem> */}
          <DropdownMenuItem className="cursor-pointer">
            Support
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[var(--text-color-primary-400)]" />
          <DropdownMenuItem className="cursor-pointer">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
