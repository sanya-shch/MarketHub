import { HeaderMenu } from './HeaderMenu';
import { Logo } from './Logo';
import { SearchInput } from './SearchInput';

export function Header() {
    return (
        <div className='p-5 gap-x-4 h-full flex items-center bg-white border-b'>
            <Logo />

            <div className='ml-auto hidden w-[40%] lg:block'>
                <SearchInput />
            </div>

            <HeaderMenu />
        </div>
    );
}
