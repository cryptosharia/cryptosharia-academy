<script lang="ts">
	const stats = [
		{ icon: '👥', value: '10,000+', label: 'Member Belajar Bersama' },
		{ icon: '🏢', value: 'Ribuan', label: 'Alumni Berkarir' },
		{ icon: '📜', value: 'Praktikal', label: 'Bersertifikat & Portfolio' },
		{ icon: '⭐', value: '4.9', label: 'Rating di Course Report' },
		{ icon: '📈', value: '500+', label: 'New Member / Bulan' }
	];
</script>

<section class="bg-white py-16 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2
			class="font-display mb-12 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white"
		>
			Terbukti Berdampak dan Membuka Batasan
		</h2>

		<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8">
			{#each stats as stat (stat)}
				<div
					class="group hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-200 hover:shadow-primary-100/50 flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="mb-3 text-4xl transition-transform duration-300 group-hover:scale-110">
						{stat.icon}
					</div>
					<div class="font-display text-primary-600 mb-1 text-2xl font-extrabold sm:text-3xl">
						{stat.value}
					</div>
					<div class="text-sm leading-tight font-medium text-slate-500 dark:text-gray-400">
						{stat.label}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
