import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { LANGUAGE_VERSIONS } from '../../constants.js'
import Button from './Button.jsx'

const EditorLanguages = Object.entries(LANGUAGE_VERSIONS)

export default function Selector({language, onSelect}) {
  return (
  <div>
      <Menu as="div" className="relative inline-block text-left">
      <div className={'code-selector'}>
        <MenuButton style={{ height: '100%' }} className="selector selector-item selector-button inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          {language}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
  transition
  className="selector absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
>
        <div className="py-1">
          {
            EditorLanguages.map(([EditorLanguage, version]) => (
              <MenuItem key={EditorLanguage}
              
              >
                <a
                  onClick={() => onSelect(EditorLanguage)}
                  className="selector selector-item cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  {EditorLanguage} {version}
                </a>
              </MenuItem>
            ))
          }
        </div>
      </MenuItems>
    </Menu>
  </div>

    
  )
}
