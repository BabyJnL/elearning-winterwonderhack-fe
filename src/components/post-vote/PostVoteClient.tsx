'use client'

import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { PostVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { toast } from '../../hooks/use-toast'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostVoteClientProps {
	postId: string
	initialVotesAmt: number
	initialVote?: VoteType | null
}

const PostVoteClient = ({
	postId,
	initialVotesAmt,
	initialVote,
}: PostVoteClientProps) => {
	const { loginToast } = useCustomToasts()
	const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
	const [currentVote, setCurrentVote] = useState(initialVote)
	const prevVote = usePrevious(currentVote)

	// ensure sync with server
	useEffect(() => {
		setCurrentVote(initialVote)
	}, [initialVote])

	const { mutate: vote } = useMutation({
		mutationFn: async (type: VoteType) => {
			const payload: PostVoteRequest = {
				voteType: type,
				postId: postId,
			}

			await axios.patch('/api/community/post/vote', payload)
		},
		onError: (err, voteType) => {
			if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
			else setVotesAmt((prev) => prev + 1)

			// reset current vote
			setCurrentVote(prevVote)

			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					return loginToast()
				}
			}

			return toast({
				title: 'Something went wrong.',
				description:
					'Your vote was not registered. Please try again.',
				variant: 'destructive',
			})
		},
		onMutate: (type: VoteType) => {
			if (currentVote === type) {
				// User is voting the same way again, so remove their vote
				setCurrentVote(undefined)
				if (type === 'UP') setVotesAmt((prev) => prev - 1)
				else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
			} else {
				// User is voting in the opposite direction, so subtract 2
				setCurrentVote(type)
				if (type === 'UP')
					setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
				else if (type === 'DOWN')
					setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
			}
		},
	})

	return (
		<Button
			onClick={() => vote('UP')}
			size='sm'
			variant='subtle'
			className='flex items-center gap-x-1'>
			<Star className='w-4 h-4 fill-yellow-400' />
			{votesAmt}
		</Button>
	)
}

export default PostVoteClient
