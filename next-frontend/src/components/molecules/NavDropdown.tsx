'use client';

import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { INDICATOR_SUB_ITEMS } from '@/constants/nav';

export default function NavDropdown() {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className="inline-flex items-center gap-1 font-medium text-gray-800 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md px-2 py-1"
            aria-expanded={open}
            aria-haspopup="true"
          >
            Indicators
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-20 mt-3 w-56 rounded-xl bg-white p-3 shadow-lg ring-1 ring-gray-200">
              <div className="space-y-1">
                {INDICATOR_SUB_ITEMS.map(({ title, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset"
                  >
                    {title}
                  </Link>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
} 