<script lang="ts">
	const partners = [
		'Tokocrypto', 'INDODAX', 'Pintu', 'Reku', 'Bank Syariah Indonesia', 'Astra Financial'
	];
</script>

<section class="py-16 bg-white dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
			Bersama Experts dan Case Study dari Notable Companies
		</h2>
		<p class="text-center text-slate-500 dark:text-gray-400 mb-12">
			Materi disusun bersama para praktisi dari perusahaan terkemuka.
		</p>

		<div class="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
			{#each partners as partner}
				<div class="group flex items-center justify-center px-6 py-4 rounded-xl transition-all duration-300 hover:bg-primary-50 hover:shadow-sm">
					<span class="text-xl sm:text-2xl font-bold text-slate-300 dark:text-gray-500 group-hover:text-primary-600 transition-colors duration-300 font-display">
						{partner}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>
