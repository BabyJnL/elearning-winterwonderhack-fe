import { Editor } from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface pageProps {
	params: {
		slug: string
	}
}

const page = async ({ params }: pageProps) => {
	const community = await db.community.findFirst({
		where: {
			name: params.slug,
		},
	})

	if (!community) return notFound()

	return (
		<div className='flex flex-col items-start gap-6'>
			{/* heading */}
			<div>
				<h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-3xl'>
					Create Post in r/{params.slug}
				</h1>
			</div>

			{/* form */}
			<Editor communityId={community.id} />

			<div className='w-full flex justify-end'>
				<Button
					type='submit'
					className='w-full'
					form='community-post-form'>
					Post
				</Button>
			</div>
		</div>
	)
}

export default page
