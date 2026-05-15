<script lang="ts">
	const stats = [
		{ icon: '👥', value: '10,000+', label: 'Member Belajar Bersama' },
		{ icon: '🏢', value: 'Ribuan', label: 'Alumni Berkarir' },
		{ icon: '📜', value: 'Praktikal', label: 'Bersertifikat & Portfolio' },
		{ icon: '⭐', value: '4.9', label: 'Rating di Course Report' },
		{ icon: '📈', value: '500+', label: 'New Member / Bulan' }
	];
</script>

<section class="py-16 bg-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-12">
			Terbukti Berdampak dan Membuka Batasan
		</h2>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
			{#each stats as stat, i}
				<div
					class="group flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-300 hover:bg-primary-50 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-100/50 hover:-translate-y-1"
				>
					<div class="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">
						{stat.icon}
					</div>
					<div class="font-display text-2xl sm:text-3xl font-extrabold text-primary-600 mb-1">
						{stat.value}
					</div>
					<div class="text-sm text-slate-500 font-medium leading-tight">
						{stat.label}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
