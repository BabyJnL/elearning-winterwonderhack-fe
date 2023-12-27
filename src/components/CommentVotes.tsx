'use client'
import { Button } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { cn } from '@/lib/utils'
import { CommentVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp, Star } from 'lucide-react'
import { FC, useState } from 'react'

interface CommentVotesProps {
	commentId: string
	votesAmt: number
	currentVote?: PartialVote
}

type PartialVote = Pick<CommentVote, 'type'>

const CommentVotes: FC<CommentVotesProps> = ({
	commentId,
	votesAmt: _votesAmt,
	currentVote: _currentVote,
}) => {
	const { loginToast } = useCustomToasts()
	const [votesAmt, setVotesAmt] = useState<number>(_votesAmt)
	const [currentVote, setCurrentVote] = useState<
		PartialVote | undefined
	>(_currentVote)
	const prevVote = usePrevious(currentVote)

	const { mutate: vote } = useMutation({
		mutationFn: async (type: VoteType) => {
			const payload: CommentVoteRequest = {
				voteType: type,
				commentId,
			}

			await axios.patch('/api/community/post/comment/vote', payload)
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
			if (currentVote?.type === type) {
				// User is voting the same way again, so remove their vote
				setCurrentVote(undefined)
				if (type === 'UP') setVotesAmt((prev) => prev - 1)
				else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
			} else {
				// User is voting in the opposite direction, so subtract 2
				setCurrentVote({ type })
				if (type === 'UP')
					setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
				else if (type === 'DOWN')
					setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
			}
		},
	})

	return (
		<div className='flex gap-1'>
			<Button
				onClick={() => vote('UP')}
				size='xs'
				variant='ghost'
				className='flex items-center gap-x-1'>
				<Star className='w-4 h-4 fill-yellow-400' />
				{votesAmt}
			</Button>
		</div>
	)
}

export default CommentVotes
