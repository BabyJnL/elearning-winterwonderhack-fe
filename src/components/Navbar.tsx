import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/Button'
import { UserAccountNav } from './UserAccountNav'
import SearchBar from './SearchBar'

const Navbar = async () => {
	const session = await getServerSession(authOptions)
	return (
		<div className='fixed top-0 inset-x-0 h-fit z-[10] py-3 border-b border-black bg-white'>
			<div className='container max-w-6xl h-full mx-auto flex items-center justify-between gap-2'>
				{/* logo */}
				<Link
					href='/'
					className='flex gap-2 items-center'>
					<Icons.logo className='h-8 w-8 sm:h-10 sm:w-10' />
					<p className='hidden text-zinc-700 text-sm font-semibold md:block'>
						Platform
					</p>
				</Link>

				{/* search bar */}
				<SearchBar />

				{/* actions */}
				{session?.user ? (
					<UserAccountNav user={session.user} />
				) : (
					<Link
						href='/sign-in'
						className={buttonVariants()}>
						Sign In
					</Link>
				)}
			</div>
		</div>
	)
}

export default Navbar
