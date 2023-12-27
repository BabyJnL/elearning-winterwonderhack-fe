import CustomFeed from '@/components/homepage/CustomFeed'
import GeneralFeed from '@/components/homepage/GeneralFeed'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Home() {
	const session = await getAuthSession()

	return (
		<>
			<h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-3xl'>
				Your feed
			</h1>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
				{/* @ts-expect-error server component */}
				{session ? <CustomFeed /> : <GeneralFeed />}

				<div className='overflow-hidden h-fit bg-white border border-black order-first md:order-last shadow-[5px_5px_0px_0px] shadow-black'>
					<div className='bg-yellow-400 p-5 border-b border-black'>
						<h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-3xl'>
							Homepage
						</h1>
					</div>
					<dl className='divide-y divide-gray-100 p-5 pt-3 text-sm leading-5 space-y-3'>
						<p>
							Your personal Platform frontpage. Come here to check in
							with your favorite communities.
						</p>

						<Link
							className={buttonVariants({
								className: 'w-full',
							})}
							href={`/r/create`}>
							Create Community
						</Link>
					</dl>
				</div>
			</div>
		</>
	)
}
