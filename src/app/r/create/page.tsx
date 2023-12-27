'use client'

import { Button, buttonVariants } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/hooks/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { CreateCommunityPayload } from '@/lib/validators/community'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/CheckBox'
import { Label } from '@/components/ui/Label'

const Page = () => {
	const router = useRouter()
	const [input, setInput] = useState<string>('')
	const [terms, setTerms] = useState<boolean>(false)

	const { loginToast } = useCustomToasts()

	const { mutate: createCommunity, isLoading } = useMutation({
		mutationFn: async () => {
			const payload: CreateCommunityPayload = {
				name: input,
			}

			const { data } = await axios.post('/api/community', payload)
			return data as string
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 409) {
					return toast({
						title: 'Community already exists.',
						description: 'Please choose a different name.',
						variant: 'destructive',
					})
				}

				if (err.response?.status === 422) {
					return toast({
						title: 'Invalid community name.',
						description:
							'Please choose a name between 3 and 21 letters.',
						variant: 'destructive',
					})
				}

				if (err.response?.status === 401) {
					return loginToast()
				}
			}

			toast({
				title: 'There was an error.',
				description: 'Could not create community.',
				variant: 'destructive',
			})
		},
		onSuccess: (data) => {
			router.push(`/r/${data}`)
		},
	})

	return (
		<div className='flex flex-col h-full max-w-7xl mx-auto'>
			<h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-3xl'>
				Create a Community
			</h1>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
				<div className='relative bg-white border border-black shadow-[5px_5px_0px_0px] shadow-black col-span-2 h-fit p-4 space-y-6'>
					<div>
						<p className='text-sm font-medium'>Name</p>
						<p className='text-xs pb-2'>
							Community names including capitalization cannot be
							changed.
						</p>
						<div className='relative'>
							<p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
								r/
							</p>
							<Input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								className='pl-6 rounded-none border border-black focus-visible:ring-0'
							/>
						</div>
					</div>

					<div className='flex justify-end gap-2'>
						<Button
							disabled={isLoading}
							variant='subtle'
							onClick={() => router.back()}>
							Cancel
						</Button>
						<Button
							isLoading={isLoading}
							disabled={input.length === 0 || !terms}
							onClick={() => createCommunity()}>
							Create Community
						</Button>
					</div>
				</div>
				<div className='overflow-hidden h-fit col-span-1 bg-white border border-black shadow-[5px_5px_0px_0px] shadow-black order-first md:order-last'>
					<div className='bg-yellow-400 p-5 border-b border-black'>
						<h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-3xl'>
							Terms and Agreement
						</h1>
					</div>
					<dl className='p-5 pt-3 text-sm leading-5 space-y-3'>
						<p className='text-zinc-500 '>
							You must agree with this agreement before creating a
							commuinity.
						</p>

						<ul className='ml-3 list-disc'>
							<li>
								<h1 className='font-semibold'>
									No Spam or Advertising
								</h1>
								<p className='font-light'>
									Refrain from spamming and ensure relevant
									advertising.
								</p>
							</li>
							<li>
								<h1 className='font-semibold'>Content Guidelines</h1>
								<p className='font-light'>
									Avoid posting offensive or illegal content.
								</p>
							</li>
						</ul>
						<div className='flex items-center gap-x-2'>
							<Checkbox
								checked={terms}
								onClick={() => setTerms(!terms)}
							/>{' '}
							<span className='font-semibold'>
								I agree with that terms.
							</span>
						</div>
					</dl>
				</div>
			</div>
		</div>
	)
}

export default Page
