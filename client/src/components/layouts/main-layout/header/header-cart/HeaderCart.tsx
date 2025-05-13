import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function HeaderCart() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='ghost'>Cart</Button>
            </SheetTrigger>

            <SheetContent>
                <Heading title='Products cart' className='text-xl' />
            </SheetContent>
        </Sheet>
    );
}
