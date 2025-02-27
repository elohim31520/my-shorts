import { formatTimestamp } from '@/modules/date'

export function useReview(lotteryList = []) {
	const lotteryFilter = (code, type) => {
		const lottery = _find(lotteryList, (vo) => vo[type] == code)
		return _get(lottery, 'name', '')
	}

	const formatData = (dataList, type) => {
		return _map(dataList, (item) => {
			const baseData = {
				commentContent: item.postContent,
			}

			if (type === 'gallery') {
				return {
					...baseData,
					isMain: !item.replyPost,
					mainId: _get(item, 'issueDTO.issueId', ''),
					mainTitle: item.replyPost
						? _get(item, 'replyPost.postContent', '')
						: _get(item, 'issueDTO.newspaperName', ''),
					mainCreateTime: formatTimestamp(
						_get(item, 'issueDTO.createTime', ''),
						'yyyy-MM-dd HH:mm'
					),
					mainGameTypeName: lotteryFilter(item.issueDTO?.gameType, 'code'),
					mainAuthor: {
						userId: _get(item, 'replyPost.postUserId', ''),
						avatar:
							item.replyPost?.avatar || '/public-assets/images/svg/58.svg',
						name: item.replyPost?.nickname || '论坛管理',
						imgPath: item.replyPost
							? _get(item, 'replyPost.attachmentList[0].attachmentUrl', '')
							: _get(item, 'issueDTO.imgPath', ''),
					},
					bbsId: '',
					me: {
						avatar: item.avatar,
						imgPath: _get(item, 'attachmentList[0].attachmentUrl', ''),
					},
				}
			}

			if (type === 'forum') {
				return {
					...baseData,
					isMain: item.mainPostContent == item.postContent1,
					mainId: item.mainPostId,
					mainTitle: item.postContent1,
					mainCreateTime: formatTimestamp(
						item.mainPostTime,
						'yyyy-MM-dd HH:mm'
					),
					mainGameTypeName: lotteryFilter(item.postGametypeRef, 'key'),
					mainAuthor: {
						userId: item.postUserId1,
						avatar: item.avatar1,
						name: item.nickname1,
						imgPath: _get(item, 'attachments1[0].url', ''),
					},
					bbsId: item.bbsId,
					me: {
						avatar: item.avatar,
						imgPath: _get(item, 'attachments[0].url', ''),
					},
				}
			}

			return baseData
		})
	}
	return {
		formatData,
	}
}
