<script lang="ts">
	const partners = ['Tokocrypto', 'INDODAX', 'Pintu', 'Reku', 'Bank Syariah Indonesia', 'Astra Financial'];
</script>

<section class="py-16 bg-white dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 class="text-center font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
			Bersama Experts dan Case Study dari Notable Companies
		</h2>
		<p class="text-center text-lg text-slate-500 dark:text-gray-400 mb-12">
			Materi disusun bersama para praktisi dari perusahaan terkemuka.
		</p>

		<div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
			{#each partners as partner}
				<div class="group relative px-2 py-2 transition-all duration-300">
					<span class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-300 dark:text-slate-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300 font-display select-none">
						{partner}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>
