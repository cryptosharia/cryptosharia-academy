<script lang="ts">
	const partners = [
		'Tokocrypto',
		'INDODAX',
		'Pintu',
		'Reku',
		'Bank Syariah Indonesia',
		'Astra Financial'
	];
</script>

<section class="bg-white py-16 dark:bg-gray-950">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2
			class="font-display mb-4 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white"
		>
			Bersama Experts dan Case Study dari Notable Companies
		</h2>
		<p class="mb-12 text-center text-lg text-slate-500 dark:text-gray-400">
			Materi disusun bersama para praktisi dari perusahaan terkemuka.
		</p>

		<div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
			{#each partners as partner (partner)}
				<div class="group relative px-2 py-2 transition-all duration-300">
					<span
						class="group-hover:text-primary-500 dark:group-hover:text-primary-400 font-display text-xl font-extrabold tracking-tight text-slate-300 transition-colors duration-300 select-none sm:text-2xl dark:text-slate-600"
					>
						{partner}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>
