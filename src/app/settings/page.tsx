import { redirect } from 'next/navigation'

import { UserNameForm } from '@/components/UserNameForm'
import { authOptions, getAuthSession } from '@/lib/auth'
import { Checkbox } from '@/components/ui/CheckBox'
export const metadata = {
	title: 'Settings',
	description: 'Manage account and website settings.',
}

export default async function SettingsPage() {
	const session = await getAuthSession()

	if (!session?.user) {
		redirect(authOptions?.pages?.signIn || '/login')
	}

	return (
		<div className='flex flex-col h-full max-w-7xl mx-auto'>
			<h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-3xl'>
				Settings
			</h1>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
				<UserNameForm
					className='relative bg-white border border-black shadow-[5px_5px_0px_0px] shadow-black h-fit p-4 space-y-6 col-span-2'
					user={{
						id: session.user.id,
						username: session.user.username || '',
					}}
				/>
				<div className='overflow-hidden h-fit col-span-1 bg-white border border-black shadow-[5px_5px_0px_0px] shadow-black order-first md:order-last'>
					<div className='bg-yellow-400 p-5 border-b border-black'>
						<h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-3xl'>
							Terms and Agreement
						</h1>
					</div>
					<dl className='p-5 pt-3 text-sm leading-5 space-y-3'>
						<p className='text-zinc-500 '>
							You must agree with this agreement changing your
							username.
						</p>

						<ul className='ml-3 list-disc'>
							<li>
								<h1 className='font-semibold'>Privacy</h1>
								<p className='font-light'>
									Do not share personal information without consent.
								</p>
							</li>
							<li>
								<h1 className='font-semibold'>Respectful Conduct</h1>
								<p className='font-light'>
									No bad words. Engage in positive and respectful
									interactions with others.
								</p>
							</li>
						</ul>
					</dl>
				</div>
			</div>
		</div>
	)
}
