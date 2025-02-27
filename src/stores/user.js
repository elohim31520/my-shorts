import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useUserStore = defineStore(
	'user',
	() => {
		const data = ref({
			token: null,
			refreshToken: null,
			anonymousToken: null, // 聊天室、語音房用的臨時token
			avatar: null,
			userId: null,
			nickname: null,
			fansCount: 0, //粉丝数量
			followCount: 0, //关注数量
			friendCount: 0, //好友數量(熱度人氣)
			likeCount: 0, //点赞数量
			collectCount: 0, //收藏数量
			acquireLikeCount: 0, //获得喜欢数
			acquireFavoriteCount: 0, //获得收藏数
			vipLevel: 0, //vip等级
			userLevel: 0, //用户层级
			talent: 0, //是否牛人  0：否  1：是
			tags: null, //我的標籤
			userMemo: null, //我的備註
			viewCount: 0, //瀏覽記錄
			talent: null, //
			myPromotionCodeList: [], //邀請碼
			mobile: null,
		})

		watch(
			() => data.token,
			(newValue) => {
				if (newValue) setUser({ anonymousToken: null })
			}
		)

		function setUser(values = {}) {
			for (let p in values) {
				if (data.value.hasOwnProperty(p)) {
					data.value[p] = values[p]
				}
			}
		}

		const isLogin = computed(() => !!data.value.token)
		const isExpert = computed(() => data.value.talent == 2)

		return { data, setUser, isLogin, isExpert }
	},
	{
		persistedState: {
			persist: true,
		},
	}
)
