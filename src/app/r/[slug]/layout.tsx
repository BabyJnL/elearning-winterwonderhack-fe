import SubscribeLeaveToggle from '@/components/SubscribeLeaveToggle'
import ToFeedButton from '@/components/ToFeedButton'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'OpenMinded',
	description: '',
}

const Layout = async ({
	children,
	params: { slug },
}: {
	children: ReactNode
	params: { slug: string }
}) => {
	const session = await getAuthSession()

	const community = await db.community.findFirst({
		where: { name: slug },
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	})

	const subscription = !session?.user
		? undefined
		: await db.subscription.findFirst({
				where: {
					community: {
						name: slug,
					},
					user: {
						id: session.user.id,
					},
				},
		  })

	const isSubscribed = !!subscription

	if (!community) return notFound()

	const memberCount = await db.subscription.count({
		where: {
			community: {
				name: slug,
			},
		},
	})

	return (
		<div className='max-w-7xl mx-auto h-full'>
			<div>
				<ToFeedButton />

				<div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
					<ul className='flex flex-col col-span-2 space-y-5'>
						{children}
					</ul>

					{/* info sidebar */}
					<div className='overflow-hidden h-fit border border-black order-first md:order-last shadow-[5px_5px_0px_0px] shadow-black'>
						<div className='p-5 bg-yellow-400 border-b border-black'>
							<h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-3xl line-clamp-1'>
								About r/{community.name}
							</h1>
						</div>
						<dl className='p-5 pt-0 text-sm leading-6 bg-white'>
							<div className='flex justify-between gap-x-4 py-3 border-b'>
								<dt className='text-gray-500'>Created</dt>
								<dd className='text-gray-700'>
									<time dateTime={community.createdAt.toDateString()}>
										{format(community.createdAt, 'MMMM d, yyyy')}
									</time>
								</dd>
							</div>
							<div className='flex justify-between gap-x-4 py-3 border-b'>
								<dt className='text-gray-500'>Members</dt>
								<dd className='flex items-start gap-x-2'>
									<div className='text-gray-900'>{memberCount}</div>
								</dd>
							</div>
							{community.creatorId === session?.user?.id ? (
								<div className='flex justify-between gap-x-4 py-3'>
									<dt>You created this community</dt>
								</div>
							) : null}

							{community.creatorId !== session?.user?.id ? (
								<SubscribeLeaveToggle
									isSubscribed={isSubscribed}
									communityId={community.id}
									communityName={community.name}
								/>
							) : null}
							<Link
								className={buttonVariants({
									className: 'w-full',
								})}
								href={`r/${slug}/submit`}>
								Create Post
							</Link>
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Layout
