'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { UsernameValidator } from '@/lib/validators/username'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { Checkbox } from './ui/CheckBox'

interface UserNameFormProps
	extends React.HTMLAttributes<HTMLFormElement> {
	user: Pick<User, 'id' | 'username'>
}

type FormData = z.infer<typeof UsernameValidator>

export function UserNameForm({
	user,
	className,
	...props
}: UserNameFormProps) {
	const router = useRouter()
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(UsernameValidator),
		defaultValues: {
			name: user?.username || '',
		},
	})

	const [terms, setTerms] = React.useState<boolean>(false)

	const { mutate: updateUsername, isLoading } = useMutation({
		mutationFn: async ({ name }: FormData) => {
			const payload: FormData = { name }

			const { data } = await axios.patch(`/api/username/`, payload)
			return data
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 409) {
					return toast({
						title: 'Username already taken.',
						description: 'Please choose another username.',
						variant: 'destructive',
					})
				}
			}

			return toast({
				title: 'Something went wrong.',
				description:
					'Your username was not updated. Please try again.',
				variant: 'destructive',
			})
		},
		onSuccess: () => {
			toast({
				description: 'Your username has been updated.',
			})
			router.refresh()
		},
	})

	return (
		<form
			className={cn(className)}
			onSubmit={handleSubmit((e) => updateUsername(e))}
			{...props}>
			<div>
				<p className='text-sm font-medium'>Your username</p>
				<p className='text-xs pb-2'>
					Please enter a display name you are comfortable with.
				</p>
				<div className='relative'>
					<p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
						u/
					</p>
					<Label
						className='sr-only'
						htmlFor='name'>
						Name
					</Label>
					<Input
						id='name'
						className='w-full pl-6 focus-visible:ring-0 rounded-none border border-black'
						size={32}
						{...register('name')}
					/>
				</div>
				{errors?.name && (
					<p className='mt-2 text-xs text-red-600'>
						{errors.name.message}
					</p>
				)}
				<div className='flex items-center gap-x-2 mt-3'>
					<Checkbox
						checked={terms}
						onClick={() => setTerms(!terms)}
					/>{' '}
					<span className='font-semibold text-sm'>
						I agree with that terms.
					</span>
				</div>
			</div>
			<div className='flex justify-end gap-2'>
				<Button
					isLoading={isLoading}
					disabled={!terms}>
					Change name
				</Button>
			</div>
		</form>
	)
}
