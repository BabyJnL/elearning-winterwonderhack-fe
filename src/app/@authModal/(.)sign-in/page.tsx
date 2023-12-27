import CloseModal from '@/components/CloseModal'
import SignIn from '@/components/SignIn'
import { FC } from 'react'

const page: FC = () => {
	return (
		<div className='fixed inset-0 bg-zinc-900/20 z-10'>
			<div className='container flex items-center h-full max-w-lg mx-auto'>
				<div className='relative bg-white border border-black w-full h-fit py-20 px-2 shadow-[5px_5px_0px_0px] shadow-black'>
					<div className='absolute top-4 right-4'>
						<CloseModal />
					</div>

					<SignIn />
				</div>
			</div>
		</div>
	)
}

export default page
