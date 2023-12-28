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
					<Icons.logo
						width={30}
						height={30}
					/>
					<p className='hidden text-zinc-900 text-md font-bold leading-tight tracking-tighter md:block'>
						OpenMinded
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
