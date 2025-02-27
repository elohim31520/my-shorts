<template>
	<ul>
		<li v-for="n in 20" :key="n">
			<van-image :src="`https://picsum.photos/200/300?random=${n}`" lazy-load />
		</li>
	</ul>
</template>
